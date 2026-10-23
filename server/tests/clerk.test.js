// No configured database or real Clerk API is contacted by this suite.
process.env.NODE_ENV = 'test';
process.env.AUTH_PROVIDER = 'clerk';
process.env.LOG_LEVEL = 'error';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/htg_clerk_unconnected';
const { generateKeyPairSync, randomBytes } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
process.env.CLERK_SECRET_KEY = 'sk_test_' + randomBytes(24).toString('hex');
process.env.CLERK_JWT_KEY = keys.publicKey.export({ type: 'spki', format: 'pem' });
process.env.CLERK_JWT_ISSUER_DOMAIN = 'https://fixture.clerk.accounts.dev';
process.env.CLERK_AUTHORIZED_PARTIES = 'http://localhost:5173';
const { it, before, after, beforeEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
// Reuse an installed executable, but always start a separate temporary server.
if (!process.env.MONGOMS_SYSTEM_BINARY && process.platform === 'win32') {
  const root = path.join(process.env.ProgramFiles || 'C:/Program Files', 'MongoDB', 'Server');
  if (fs.existsSync(root)) {
    for (const version of fs.readdirSync(root).sort().reverse()) {
      const binary = path.join(root, version, 'bin', 'mongod.exe');
      if (fs.existsSync(binary)) { process.env.MONGOMS_SYSTEM_BINARY = binary; break; }
    }
  }
}
if (process.env.MONGOMS_SYSTEM_BINARY) process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK = 'false';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const models = require('../src/models');
const { User, Team, Score, EventConfig } = models;
const clerk = require('../src/services/clerk.service');
let replica, server, base, user, sessionStatus, emailStatus, email, serial = 0;
const password = randomBytes(20).toString('hex');
function token(overrides = {}, options = {}) {
  return jwt.sign({ sub: 'user_fixture', sid: 'sess_fixture', iss: process.env.CLERK_JWT_ISSUER_DOMAIN,
    azp: 'http://localhost:5173', ...overrides }, keys.privateKey,
    { algorithm: 'RS256', keyid: 'fixture', expiresIn: '60s', ...options });
}
async function request(route, bearer = token(), body, method = body ? 'POST' : 'GET') {
  const res = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json',
    ...(bearer ? { Authorization: 'Bearer ' + bearer } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: res.status, body: await res.json() };
}
before(async () => {
  mock.method(clerk, 'getClient', () => ({
    sessions: {
      getSession: async () => ({ id: 'sess_fixture', userId: 'user_fixture', status: sessionStatus, expireAt: Date.now() + 60000 }),
      revokeSession: async () => { sessionStatus = 'revoked'; return { status: 'revoked' }; },
      getSessionList: async () => ({ data: [], totalCount: 0 })
    },
    users: { getUser: async () => ({ primaryEmailAddressId: 'id_email', emailAddresses: [
      { id: 'id_email', emailAddress: email, verification: { status: emailStatus } }
    ] }) }
  }));
  replica = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(replica.getUri('htg_clerk_' + Date.now()));
  for (const model of Object.values(models)) await model.init();
  server = require('../src/server').listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect(); if (replica) await replica.stop(); mock.restoreAll();
});
beforeEach(async () => {
  assert.ok(mongoose.connection.name.startsWith('htg_clerk_'));
  for (const model of Object.values(models)) await model.deleteMany({});
  sessionStatus = 'active'; emailStatus = 'verified'; email = `fixture${++serial}@example.test`;
  user = await User.create({ username: 'fixture' + serial, email, fullName: 'Synthetic fixture',
    passwordHash: password, role: 'TEAM_MEMBER', clerkUserId: 'user_fixture' });
  await EventConfig.create({ state: 'LIVE', registrationOpen: false });
});
it('verifies an actual RSA-signed Clerk session with the official SDK', async () => {
  const result = await request('/auth/me'); assert.equal(result.status, 200);
  assert.equal(result.body.data.user._id, String(user._id));
});
it('rejects missing, expired, wrong issuer, wrong party, pending and forged tokens', async () => {
  for (const bearer of [null, 'invalid', token({}, { expiresIn: -1 }), token({ iss: 'https://wrong.example' }),
    token({ azp: 'https://wrong.example' }), token({ sts: 'pending' }),
    jwt.sign({ sub: 'user_fixture' }, 'untrusted')]) {
    assert.equal((await request('/auth/me', bearer)).status, 401);
  }
});
it('rejects revoked sessions even before token expiration', async () => {
  sessionStatus = 'revoked'; assert.equal((await request('/auth/me')).status, 401);
});
it('regression: explicitly validates missing, string-literal null/undefined, expired, forged, and valid production issuer tokens', async () => {
  // 1. Missing / null / undefined string bearers
  const missingRes = await request('/auth/me', null);
  assert.equal(missingRes.status, 401);
  assert.equal(missingRes.body.message, 'Clerk Bearer session token required');

  const nullStrRes = await fetch(base + '/auth/me', { headers: { Authorization: 'Bearer null' } });
  assert.equal(nullStrRes.status, 401);
  const nullStrJson = await nullStrRes.json();
  assert.equal(nullStrJson.message, 'Clerk Bearer session token required');

  const undefStrRes = await fetch(base + '/auth/me', { headers: { Authorization: 'Bearer undefined' } });
  assert.equal(undefStrRes.status, 401);
  const undefStrJson = await undefStrRes.json();
  assert.equal(undefStrJson.message, 'Clerk Bearer session token required');

  // 2. Expired session token
  const expiredRes = await request('/auth/me', token({}, { expiresIn: -10 }));
  assert.equal(expiredRes.status, 401);

  // 3. Forged / invalid signature
  const otherKeys = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const forgedToken = jwt.sign({ sub: 'user_fixture', sid: 'sess_fixture', iss: process.env.CLERK_JWT_ISSUER_DOMAIN, azp: 'http://localhost:5173' },
    otherKeys.privateKey, { algorithm: 'RS256', keyid: 'forged', expiresIn: '60s' });
  const forgedRes = await request('/auth/me', forgedToken);
  assert.equal(forgedRes.status, 401);
  assert.equal(forgedRes.body.message, 'Invalid or expired Clerk session');

  // 4. Valid session token with production domain issuer
  const prodIssuerToken = token({ iss: 'https://clerk.the-tech-mystery.vercel.app', azp: 'https://the-tech-mystery.vercel.app' });
  const prodRes = await request('/auth/me', prodIssuerToken);
  assert.equal(prodRes.status, 200);
  assert.equal(prodRes.body.data.user._id, String(user._id));

  // 5. Valid session token with apex domain issuer
  const apexIssuerToken = token({ iss: 'https://the-tech-mystery.vercel.app', azp: 'https://the-tech-mystery.vercel.app' });
  const apexRes = await request('/auth/me', apexIssuerToken);
  assert.equal(apexRes.status, 200);
  assert.equal(apexRes.body.data.user._id, String(user._id));

  // 6. Valid session token with production proxy issuer (https://<domain>/__clerk)
  const proxyIssuerToken = token({ iss: 'https://the-tech-mystery.vercel.app/__clerk', azp: 'https://the-tech-mystery.vercel.app' });
  const proxyRes = await request('/auth/me', proxyIssuerToken);
  assert.equal(proxyRes.status, 200);
  assert.equal(proxyRes.body.data.user._id, String(user._id));

  // 7. Valid session token with production proxy trailing-slash issuer
  const proxySlashToken = token({ iss: 'https://the-tech-mystery.vercel.app/__clerk/', azp: 'https://the-tech-mystery.vercel.app' });
  const proxySlashRes = await request('/auth/me', proxySlashToken);
  assert.equal(proxySlashRes.status, 200);
  assert.equal(proxySlashRes.body.data.user._id, String(user._id));

  // 8. Reject unrelated and unauthorized issuers
  const unrelatedRes = await request('/auth/me', token({ iss: 'https://unrelated.example.com', azp: 'https://the-tech-mystery.vercel.app' }));
  assert.equal(unrelatedRes.status, 401);

  const unrelatedProxyRes = await request('/auth/me', token({ iss: 'https://unrelated.example.com/__clerk', azp: 'https://the-tech-mystery.vercel.app' }));
  assert.equal(unrelatedProxyRes.status, 401);

  const attackerRes = await request('/auth/me', token({ iss: 'https://attacker.org', azp: 'https://the-tech-mystery.vercel.app' }));
  assert.equal(attackerRes.status, 401);
});
it('allows bounded clock drift but rejects tokens issued far in the future', async () => {
  const now = Math.floor(Date.now() / 1000);
  assert.equal((await request('/auth/me', token({ iat: now + 2 }))).status, 200);
  assert.equal((await request('/auth/me', token({ iat: now + 30 }))).status, 401);
});
it('rejects inactive and unlinked MongoDB accounts', async () => {
  await User.updateOne({ _id: user._id }, { isActive: false });
  assert.equal((await request('/auth/me')).body.errorCode, 'ACCOUNT_INACTIVE');
  await User.updateOne({ _id: user._id }, { $unset: { clerkUserId: 1 } });
  assert.equal((await request('/auth/me')).body.errorCode, 'CLERK_ACCOUNT_UNLINKED');
});
it('ignores privileged token metadata and keeps participant admin access forbidden', async () => {
  assert.equal((await request('/admin/teams', token({ role: 'ADMIN', public_metadata: { role: 'ADMIN' } }))).status, 403);
});
it('loads roles and team membership from MongoDB on every request', async () => {
  const team = await Team.create({ name: 'Fixture team', joinCode: 'FIXTURE001', leaderId: user._id, members: [user._id] });
  await User.updateOne({ _id: user._id }, { role: 'TEAM_LEADER', teamId: team._id });
  const result = await request('/auth/me'); assert.equal(result.body.data.user.role, 'TEAM_LEADER');
  assert.equal(String(result.body.data.user.teamId._id || result.body.data.user.teamId), String(team._id));
});
it('keeps public leaderboard public and password auth disabled in Clerk mode', async () => {
  assert.equal((await request('/leaderboard', null)).status, 200);
  assert.equal((await request('/auth/login', null, {})).status, 404);
  assert.equal((await request('/auth/register', null, {})).status, 404);
});
it('links only with verified matching email and existing password, preserving IDs, hashes, role, team and scores', async () => {
  await User.updateOne({ _id: user._id }, { $unset: { clerkUserId: 1 } });
  const team = await Team.create({ name: 'History fixture', joinCode: 'FIXTURE002', leaderId: user._id, members: [user._id] });
  await User.updateOne({ _id: user._id }, { role: 'TEAM_LEADER', teamId: team._id });
  const score = await Score.create({ teamId: team._id, currentScore: 123 });
  const original = await User.findById(user._id).select('+passwordHash');
  const credentials = { emailOrUsername: user.username, password };
  assert.equal((await request('/auth/clerk/link', token(), { ...credentials, password: 'wrong' })).status, 403);
  emailStatus = 'unverified'; assert.equal((await request('/auth/clerk/link', token(), credentials)).status, 403);
  emailStatus = 'verified'; email = 'other@example.test'; assert.equal((await request('/auth/clerk/link', token(), credentials)).status, 403);
  email = user.email; assert.equal((await request('/auth/clerk/link', token(), credentials)).status, 200);
  const linked = await User.findById(user._id).select('+passwordHash +clerkUserId');
  assert.equal(linked.passwordHash, original.passwordHash); assert.equal(linked.clerkUserId, 'user_fixture');
  assert.equal(linked.role, 'TEAM_LEADER'); assert.equal(String(linked.teamId), String(team._id));
  assert.deepEqual((await Score.findById(score._id)).toObject(), score.toObject());
  assert.equal(await User.countDocuments(), 1);
  assert.equal((await request('/auth/clerk/link', token(), credentials)).status, 403);
});
it('forbids administrator self-linking', async () => {
  await User.updateOne({ _id: user._id }, { $unset: { clerkUserId: 1 }, $set: { role: 'ADMIN' } });
  assert.equal((await request('/auth/clerk/link', token(), { emailOrUsername: user.username, password })).status, 403);
});
it('requires open registration and creates only an unteamed participant using verified identity', async () => {
  await User.updateOne({ _id: user._id }, { $unset: { clerkUserId: 1 } }); email = 'new@example.test';
  const payload = { username: 'new_participant', fullName: 'New Fixture', role: 'ADMIN', teamId: String(user._id), email: 'attacker@example.test' };
  assert.equal((await request('/auth/clerk/register', token(), payload)).status, 403);
  await EventConfig.updateOne({}, { registrationOpen: true });
  const result = await request('/auth/clerk/register', token(), payload); assert.equal(result.status, 201);
  const created = await User.findOne({ username: payload.username }).select('+passwordHash');
  assert.equal(created.role, 'TEAM_MEMBER'); assert.equal(created.teamId, null);
  assert.equal(created.email, email); assert.equal(created.passwordHash, undefined);
  assert.equal(await Team.countDocuments(), 0);
  assert.equal((await request('/auth/clerk/register', token(), payload)).status, 409);
});
it('never auto-links an existing email during new registration', async () => {
  await User.updateOne({ _id: user._id }, { $unset: { clerkUserId: 1 } });
  await EventConfig.updateOne({}, { registrationOpen: true });
  assert.equal((await request('/auth/clerk/register', token(), { username: 'duplicate', fullName: 'Fixture' })).status, 409);
});
it('logout revokes the verified Clerk session', async () => {
  assert.equal((await request('/auth/logout', token(), {})).status, 200);
  assert.equal((await request('/auth/me')).status, 401);
});
it('retains gameplay membership requirements for Clerk users', async () => {
  assert.equal((await request('/challenges/current')).status, 403);
  assert.deepEqual(require('../src/services/auth.service').generateTokens(user), {});
});
it('fails closed if unique mapping index is missing', async () => {
  await User.collection.dropIndex('clerkUserId_1');
  try { assert.equal((await request('/auth/clerk/register', token(), { username: 'fixture_new', fullName: 'Fixture' })).status, 503); }
  finally { await User.collection.createIndex({ clerkUserId: 1 }, { unique: true, sparse: true }); }
});
it('regression: recognizes equivalent approved identity index definitions (custom name and descending key)', async () => {
  await User.collection.dropIndex('clerkUserId_1');
  // Create an equivalent approved index with descending direction and custom name
  await User.collection.createIndex({ clerkUserId: -1 }, { name: 'custom_unique_clerk_idx', unique: true, sparse: true });
  try {
    await User.updateOne({ _id: user._id }, { $unset: { clerkUserId: 1 } });
    email = 'equivalent@example.test';
    await EventConfig.updateOne({}, { registrationOpen: true });
    const res = await request('/auth/clerk/register', token(), { username: 'equiv_user', fullName: 'Equiv User' });
    assert.equal(res.status, 201);
  } finally {
    await User.collection.dropIndex('custom_unique_clerk_idx');
    await User.collection.createIndex({ clerkUserId: 1 }, { unique: true, sparse: true });
  }
});
it('regression: rejects non-unique or composite index definitions as unapproved', async () => {
  await User.collection.dropIndex('clerkUserId_1');
  // Create a non-unique index on clerkUserId
  await User.collection.createIndex({ clerkUserId: 1 }, { name: 'non_unique_clerk_idx' });
  try {
    const res = await request('/auth/clerk/register', token(), { username: 'insecure_user', fullName: 'Insecure User' });
    assert.equal(res.status, 503);
    assert.equal(res.body.message, 'Account mapping requires the approved unique identity index');
  } finally {
    await User.collection.dropIndex('non_unique_clerk_idx');
    await User.collection.createIndex({ clerkUserId: 1 }, { unique: true, sparse: true });
  }
});
it('fails closed for missing Clerk configuration, unexpected providers and development keys in production', () => {
  const environment = require.resolve('../src/config/environment');
  for (const override of [ { CLERK_SECRET_KEY: '' }, { CLERK_JWT_ISSUER_DOMAIN: 'http://insecure.example' },
    { CLERK_AUTHORIZED_PARTIES: '' }, { AUTH_PROVIDER: 'unknown' }, { NODE_ENV: 'production' } ]) {
    const result = spawnSync(process.execPath, ['-e', `require(${JSON.stringify(environment)})`],
      { env: { ...process.env, ...override }, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
  }
});
it('preserves valid gameplay authorization and private-answer redaction with Clerk sessions', async () => {
  const member = await User.create({ username: 'member_fixture', email: 'member@example.test', fullName: 'Fixture', passwordHash: password });
  const team = await Team.create({ name: 'Clerk gameplay', joinCode: 'FIXTURE003', leaderId: user._id, members: [user._id, member._id] });
  await User.updateMany({ _id: { $in: [user._id, member._id] } }, { teamId: team._id });
  await User.updateOne({ _id: user._id }, { role: 'TEAM_LEADER' });
  await Score.create({ teamId: team._id });
  const challenge = await models.Challenge.create({ levelNumber: 1, title: 'Fixture challenge', description: 'Analyze artifact',
    category: 'CRYPTOGRAPHY', points: 100, requiresCheckpointScan: false });
  const answer = randomBytes(20).toString('hex');
  await models.Question.create({ challengeId: challenge._id, levelNumber: 1, title: 'Fixture question',
    prompt: 'Find the artifact answer', category: 'CRYPTOGRAPHY', flag: answer, attempts: 3 });
  const current = await request('/challenges/current'); assert.equal(current.status, 200);
  assert.ok(!JSON.stringify(current.body).includes(answer));
  const solve = await request('/submissions/submit', token(), { levelNumber: 1, flag: answer });
  assert.equal(solve.status, 200);
  assert.equal((await Score.findOne({ teamId: team._id })).currentScore, 100);
});
it('uses database administrator authority without issuing legacy JWTs', async () => {
  const bearer = token({ role: 'TEAM_MEMBER' });
  await User.updateOne({ _id: user._id }, { role: 'ADMIN' });
  assert.equal((await request('/admin/teams', bearer)).status, 200);
  const revoke = await request('/admin/sessions/revoke', bearer, {});
  assert.equal(revoke.status, 200); assert.equal(revoke.body.data.accessToken, undefined);
});
it('revokes only other sessions and confirms each provider response', async () => {
  const revoked = [];
  const stub = mock.method(clerk, 'getClient', () => ({ sessions: {
    getSessionList: async () => ({ data: [{ id: 'sess_current', userId: 'user_fixture' }, { id: 'sess_other', userId: 'user_fixture' }], totalCount: 2 }),
    revokeSession: async id => { revoked.push(id); return { status: 'revoked' }; }
  } }));
  try {
    assert.equal(await clerk.revokeOtherSessions({ clerkUserId: 'user_fixture', sessionId: 'sess_current' }), 1);
    assert.deepEqual(revoked, ['sess_other']);
  } finally { stub.mock.restore(); }
});

it('allows an authenticated unteamed Clerk participant to register a squad via /teams/create and /teams/register', async () => {
  await EventConfig.updateOne({}, { registrationOpen: true });
  await User.updateOne({ _id: user._id }, { clerkUserId: 'user_fixture', teamId: null, role: 'TEAM_MEMBER' });

  // 1. Legacy /auth/register fails closed with 404 in Clerk mode
  const legacyRegRes = await request('/auth/register', null, { username: 'test' });
  assert.equal(legacyRegRes.status, 404);

  // 2. Unauthenticated request to /teams/register is rejected with 401
  const unauthRegRes = await request('/teams/register', null, { name: 'Unauth Squad' });
  assert.equal(unauthRegRes.status, 401);

  // 3. Authenticated request to /teams/register successfully creates team
  const regRes = await request('/teams/register', token(), { name: 'Alpha Squad', college: "Tula's University" });
  assert.equal(regRes.status, 201);
  assert.equal(regRes.body.data.team.name, 'Alpha Squad');
  assert.ok(regRes.body.data.team.joinCode);

  // User is now promoted to TEAM_LEADER with teamId
  const updatedLeader = await User.findById(user._id);
  assert.equal(updatedLeader.role, 'TEAM_LEADER');
  assert.equal(String(updatedLeader.teamId), String(regRes.body.data.team._id));

  // 4. Duplicate team creation for an already teamed user is rejected with 400
  const dupeRes = await request('/teams/create', token(), { name: 'Beta Squad' });
  assert.equal(dupeRes.status, 400);
});

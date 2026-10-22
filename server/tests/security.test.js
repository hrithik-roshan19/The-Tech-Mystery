// This suite NEVER connects to .env's MongoDB or to an existing HTTP server.
process.env.NODE_ENV = 'test';
process.env.AUTH_PROVIDER = 'jwt';
process.env.LOG_LEVEL = 'error';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/htg_security_unconnected';
const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { MongoMemoryReplSet, MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('node:fs');
const path = require('node:path');
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
const models = require('../src/models');
const { User, Team, Challenge, Question, TeamChallenge, Checkpoint, EventConfig, Score, Submission, SecurityLog } = models;
const auth = require('../src/services/auth.service');
const { generateCheckpointToken } = require('../src/utils/crypto');
let replica, server, base, serial = 0;
let leader, member, admin, team, challenge, question, checkpoint, secret;
const password = crypto.randomBytes(18).toString('hex');

async function account(role = 'TEAM_MEMBER') {
  const name = `security_${++serial}`;
  return User.create({ username: name, email: `${name}@example.test`, fullName: 'Security fixture',
    passwordHash: password, role });
}
function token(user) { return auth.generateTokens(user).accessToken; }
async function request(path, user, body, method = body ? 'POST' : 'GET', rawToken) {
  const response = await fetch(base + path, { method,
    headers: { 'Content-Type': 'application/json', ...(user || rawToken ? { Authorization: `Bearer ${rawToken || token(user)}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, body: await response.json() };
}
async function submit(value, user = leader) { return request('/submissions/submit', user, { levelNumber: 1, flag: value }); }
async function review(id, result = 'Correct', points) {
  return request(`/admin/submissions/${id}/review`, admin, { result, ...(points === undefined ? {} : { points }) }, 'PATCH');
}
async function assignment() { await request('/challenges/current', leader); return TeamChallenge.findOne({ teamId: team._id }); }

before(async () => {
  replica = await MongoMemoryReplSet.create({ replSet: { count: 1 }, instanceOpts: [{ dbName: `htg_security_${Date.now()}` }] });
  const uri = replica.getUri(`htg_security_${Date.now()}`);
  assert.ok(uri.includes('htg_security_'), 'Test database must have isolated name');
  await mongoose.connect(uri);
  for (const model of Object.values(models)) await model.init();
  server = require('../src/server').listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  if (replica) await replica.stop();
});
beforeEach(async () => {
  assert.ok(mongoose.connection.name.startsWith('htg_security_'), 'Refuse fixture reset outside isolated database');
  for (const model of Object.values(models)) await model.deleteMany({});
  await EventConfig.create({ state: 'LIVE', minTeamSize: 2, maxTeamSize: 4, registrationOpen: true });
  leader = await account('TEAM_LEADER'); member = await account(); admin = await account('ADMIN');
  team = await Team.create({ name: `Fixture ${++serial}`, joinCode: `HTG-${serial.toString().padStart(6, '0')}`,
    leaderId: leader._id, members: [leader._id, member._id] });
  for (const user of [leader, member]) { user.teamId = team._id; await user.save(); }
  await Score.create({ teamId: team._id });
  challenge = await Challenge.create({ levelNumber: 1, title: 'Fixture challenge', description: 'Recover the artifact answer',
    category: 'CRYPTOGRAPHY', points: 100, requiresCheckpointScan: false });
  secret = crypto.randomBytes(24).toString('hex');
  question = await Question.create({ challengeId: challenge._id, levelNumber: 1, title: 'Fixture question',
    prompt: 'Analyze the organizer-provided artifact.', category: 'CRYPTOGRAPHY', flag: secret, attempts: 3,
    hints: [{ hintIndex: 1, content: 'Private hint', penaltyPoints: 20 }], metadata: { answerKey: secret } });
  checkpoint = await Checkpoint.create({ levelNumber: 1, name: 'Fixture station', locationDescription: 'Authorized test area',
    checkpointCode: 'CP-TEST', associatedChallengeId: challenge._id, mode: 'Public QR' });
});

describe('Participant data and access control', () => {
  it('omits private question fields and redacts legacy answer-bearing text', async () => {
    await Question.collection.updateOne({ _id: question._id }, { $set: { prompt: `legacy ${secret}`, title: `legacy ${secret}` } });
    const response = await request('/challenges/current', leader);
    assert.equal(response.status, 200);
    const json = JSON.stringify(response.body);
    assert.ok(!json.includes(secret), 'Response must not contain private answer');
    assert.ok(!Object.hasOwn(response.body.data.question, 'flag'));
    assert.ok(!Object.hasOwn(response.body.data.question, 'metadata'));
    assert.ok(!Object.hasOwn(response.body.data.question, 'hints'));
  });
  it('rejects newly authored answer-bearing prompts without echoing answers', async () => {
    const response = await request(`/admin/questions/${question._id}`, admin, { prompt: `unsafe ${secret}` }, 'PATCH');
    assert.equal(response.status, 400);
    assert.ok(!JSON.stringify(response.body).includes(secret), 'Validation must not echo answers');
  });
  it('preserves authorized admin answer access', async () => {
    const response = await request('/admin/questions?includeAnswers=true', admin);
    assert.equal(response.status, 200);
    // Admin manager defaults to including answers; only assert without printing them.
    assert.ok(JSON.stringify(response.body).includes(secret), 'Authorized admin can access answer');
    assert.equal((await request('/admin/questions', member)).status, 403);
    assert.equal((await request('/admin/questions')).status, 401);
  });
  it('limits join-code retrieval to leader and admin across all participant endpoints', async () => {
    const publicResponse = await request('/leaderboard');
    assert.equal(publicResponse.status, 200);
    assert.ok(!JSON.stringify(publicResponse.body).includes(team.joinCode), 'Public invitation disclosure');
    for (const path of ['/teams/me', `/teams/${team._id}`, '/auth/me', '/auth/profile']) {
      assert.ok(!JSON.stringify((await request(path, member)).body).includes(team.joinCode), 'Member invitation disclosure');
      assert.ok(JSON.stringify((await request(path, leader)).body).includes(team.joinCode), 'Leader can retrieve invitation');
    }
    assert.ok(JSON.stringify((await request(`/teams/${team._id}`, admin)).body).includes(team.joinCode));
  });
  it('allows only team leaders and admins to rotate invitations, invalidating old codes', async () => {
    const route = `/teams/${team._id}/join-code/rotate`;
    const outsider = await account('TEAM_LEADER');
    assert.equal((await request(route, member, {})).status, 403);
    assert.equal((await request(route, outsider, {})).status, 403);
    const rotated = await request(route, leader, {});
    assert.equal(rotated.status, 200);
    assert.ok(rotated.body.data.joinCode !== team.joinCode, 'Invitation must change');
    assert.equal(rotated.body.data.joinCode.length, 36);
    const joiner = await account();
    assert.equal((await request('/teams/join', joiner, { joinCode: team.joinCode })).status, 400);
    assert.equal((await request('/teams/join', joiner, { joinCode: rotated.body.data.joinCode })).status, 200);
    assert.equal((await request(route, admin, {})).status, 200);
  });
  it('does not echo submitted secrets through validator errors' , async () => {
    const response = await submit(secret.repeat(10));
    assert.equal(response.status, 400);
    assert.ok(!JSON.stringify(response.body).includes(secret), 'Validation must omit submitted values');
  });
});

describe('Signed checkpoint eligibility', () => {
  it('rejects missing, malformed, legacy, expired and tampered signatures', async () => {
    const valid = generateCheckpointToken('CP-TEST', 1);
    for (const signature of [undefined, '', 'invalid', 'a'.repeat(64), valid.slice(0, -1) + (valid.endsWith('0') ? '1' : '0'),
      generateCheckpointToken('CP-TEST', 1, { expiresAt: Math.floor(Date.now() / 1000) - 1 })]) {
      const response = await request('/checkpoints/scan', leader, { code: 'CP-TEST', token: signature });
      assert.equal(response.status, 400);
      assert.ok(!JSON.stringify(response.body).includes(valid), 'Never echo checkpoint token');
    }
    assert.equal(await TeamChallenge.countDocuments(), 0);
  });
  it('accepts explicit public signed QR without awarding points', async () => {
    const signature = generateCheckpointToken('CP-TEST', 1);
    const response = await request('/checkpoints/scan', leader, { code: 'CP-TEST', token: signature });
    assert.equal(response.status, 200);
    assert.equal((await Team.findById(team._id)).totalScore, 0);
    assert.ok(!JSON.stringify(response.body).includes(signature), 'Do not echo signed token');
  });
  it('enforces team-bound QR and does not allow public signature substitution', async () => {
    checkpoint.mode = 'Team-bound QR'; checkpoint.boundTeamId = team._id; await checkpoint.save();
    const wrong = generateCheckpointToken('CP-TEST', 1, { teamId: new mongoose.Types.ObjectId() });
    for (const signature of [wrong, generateCheckpointToken('CP-TEST', 1)]) {
      assert.equal((await request('/checkpoints/scan', leader, { code: 'CP-TEST', token: signature })).status, 400);
    }
    const signature = generateCheckpointToken('CP-TEST', 1, { teamId: team._id });
    assert.equal((await request('/checkpoints/scan', leader, { code: 'CP-TEST', token: signature })).status, 200);
  });
  it('blocks locked checkpoint levels even with a valid signature', async () => {
    checkpoint.levelNumber = 2; await checkpoint.save();
    assert.equal((await request('/checkpoints/scan', leader, { code: 'CP-TEST', token: generateCheckpointToken('CP-TEST', 2) })).status, 400);
  });
});

describe('Transactional scoring and review', () => {
  it('awards once under concurrent correct submissions', async () => {
    const responses = await Promise.all(Array.from({ length: 8 }, () => submit(secret)));
    assert.equal(responses.filter(r => r.status === 200).length, 1);
    assert.equal((await Team.findById(team._id)).totalScore, 100);
    assert.equal((await Team.findById(team._id)).currentLevel, 2);
    assert.equal((await Score.findOne({ teamId: team._id })).currentScore, 100);
    assert.equal(await Submission.countDocuments({ isCorrect: true }), 1);
  });
  it('caps attempts under concurrent incorrect submissions', async () => {
    await Promise.all(Array.from({ length: 9 }, () => submit('incorrect fixture answer')));
    assert.equal((await TeamChallenge.findOne({ teamId: team._id })).attemptsCount, 3);
    assert.equal(await Submission.countDocuments(), 3);
    assert.equal((await Team.findById(team._id)).totalScore, 0);
  });
  it('rolls back the solve, attempt and submission if the final audit write fails', async () => {
    const original = SecurityLog.create;
    SecurityLog.create = async () => { throw new Error('Injected audit failure'); };
    try { assert.equal((await submit(secret)).status, 400); } finally { SecurityLog.create = original; }
    assert.equal(await Submission.countDocuments(), 0);
    assert.equal((await Team.findById(team._id)).currentLevel, 1);
    assert.equal((await Score.findOne({ teamId: team._id })).currentScore, 0);
    assert.equal((await submit(secret)).status, 200);
  });
  it('prevents concurrent approvals of different attempts from awarding twice', async () => {
    await submit('incorrect fixture one'); await submit('incorrect fixture two');
    const submissions = await Submission.find();
    const responses = await Promise.all(submissions.map(s => review(s._id)));
    assert.equal(responses.filter(r => r.status === 200).length, 1);
    assert.equal((await Team.findById(team._id)).totalScore, 100);
    assert.equal((await Score.findOne({ teamId: team._id })).solvedLevelsCount, 1);
  });
  it('audits point correction and reversal, and never advances incorrect reviews', async () => {
    await submit('incorrect fixture one');
    const submission = await Submission.findOne();
    assert.equal((await review(submission._id, 'Incorrect')).status, 200);
    assert.equal((await Team.findById(team._id)).currentLevel, 1);
    assert.equal((await review(submission._id)).status, 200);
    assert.equal((await review(submission._id, 'Correct', 40)).status, 200);
    assert.equal((await Team.findById(team._id)).totalScore, 40);
    assert.equal((await Score.findOne({ teamId: team._id })).solvedLevelsCount, 1);
    assert.equal((await review(submission._id, 'Incorrect')).status, 200);
    assert.equal((await Team.findById(team._id)).totalScore, 0);
    assert.equal((await Team.findById(team._id)).currentLevel, 1);
    assert.equal((await Score.findOne({ teamId: team._id })).solvedLevelsCount, 0);
    assert.equal(await SecurityLog.countDocuments({ event: 'Score decision recorded' }), 4);
  });
  it('prevents concurrent approval of the same submission from duplicating score', async () => {
    await submit('incorrect fixture one');
    const submission = await Submission.findOne();
    const responses = await Promise.all(Array.from({ length: 5 }, () => review(submission._id)));
    assert.equal(responses.filter(r => r.status === 200).length, 1);
    assert.equal((await Team.findById(team._id)).totalScore, 100);
  });
  it('retains gameplay history when deletion is attempted', async () => {
    await submit(secret);
    assert.equal((await request(`/admin/teams/${team._id}`, admin, undefined, 'DELETE')).status, 400);
    assert.equal(await Submission.countDocuments(), 1);
    assert.equal((await request(`/admin/challenges/${challenge._id}`, admin, undefined, 'DELETE')).status, 400);
    assert.equal((await request(`/admin/questions/${question._id}`, admin, undefined, 'DELETE')).status, 400);
    assert.equal(await TeamChallenge.countDocuments(), 1);
  });
  it('rejects direct administrative score/progression overrides' , async () => {
    assert.equal((await request(`/admin/teams/${team._id}`, admin, { totalScore: 100 }, 'PATCH')).status, 400);
    assert.equal((await Team.findById(team._id)).totalScore, 0);
  });
});

describe('Membership races and lifecycle', () => {
  it('creates the complete organizer-approved team from existing accounts atomically', async () => {
    const approvedLeader = await account();
    const approvedMembers = [await account(), await account()];
    const response = await request('/admin/teams', admin, { name: 'Approved synthetic roster',
      leaderEmailOrUsername: approvedLeader.email, memberIdentifiers: approvedMembers.map(user => user.email) });
    assert.equal(response.status, 201);
    const created = await Team.findOne({ name: 'Approved synthetic roster' });
    assert.equal(created.members.length, 3);
    assert.equal(created.totalScore, 0);
    assert.equal(created.currentLevel, 1);
    for (const user of [approvedLeader, ...approvedMembers]) {
      const stored = await User.findById(user._id);
      assert.equal(String(stored.teamId), String(created._id));
      assert.equal(stored.role, user === approvedLeader ? 'TEAM_LEADER' : 'TEAM_MEMBER');
    }
    assert.equal((await Score.findOne({ teamId: created._id })).currentScore, 0);
  });
  it('rolls back organizer roster creation if any approved member cannot be resolved', async () => {
    const approvedLeader = await account();
    const approvedMember = await account();
    const response = await request('/admin/teams', admin, { name: 'Invalid synthetic roster',
      leaderEmailOrUsername: approvedLeader.email,
      memberIdentifiers: [approvedMember.email, 'unregistered@example.test'] });
    assert.equal(response.status, 400);
    assert.equal(await Team.countDocuments({ name: 'Invalid synthetic roster' }), 0);
    for (const user of [approvedLeader, approvedMember]) assert.equal((await User.findById(user._id)).teamId, null);
  });
  it('does not permit participant registration payloads to assign roles or enroll other people', async () => {
    const before = await User.countDocuments();
    const response = await request('/auth/register', null, { username: 'self_registration_fixture',
      email: 'self_registration_fixture@example.test', fullName: 'Synthetic participant', password,
      role: 'ADMIN', teamId: String(team._id), members: [{ email: 'not-consented@example.test', name: 'Not enrolled' }] });
    assert.equal(response.status, 201);
    assert.equal(await User.countDocuments(), before + 1);
    const stored = await User.findOne({ username: 'self_registration_fixture' });
    assert.equal(stored.role, 'TEAM_MEMBER');
    assert.equal(stored.teamId, null);
    assert.equal(await User.countDocuments({ email: 'not-consented@example.test' }), 0);
  });
  it('rejects invalid invitations and existing-member enrollment', async () => {
    const outsider = await account();
    assert.equal((await request('/teams/join', outsider, { joinCode: 'INVALID' })).status, 400);
    assert.equal((await request('/teams/join', member, { joinCode: team.joinCode })).status, 400);
  });
  it('admits only one user into the final available team slot', async () => {
    team.maxMembers = 3; await team.save();
    const outsiders = await Promise.all([account(), account(), account()]);
    const responses = await Promise.all(outsiders.map(u => request('/teams/join', u, { joinCode: team.joinCode })));
    assert.equal(responses.filter(r => r.status === 200).length, 1);
    assert.equal((await Team.findById(team._id)).members.length, 3);
    for (let i = 0; i < responses.length; i++) assert.ok(!JSON.stringify(responses[i].body).includes(team.joinCode), 'Joining member cannot retrieve invitation');
  });
  it('allows single-team enrollment under competing join requests', async () => {
    const otherLeader = await account('TEAM_LEADER');
    const otherTeam = await Team.create({ name: `Other ${++serial}`, joinCode: 'HTG-OTHER1', leaderId: otherLeader._id, members: [otherLeader._id] });
    const outsider = await account();
    const responses = await Promise.all([team, otherTeam].map(t => request('/teams/join', outsider, { joinCode: t.joinCode })));
    assert.equal(responses.filter(r => r.status === 200).length, 1);
    assert.equal(await Team.countDocuments({ members: outsider._id }), 1);
  });
  it('allows only one team creation for concurrent requests by the same user', async () => {
    const outsider = await account();
    const responses = await Promise.all([1, 2].map(n => request('/teams/create', outsider, { name: `Concurrent ${n}` })));
    assert.equal(responses.filter(r => r.status === 201).length, 1);
    assert.equal(await Team.countDocuments({ leaderId: outsider._id }), 1);
  });
  it('requires LIVE for scans, challenge access and submissions', async () => {
    for (const state of ['DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'PAUSED', 'CONCLUDED']) {
      await EventConfig.updateOne({}, { state });
      assert.equal((await submit(secret)).status, 403);
      assert.equal((await request('/challenges/current', leader)).status, 403);
      assert.equal((await request('/checkpoints/scan', leader, { code: 'CP-TEST', token: generateCheckpointToken('CP-TEST', 1) })).status, 403);
    }
    assert.equal(await Submission.countDocuments(), 0);
  });
  it('enforces registration controls before account creation', async () => {
    await EventConfig.updateOne({}, { registrationOpen: false });
    const count = await User.countDocuments();
    const response = await request('/auth/register', null, { username: 'new_fixture', email: 'new@example.test', password, fullName: 'Fixture' });
    assert.equal(response.status, 403);
    assert.equal(await User.countDocuments(), count);
  });
  it('enforces maintenance and event time boundaries', async () => {
    for (const settings of [{ maintenanceMode: true }, { startTime: new Date(Date.now() + 60000) },
      { endTime: new Date(Date.now() - 60000) }]) {
      await EventConfig.updateOne({}, { maintenanceMode: false, startTime: null, endTime: null, ...settings });
      assert.equal((await submit(secret)).status, 403);
    }
  });
  it('caps concurrent team registration at the event limit', async () => {
    await EventConfig.updateOne({}, { maxTeams: 2 });
    const users = await Promise.all([account(), account()]);
    const responses = await Promise.all(users.map((u, i) => request('/teams/create', u, { name: `Limited fixture ${i}` })));
    assert.equal(responses.filter(r => r.status === 201).length, 1);
    assert.equal(await Team.countDocuments(), 2);
  });
  it('rejects invalid administrative team-size settings', async () => {
    assert.equal((await request('/admin/event-config', admin, { minTeamSize: 1 }, 'PATCH')).status, 400);
    assert.equal((await request('/admin/event-config', admin, { minTeamSize: 4, maxTeamSize: 2 }, 'PATCH')).status, 400);
    assert.equal((await EventConfig.findOne()).minTeamSize, 2);
  });
  it('blocks undersized and disqualified teams'  , async () => {
    team.members = [leader._id]; await team.save();
    assert.equal((await submit(secret)).status, 403);
    team.members = [leader._id, member._id]; team.isDisqualified = true; await team.save();
    assert.equal((await submit(secret)).status, 403);
  });
  it('blocks paused challenges and assigned questions on direct requests', async () => {
    await assignment();
    await Challenge.updateOne({}, { status: 'Paused' });
    assert.equal((await submit(secret)).status, 400);
    await Challenge.updateOne({}, { status: 'Published' });
    await Question.updateOne({}, { status: 'Paused' });
    assert.equal((await submit(secret)).status, 400);
    assert.equal((await request('/challenges/current', leader)).status, 400);
  });
});

describe('Session and production configuration security', () => {
  it('uses database roles and active membership instead of stale JWT claims', async () => {
    const oldToken = token(admin);
    await User.updateOne({ _id: admin._id }, { role: 'TEAM_MEMBER' });
    assert.equal((await request('/admin/dashboard-stats', null, undefined, 'GET', oldToken)).status, 403);
    await User.updateOne({ _id: member._id }, { teamId: null });
    assert.equal((await request('/challenges/current', member)).status, 403);
    await User.updateOne({ _id: leader._id }, { isActive: false });
    assert.equal((await request('/auth/me', leader)).status, 401);
  });
  it('actually rejects revoked admin tokens and returns a usable replacement', async () => {
    const oldToken = token(admin);
    const revoked = await request('/admin/sessions/revoke', null, {}, 'POST', oldToken);
    assert.equal(revoked.status, 200);
    assert.equal((await request('/admin/dashboard-stats', null, undefined, 'GET', oldToken)).status, 401);
    assert.equal((await request('/admin/dashboard-stats', null, undefined, 'GET', revoked.body.data.accessToken)).status, 200);
  });
  it('logout invalidates tokens; public optional authentication remains public', async () => {
    const oldToken = token(leader);
    assert.equal((await request('/auth/logout', null, {}, 'POST', oldToken)).status, 200);
    assert.equal((await request('/auth/me', null, undefined, 'GET', oldToken)).status, 401);
    assert.equal((await request('/leaderboard', null, undefined, 'GET', oldToken)).status, 200);
  });
  it('password change invalidates existing sessions and login issues access-only tokens', async () => {
    const oldToken = token(leader);
    const nextPassword = crypto.randomBytes(18).toString('hex');
    assert.equal((await request('/auth/change-password', null, { currentPassword: password, newPassword: nextPassword }, 'POST', oldToken)).status, 200);
    assert.equal((await request('/auth/me', null, undefined, 'GET', oldToken)).status, 401);
    const login = await request('/auth/login', null, { emailOrUsername: leader.email, password: nextPassword });
    assert.equal(login.status, 200);
    assert.ok(!Object.hasOwn(login.body.data, 'refreshToken'));
    assert.equal((await request('/auth/me', null, undefined, 'GET', login.body.data.accessToken)).status, 200);
  });
  it('rejects weak, shared and missing production signing configuration', () => {
    const good = { ...process.env, NODE_ENV: 'production', JWT_SECRET: crypto.randomBytes(32).toString('hex'),
      JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'), QR_SECRET_SALT: crypto.randomBytes(32).toString('hex') };
    const run = env => spawnSync(process.execPath, ['-e', "require('./src/config/environment')"], { cwd: require('node:path').resolve(__dirname, '..'), env, stdio: 'pipe' }).status;
    assert.equal(run(good), 0);
    assert.notEqual(run({ ...good, JWT_SECRET: '' }), 0);
    assert.notEqual(run({ ...good, JWT_SECRET: 'x'.repeat(64) }), 0);
    assert.notEqual(run({ ...good, QR_SECRET_SALT: good.JWT_SECRET }), 0);
  });
  it('rejects legacy and refresh-shaped tokens instead of treating them as access sessions', async () => {
    const jwt = require('jsonwebtoken');
    const configuration = require('../src/config/environment');
    for (const payload of [{ userId: String(leader._id) },
      { userId: String(leader._id), tokenUse: 'refresh', tokenVersion: 0 }]) {
      const credential = jwt.sign(payload, configuration.jwt.secret);
      assert.equal((await request('/auth/me', null, undefined, 'GET', credential)).status, 401);
    }
  });
  it('disables production demo seeding before opening a database connection', () => {
    const result = spawnSync(process.execPath, ['src/utils/seed.js'], {
      cwd: path.resolve(__dirname, '..'), timeout: 5000, stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production', JWT_SECRET: crypto.randomBytes(32).toString('hex'),
        JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'), QR_SECRET_SALT: crypto.randomBytes(32).toString('hex') }
    });
    assert.equal(result.status, 1);
    assert.ok(!String(result.stdout).includes('MongoDB Connected'), 'Production seed must not connect');
  });
  it('fails closed on a standalone database without committing a partial write', async () => {
    const standalone = await MongoMemoryServer.create();
    try {
      const result = spawnSync(process.execPath, ['-e', `
        const mongoose = require('mongoose');
        const transaction = require('./src/utils/transaction');
        const { User } = require('./src/models');
        (async () => {
          await mongoose.connect(process.env.MONGODB_URI);
          let blocked = false;
          try { await transaction(() => User.create({ username: 'standalone_fixture',
            email: 'standalone@example.test', fullName: 'Fixture', passwordHash: 'test credential' })); }
          catch (error) { blocked = error.statusCode === 503; }
          const count = await User.countDocuments();
          await mongoose.disconnect();
          process.exit(blocked && count === 0 ? 0 : 1);
        })().catch(() => process.exit(1));
      `], { cwd: path.resolve(__dirname, '..'), timeout: 15000, stdio: 'pipe',
        env: { ...process.env, MONGODB_URI: standalone.getUri('htg_security_standalone') } });
      assert.equal(result.status, 0);
    } finally { await standalone.stop(); }
  });
  it('does not fabricate security incidents on read' , async () => {
    assert.equal((await request('/admin/security-logs', admin)).status, 200);
    assert.equal(await SecurityLog.countDocuments(), 0);
  });
});

const { it, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

if (!process.env.MONGOMS_SYSTEM_BINARY && process.platform === 'win32') {
  const fs = require('node:fs');
  const root = path.join(process.env.ProgramFiles || 'C:/Program Files', 'MongoDB', 'Server');
  if (fs.existsSync(root)) {
    for (const version of fs.readdirSync(root).sort().reverse()) {
      const binary = path.join(root, version, 'bin', 'mongod.exe');
      if (fs.existsSync(binary)) { process.env.MONGOMS_SYSTEM_BINARY = binary; break; }
    }
  }
}
if (process.env.MONGOMS_SYSTEM_BINARY) process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK = 'false';

const { User } = require('../src/models');
const clerk = require('../src/services/clerk.service');
const { main } = require('../scripts/link-admin-clerk');

const SCRIPT_PATH = path.resolve(__dirname, '../scripts/link-admin-clerk.js');

it('link-admin-clerk.js test suite', async (t) => {
  let replica;
  let uri;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    // Create unique sparse index on clerkUserId
    await User.collection.createIndex({ clerkUserId: 1 }, { unique: true, sparse: true });

    // Seed authoritative hrx_admin
    await User.create({
      username: 'hrx_admin',
      email: 'admin@codesphere.tulas.edu.in',
      fullName: 'Hrithik Roshan',
      role: 'ADMIN',
      isActive: true,
      passwordHash: '$2a$10$hashedpasswordforadminaccount12345678901234567890'
    });
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  await t.test('CLI: fails with clear guidance when no Clerk User ID is passed', () => {
    const res = spawnSync(process.execPath, [SCRIPT_PATH], {
      env: { ...process.env, MONGODB_URI: uri, CLERK_ADMIN_USER_ID: '' },
      encoding: 'utf8'
    });
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Valid Clerk admin user ID is required/);
    assert.match(res.stderr, /\$env:CLERK_ADMIN_USER_ID/);
  });

  await t.test('CLI: fails safely when malformed Clerk User ID is passed without echoing input', () => {
    const res = spawnSync(process.execPath, [SCRIPT_PATH, 'bad_id_123'], {
      env: { ...process.env, MONGODB_URI: uri },
      encoding: 'utf8'
    });
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Invalid Clerk user ID format/);
    assert.doesNotMatch(res.stderr, /bad_id_123/);
  });

  await t.test('Clerk verification: rejects banned Clerk user', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: true,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_validmock123', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      { message: 'Clerk user account is banned' }
    );
  });

  await t.test('Clerk verification: rejects unverified primary email', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'unverified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_validmock123', '--dry-run'];
    await assert.rejects(
      async () => main(),
      /Clerk user primary email is not verified/
    );
  });

  await t.test('Clerk verification: rejects mismatched email', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'attacker@evil.com', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_validmock123', '--dry-run'];
    await assert.rejects(
      async () => main(),
      /does not match required admin email/
    );
  });

  await t.test('Dry-run: verifies all checks and does NOT update database', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_validmock123', '--dry-run'];
    await main();

    // Verify DB still unmapped
    const userInDb = await User.findOne({ username: 'hrx_admin' }).select('+clerkUserId');
    assert.equal(userInDb.clerkUserId, undefined);
  });

  await t.test('Confirmed execution: atomically links account and increments tokenVersion', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_validmock123', '--confirm'];
    await main();

    // Verify DB mapped
    const userInDb = await User.findOne({ username: 'hrx_admin' }).select('+clerkUserId +passwordHash +tokenVersion');
    assert.equal(userInDb.clerkUserId, 'user_validmock123');
    assert.equal(userInDb.role, 'ADMIN');
    assert.equal(userInDb.isActive, true);
    assert.ok(userInDb.passwordHash);
    assert.equal(userInDb.tokenVersion, 1);
  });

  await t.test('Idempotency: running again with same Clerk ID succeeds cleanly without double-increment', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_validmock123', '--confirm'];
    await main(); // should output already mapped and not throw

    const userInDb = await User.findOne({ username: 'hrx_admin' }).select('+clerkUserId +tokenVersion');
    assert.equal(userInDb.clerkUserId, 'user_validmock123');
    assert.equal(userInDb.tokenVersion, 1);
  });

  await t.test('Collision check: refuses if Clerk ID belongs to another user', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    // Create participant user with clerkUserId: 'user_otherparticipant999'
    await User.create({
      username: 'participant_bob',
      email: 'bob@example.com',
      fullName: 'Bob Smith',
      role: 'TEAM_MEMBER',
      clerkUserId: 'user_otherparticipant999'
    });

    process.argv = ['node', SCRIPT_PATH, 'user_otherparticipant999', '--confirm'];
    await assert.rejects(
      async () => main(),
      /Clerk identity collision detected/
    );
  });
});


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
const { main } = require('../scripts/provision-admin');

const SCRIPT_PATH = path.resolve(__dirname, '../scripts/provision-admin.js');

it('provision-admin.js test suite', async (t) => {
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
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  await t.test('1. CLI: fails with clear guidance when no Clerk User ID is passed', () => {
    const res = spawnSync(process.execPath, [SCRIPT_PATH], {
      env: { ...process.env, MONGODB_URI: uri, CLERK_ADMIN_USER_ID: '' },
      encoding: 'utf8'
    });
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Valid Clerk admin user ID is required/);
    assert.match(res.stderr, /\$env:CLERK_ADMIN_USER_ID/);
  });

  await t.test('2. CLI: fails safely when malformed Clerk User ID is passed without echoing input', () => {
    const res = spawnSync(process.execPath, [SCRIPT_PATH, 'bad_token_format'], {
      env: { ...process.env, MONGODB_URI: uri },
      encoding: 'utf8'
    });
    assert.equal(res.status, 1);
    assert.match(res.stderr, /Invalid Clerk user ID format/);
    assert.doesNotMatch(res.stderr, /bad_token_format/);
  });

  await t.test('3. Clerk verification: rejects banned Clerk user', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: true,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_bannedadmin123', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      { message: 'Clerk user account is banned in Clerk dashboard' }
    );
  });

  await t.test('4. Clerk verification: rejects unverified primary email', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'unverified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_unverifiedadmin123', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      /Clerk user primary email is not verified/
    );
  });

  await t.test('5. Clerk verification: rejects mismatched primary email', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'impostor@external.com', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_mismatchedadmin123', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      /does not match required admin email/
    );
  });

  await t.test('6. Collision check: refuses if Clerk ID belongs to another account', async () => {
    await User.create({
      username: 'other_user_collision',
      email: 'other@user.com',
      fullName: 'Other User',
      role: 'TEAM_MEMBER',
      clerkUserId: 'user_collidingclerk123'
    });

    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_collidingclerk123', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      /Clerk identity collision detected/
    );
  });

  await t.test('7. Security check: refuses to promote an existing non-ADMIN user with same username/email', async () => {
    await User.create({
      username: 'hrx_admin_fake',
      email: 'admin@codesphere.tulas.edu.in',
      fullName: 'Fake Admin',
      role: 'TEAM_LEADER',
      passwordHash: '$2a$10$hashedpasswordforfakeuser1234567890'
    });

    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_legitadmin123', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      /already exists with non-ADMIN role/
    );

    // Clean up fake user
    await User.deleteOne({ email: 'admin@codesphere.tulas.edu.in' });
  });

  await t.test('8. Security check: refuses to operate on inactive admin account', async () => {
    await User.create({
      username: 'hrx_admin',
      email: 'admin@codesphere.tulas.edu.in',
      fullName: 'Deactivated Admin',
      role: 'ADMIN',
      isActive: false,
      passwordHash: '$2a$10$hashedpasswordforfakeuser1234567890'
    });

    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_legitadmin123', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      /marked inactive in database/
    );

    // Clean up deactivated user
    await User.deleteOne({ username: 'hrx_admin' });
  });

  await t.test('9. Database safety: aborts if --target-db does not match connected database', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_legitadmin123', '--dry-run', '--target-db=unintended_db'];
    delete process.env.CLERK_ADMIN_USER_ID;

    await assert.rejects(
      async () => main(),
      /Database target mismatch: Expected database 'unintended_db'/
    );
  });

  await t.test('10. Dry-Run Mode: plans creation of absent admin without writing to MongoDB', async () => {
    // hrx_admin does not exist
    const countBefore = await User.countDocuments({ username: 'hrx_admin' });
    assert.equal(countBefore, 0);

    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      firstName: 'Hrithik',
      lastName: 'Roshan',
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_newproductionadmin1', '--dry-run'];
    delete process.env.CLERK_ADMIN_USER_ID;

    const res = await main();
    assert.equal(res.success, true);
    assert.equal(res.action, 'DRY_RUN');
    assert.equal(res.actionType, 'CREATE_AND_LINK');

    // Confirm nothing written
    const countAfter = await User.countDocuments({ username: 'hrx_admin' });
    assert.equal(countAfter, 0);
  });

  await t.test('11. Confirmed Mode: provisions fresh hrx_admin in MongoDB and links Clerk ID', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      firstName: 'Hrithik',
      lastName: 'Roshan',
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_newproductionadmin1', '--confirm'];
    delete process.env.CLERK_ADMIN_USER_ID;

    const res = await main();
    assert.equal(res.success, true);
    assert.equal(res.action, 'PROVISIONED');

    const admin = await User.findOne({ username: 'hrx_admin' }).select('+passwordHash +clerkUserId +tokenVersion');
    assert.ok(admin);
    assert.equal(admin.username, 'hrx_admin');
    assert.equal(admin.email, 'admin@codesphere.tulas.edu.in');
    assert.equal(admin.role, 'ADMIN');
    assert.equal(admin.isActive, true);
    assert.equal(admin.clerkUserId, 'user_newproductionadmin1');
    assert.ok(admin.passwordHash); // Fallback hash is present
    assert.equal(admin.tokenVersion, 1);
  });

  await t.test('12. Idempotency: re-running against already provisioned/linked admin succeeds cleanly', async () => {
    const mockGetUser = mock.fn(async () => ({
      banned: false,
      locked: false,
      firstName: 'Hrithik',
      lastName: 'Roshan',
      primaryEmailAddressId: 'email_1',
      emailAddresses: [{ id: 'email_1', emailAddress: 'admin@codesphere.tulas.edu.in', verification: { status: 'verified' } }]
    }));
    mock.method(clerk, 'getClient', () => ({ users: { getUser: mockGetUser } }));

    process.argv = ['node', SCRIPT_PATH, 'user_newproductionadmin1', '--confirm'];
    delete process.env.CLERK_ADMIN_USER_ID;

    const res = await main();
    assert.equal(res.success, true);
    assert.equal(res.action, 'ALREADY_MAPPED');

    const admin = await User.findOne({ username: 'hrx_admin' }).select('+tokenVersion');
    assert.equal(admin.tokenVersion, 1); // Token version was NOT double-incremented
  });
});

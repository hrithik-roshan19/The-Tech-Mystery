const { it, before, after, describe, mock } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
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

const {
  User,
  Team,
  EventConfig,
  Score,
  SecurityLog
} = require('../src/models');
const { ROLES } = require('../src/constants/roles');
const teamService = require('../src/services/team.service');
const { teamFor, eventFor } = require('../src/services/eligibility.service');
const adminController = require('../src/controllers/admin.controller');
const clerkController = require('../src/controllers/clerk.controller');
const clerk = require('../src/services/clerk.service');

describe('Team Registration, Member Persistence, Admin Approval & QR Verification Suite', () => {
  let replica;
  let adminUser;
  let leaderUser;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    const uri = replica.getUri();
    await mongoose.connect(uri);

    // Create unique index on clerkUserId for clerk tests
    await User.collection.createIndex({ clerkUserId: 1 }, { unique: true, sparse: true });

    // Ensure event configuration is LIVE
    await EventConfig.deleteMany({});
    await EventConfig.create({
      state: 'LIVE',
      registrationOpen: true,
      qrCheckpoints: true,
      hintsEnabled: true,
      minTeamSize: 2,
      maxTeamSize: 4
    });

    // Create Admin user
    adminUser = await User.create({
      username: 'super_admin',
      email: 'admin@tulas.edu.in',
      fullName: 'Super Administrator',
      passwordHash: 'dummyhash',
      role: ROLES.ADMIN,
      isActive: true
    });
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  it('1. Successfully registers a squad with 1 leader + 3 members and persists all 4 users', async () => {
    leaderUser = await User.create({
      username: 'leader_cyber',
      email: 'leader@tulas.edu.in',
      fullName: 'Squad Commander',
      passwordHash: 'dummyhash',
      role: ROLES.TEAM_MEMBER,
      isActive: true
    });

    const membersPayload = [
      { name: 'Alice Smith', email: 'alice@tulas.edu.in' },
      { name: 'Bob Jones', email: 'bob@tulas.edu.in' },
      { name: 'Charlie Brown', email: 'charlie@tulas.edu.in' }
    ];

    const team = await teamService.createTeam(leaderUser._id, {
      name: 'CyberDefenders',
      college: "Tula's Institute",
      motto: 'Always Vigilant',
      members: membersPayload
    });

    assert.ok(team, 'Team should be created');
    assert.equal(team.name, 'CyberDefenders');
    assert.equal(team.motto, 'Always Vigilant');
    assert.equal(team.status, 'Pending', 'New team should start with status Pending');
    assert.equal(team.members.length, 4, 'Team should have 4 members (1 leader + 3 members)');

    // Verify leader user document
    const updatedLeader = await User.findById(leaderUser._id);
    assert.equal(updatedLeader.role, ROLES.TEAM_LEADER);
    assert.equal(String(updatedLeader.teamId), String(team._id));

    // Verify all 3 members were created as valid active User documents
    for (const m of membersPayload) {
      const memberUser = await User.findOne({ email: m.email });
      assert.ok(memberUser, `User record for ${m.email} should exist`);
      assert.equal(memberUser.fullName, m.name);
      assert.equal(memberUser.role, ROLES.TEAM_MEMBER);
      assert.equal(String(memberUser.teamId), String(team._id));
      assert.equal(memberUser.isActive, true);
      assert.ok(team.members.some(mDoc => String(mDoc._id || mDoc) === String(memberUser._id)));
    }
  });

  it('2. Rejects duplicate member emails, leader email in members, and exceeding team capacity', async () => {
    const leader2 = await User.create({
      username: 'leader_two',
      email: 'leader2@tulas.edu.in',
      fullName: 'Leader Two',
      passwordHash: 'dummyhash',
      role: ROLES.TEAM_MEMBER,
      isActive: true
    });

    // Attempt with leader email in members
    await assert.rejects(
      async () => {
        await teamService.createTeam(leader2._id, {
          name: 'Team Reject 1',
          members: [{ name: 'Duplicate Leader', email: 'leader2@tulas.edu.in' }]
        });
      },
      /Duplicate member email/
    );

    // Attempt with duplicate members
    await assert.rejects(
      async () => {
        await teamService.createTeam(leader2._id, {
          name: 'Team Reject 2',
          members: [
            { name: 'Same', email: 'same@tulas.edu.in' },
            { name: 'Same Again', email: 'same@tulas.edu.in' }
          ]
        });
      },
      /Duplicate member email/
    );

    // Attempt with > 3 members (total > 4)
    await assert.rejects(
      async () => {
        await teamService.createTeam(leader2._id, {
          name: 'Team Reject 3',
          members: [
            { email: 'm1@tulas.edu.in' },
            { email: 'm2@tulas.edu.in' },
            { email: 'm3@tulas.edu.in' },
            { email: 'm4@tulas.edu.in' }
          ]
        });
      },
      /Team exceeds maximum size of 4 members/
    );
  });

  it('3. QR Checkpoint verification rejects Pending team with descriptive approval message', async () => {
    const pendingTeam = await Team.findOne({ name: 'CyberDefenders' });
    assert.equal(pendingTeam.status, 'Pending');

    const config = await EventConfig.findOne();

    await assert.rejects(
      async () => {
        await teamFor(pendingTeam._id, leaderUser._id, config);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /Team registration is pending administrator approval/);
        return true;
      }
    );
  });

  it('4. Admin approval rejects undersized team (< 2 members) with descriptive error', async () => {
    // Create a solo leader team
    const soloLeader = await User.create({
      username: 'solo_leader',
      email: 'solo@tulas.edu.in',
      fullName: 'Solo Leader',
      passwordHash: 'dummyhash',
      role: ROLES.TEAM_MEMBER,
      isActive: true
    });

    const soloTeam = await teamService.createTeam(soloLeader._id, {
      name: 'SoloSquad',
      members: []
    });

    assert.equal(soloTeam.members.length, 1);
    assert.equal(soloTeam.status, 'Pending');

    // Attempt to approve via admin controller
    const req = {
      params: { teamId: String(soloTeam._id) },
      user: { username: 'super_admin' },
      ip: '127.0.0.1'
    };
    let responseStatus = null;
    let responseBody = null;
    const res = {
      status(s) { responseStatus = s; return this; },
      json(b) { responseBody = b; return this; }
    };

    await adminController.approveTeam(req, res, () => {});

    assert.equal(responseStatus, 400);
    assert.equal(responseBody.success, false);
    assert.match(responseBody.message, /Team cannot be approved/);
    assert.match(responseBody.message, /minimum of 2 members/);

    const reloaded = await Team.findById(soloTeam._id);
    assert.equal(reloaded.status, 'Pending', 'Undersized team should remain Pending');
  });

  it('5. Admin approval succeeds for eligible team (>= 2 members) and unlocks QR verification', async () => {
    const pendingTeam = await Team.findOne({ name: 'CyberDefenders' });
    assert.equal(pendingTeam.status, 'Pending');
    assert.equal(pendingTeam.members.length, 4);

    const req = {
      params: { teamId: String(pendingTeam._id) },
      user: { username: 'super_admin' },
      ip: '127.0.0.1'
    };
    let responseStatus = null;
    let responseBody = null;
    const res = {
      status(s) { responseStatus = s; return this; },
      json(b) { responseBody = b; return this; }
    };

    await adminController.approveTeam(req, res, () => {});

    assert.equal(responseStatus, 200);
    assert.equal(responseBody.success, true);
    assert.match(responseBody.message, /approved and activated/);

    // Verify database state
    const approvedTeam = await Team.findById(pendingTeam._id);
    assert.equal(approvedTeam.status, 'Active');

    // Verify SecurityLog was recorded
    const log = await SecurityLog.findOne({ target: 'CyberDefenders', event: 'Team approved' });
    assert.ok(log, 'SecurityLog should be recorded for team approval');

    // Verify QR checkpoint eligibility now SUCCEEDS
    const config = await EventConfig.findOne();
    const verifiedTeam = await teamFor(approvedTeam._id, leaderUser._id, config);
    assert.ok(verifiedTeam, 'Approved team must pass teamFor check');
  });

  it('6. Pre-rostered teammate signing into Clerk seamlessly links clerkUserId without 409 conflict', async () => {
    // Mock clerk.verifiedEmail to return alice's email
    mock.method(clerk, 'verifiedEmail', async () => 'alice@tulas.edu.in');

    // alice@tulas.edu.in was pre-rostered in Test 1 with clerkUserId = undefined/null
    const preRosteredAlice = await User.findOne({ email: 'alice@tulas.edu.in' });
    assert.ok(preRosteredAlice);
    assert.equal(preRosteredAlice.clerkUserId, undefined);

    const clerkIdentity = {
      clerkUserId: 'user_clerk_alice_123',
      claims: { email: 'alice@tulas.edu.in' }
    };

    const req = {
      clerkIdentity,
      body: {
        username: 'alice_operative',
        fullName: 'Alice Smith Verified'
      }
    };

    let responseStatus = null;
    let responseBody = null;
    const res = {
      status(s) { responseStatus = s; return this; },
      json(b) { responseBody = b; return this; }
    };

    await clerkController.register(req, res);

    assert.equal(responseStatus, 201, 'Should return 201 on linking pre-rostered account');
    assert.equal(responseBody.success, true);

    // Verify Alice in database now has clerkUserId and retains teamId
    const linkedAlice = await User.findOne({ email: 'alice@tulas.edu.in' }).select('+clerkUserId');
    assert.equal(linkedAlice.clerkUserId, 'user_clerk_alice_123');
    assert.equal(linkedAlice.username, 'alice_operative');
    assert.equal(linkedAlice.fullName, 'Alice Smith Verified');
    assert.ok(linkedAlice.teamId, 'Alice must retain her teamId association');
  });
});

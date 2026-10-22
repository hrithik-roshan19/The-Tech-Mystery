const { it, before, after } = require('node:test');
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

const { User, Team, Score, Submission, TeamChallenge, Checkpoint, Challenge, EventConfig, SecurityLog } = require('../src/models');
const { ROLES } = require('../src/constants/roles');
const adminController = require('../src/controllers/admin.controller');
const authController = require('../src/controllers/auth.controller');
const leaderboardController = require('../src/controllers/leaderboard.controller');

it('Zero-team initial state and dummy data eradication test suite', async (t) => {
  let replica;
  let uri;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    // Seed authoritative hrx_admin
    await User.create({
      username: 'hrx_admin',
      email: 'admin@codesphere.tulas.edu.in',
      fullName: 'Hrithik Roshan',
      role: ROLES.ADMIN,
      isActive: true,
      clerkUserId: 'user_3Ky3EcpRf6X07gWz19VwT3p54lN',
      passwordHash: '$2a$10$hashedadminpassword1234567890123456'
    });

    // Seed 10 checkpoints with 0 scans
    const checkpoints = [];
    for (let i = 1; i <= 10; i++) {
      checkpoints.push({
        name: `Checkpoint Level ${i}`,
        levelNumber: i,
        checkpointCode: `HTG-CP${String(i).padStart(2, '0')}`,
        locationDescription: `Auditorium Sector ${i}`,
        mode: i <= 2 ? 'Public QR' : 'Team-bound QR',
        hmacToken: `token-hash-level-${i}`,
        isActive: true,
        scanCount: 0,
        teamsCount: 0
      });
    }
    await Checkpoint.insertMany(checkpoints);

    // Seed EventConfig
    await EventConfig.create({
      eventName: 'THE TECH MYSTERY',
      state: 'LIVE',
      isLeaderboardVisible: true,
      isLeaderboardFrozen: false
    });
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  await t.test('seed.js fails closed unless explicit dev override flag is provided', () => {
    const seedScript = path.resolve(__dirname, '../src/utils/seed.js');
    const res = spawnSync('node', [seedScript], {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, ALLOW_DEMO_SEEDING: 'false' },
      encoding: 'utf8'
    });
    assert.equal(res.status, 1);
    assert.match(res.stderr + res.stdout, /Database seeding failed/);
  });

  await t.test('zero-team database state contains 0 teams, 0 scores, 0 submissions, and preserved admin', async () => {
    const [teamCount, scoreCount, subCount, tcCount, userCount, cpCount] = await Promise.all([
      Team.countDocuments(),
      Score.countDocuments(),
      Submission.countDocuments(),
      TeamChallenge.countDocuments(),
      User.countDocuments(),
      Checkpoint.countDocuments()
    ]);

    assert.equal(teamCount, 0, 'Teams count must be 0');
    assert.equal(scoreCount, 0, 'Scores count must be 0');
    assert.equal(subCount, 0, 'Submissions count must be 0');
    assert.equal(tcCount, 0, 'TeamChallenge count must be 0');
    assert.equal(userCount, 1, 'Only hrx_admin should exist');
    assert.equal(cpCount, 10, '10 checkpoints must exist');

    const adminUser = await User.findOne({ role: ROLES.ADMIN }).select('+clerkUserId');
    assert.equal(adminUser.username, 'hrx_admin');
    assert.equal(adminUser.clerkUserId, 'user_3Ky3EcpRf6X07gWz19VwT3p54lN');
  });

  await t.test('adminController.getDashboardStats returns truthy 0s and clean empty arrays', async () => {
    let responseData = null;
    const req = { user: { role: ROLES.ADMIN } };
    const res = {
      status: (code) => res,
      json: (data) => {
        responseData = data;
        return res;
      }
    };
    const next = (err) => { throw err; };

    await adminController.getDashboardStats(req, res, next);
    assert.ok(responseData, 'Expected responseData');

    const { stats } = responseData.data;
    assert.equal(stats.totalTeams, 0, 'stats.totalTeams must be 0');
    assert.equal(stats.totalUsers, 0, 'stats.totalUsers (participants) must be 0');
    assert.equal(stats.totalScans, 0, 'stats.totalScans must be 0');
    assert.equal(stats.totalSubmissions, 0, 'stats.totalSubmissions must be 0');
    assert.deepEqual(stats.recentActivity, [], 'recentActivity must be empty array');

    // Level progress must all be 0% when 0 teams exist
    assert.equal(stats.levelProgress.length, 10, 'Must have 10 levelProgress entries');
    stats.levelProgress.forEach((lp) => {
      assert.equal(lp[1], 0, `${lp[0]} completion percentage must be 0`);
    });
  });

  await t.test('adminController.getAdminProfile returns real counts without hardcoded fallbacks', async () => {
    let responseData = null;
    const adminUser = await User.findOne({ role: ROLES.ADMIN });
    const req = {
      user: adminUser,
      headers: { 'user-agent': 'node-test' },
      ip: '127.0.0.1'
    };
    const res = {
      status: () => res,
      json: (data) => {
        responseData = data;
        return res;
      }
    };
    const next = (err) => { throw err; };

    await adminController.getAdminProfile(req, res, next);
    assert.ok(responseData);
    const { stats, recentActivity } = responseData.data;
    assert.equal(Number(stats.managedTeams), 0, 'managedTeams must be 0');
    assert.equal(Number(stats.adminActions), 0, 'adminActions must be 0');
    assert.equal(Number(stats.securityReviews), 0, 'securityReviews must be 0');
    assert.deepEqual(recentActivity, [], 'recentActivity must be empty array');
  });

  await t.test('leaderboardController.getLiveLeaderboard returns empty rankings', async () => {
    let responseData = null;
    const req = {};
    const res = {
      status: () => res,
      json: (data) => {
        responseData = data;
        return res;
      }
    };
    const next = (err) => { throw err; };

    await leaderboardController.getLiveLeaderboard(req, res, next);
    assert.ok(responseData);
    const { leaderboard, totalTeams } = responseData.data;
    assert.equal(totalTeams, 0, 'totalTeams must be 0');
    assert.deepEqual(leaderboard, [], 'leaderboard must be empty array');
  });

  await t.test('authController.getProfile returns unranked participant profile without fake stats', async () => {
    // Create an unteamed test participant
    const participant = await User.create({
      username: 'test_participant',
      email: 'participant@codesphere.org',
      fullName: 'Test Participant',
      role: ROLES.TEAM_MEMBER,
      isActive: true,
      passwordHash: '$2a$10$hashedparticipantpass1234567890'
    });

    let responseData = null;
    const req = {
      user: { userId: participant._id }
    };
    const res = {
      status: () => res,
      json: (data) => {
        responseData = data;
        return res;
      }
    };
    const next = (err) => { throw err; };

    await authController.getProfile(req, res, next);
    assert.ok(responseData);
    const { stats, achievements } = responseData.data;
    assert.equal(stats.totalXp, '0', 'totalXp must be 0');
    assert.equal(stats.rankNumber, 'UNRANKED', 'rankNumber must be UNRANKED');
    assert.equal(stats.rankPercentile, 'UNRANKED', 'rankPercentile must be UNRANKED');
    assert.equal(stats.teamScore, 0, 'teamScore must be 0');
    assert.equal(stats.challengesSolved, '00 / 10', 'challengesSolved must be 00 / 10');
    assert.equal(stats.checkpoints, '00 / 10', 'checkpoints must be 00 / 10');

    // All achievements must be locked (status === "LOCKED")
    achievements.forEach((ach) => {
      assert.equal(ach.status, 'LOCKED', `Achievement "${ach.name}" must be LOCKED`);
    });
  });
});


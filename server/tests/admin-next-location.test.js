const { it, before, after, describe } = require('node:test');
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
  Challenge,
  Question,
  Checkpoint,
  TeamChallenge,
  EventConfig,
  Score,
  Submission
} = require('../src/models');
const { ROLES } = require('../src/constants/roles');
const questionAssignmentService = require('../src/services/questionAssignment.service');
const checkpointService = require('../src/services/checkpoint.service');
const scoringService = require('../src/services/scoring.service');
const qrGenerator = require('../src/services/qrGenerator.service');
const adminController = require('../src/controllers/admin.controller');
const challengeController = require('../src/controllers/challenge.controller');

describe('Admin-Controlled Next Location After Correct Answer Test Suite', () => {
  let replica;
  let uri;
  let adminUser;
  let testTeam, teamLeader, teamMember;
  let level1Challenge, level2Challenge, level10Challenge;
  let cpL1, cpL2, cpL10;
  let q1_1, q1_2, q2_1, q10_1;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    await EventConfig.create({
      eventName: 'THE TECH MYSTERY 2026',
      state: 'LIVE',
      qrCheckpoints: true,
      minTeamSize: 2,
      maxTeamSize: 4,
      isLeaderboardVisible: true,
      isLeaderboardFrozen: false
    });

    adminUser = await User.create({
      username: 'super_admin',
      email: 'admin@tulas.edu.in',
      fullName: 'Super Administrator',
      role: ROLES.ADMIN,
      isActive: true,
      clerkUserId: 'clerk_admin_test'
    });

    teamLeader = await User.create({
      username: 'team_lead',
      email: 'lead@tulas.edu.in',
      fullName: 'Team Lead',
      role: ROLES.TEAM_LEADER,
      isActive: true,
      clerkUserId: 'clerk_lead_test'
    });

    teamMember = await User.create({
      username: 'team_member',
      email: 'member@tulas.edu.in',
      fullName: 'Team Member',
      role: ROLES.TEAM_MEMBER,
      isActive: true,
      clerkUserId: 'clerk_member_test'
    });

    testTeam = await Team.create({
      name: 'Cyber Strike Squad',
      teamCode: 'CYBER01',
      joinCode: 'CYBER123',
      leaderId: teamLeader._id,
      members: [teamLeader._id, teamMember._id],
      currentLevel: 1,
      totalScore: 0
    });
    teamLeader.teamId = testTeam._id;
    await teamLeader.save();
    teamMember.teamId = testTeam._id;
    await teamMember.save();

    await Score.create({
      teamId: testTeam._id,
      score: 0,
      breakdown: []
    });

    level1Challenge = await Challenge.create({
      title: 'Sector Alpha Orientation',
      category: 'CRYPTOGRAPHY',
      levelNumber: 1,
      points: 100,
      difficulty: 'EASY',
      description: 'Orientation cipher',
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    level2Challenge = await Challenge.create({
      title: 'Sector Beta Gateway',
      category: 'CRYPTOGRAPHY',
      levelNumber: 2,
      points: 150,
      difficulty: 'MEDIUM',
      description: 'Network cipher',
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    level10Challenge = await Challenge.create({
      title: 'The Final Grid Core',
      category: 'MASTER_FLAG',
      levelNumber: 10,
      points: 500,
      difficulty: 'HARD',
      description: 'Final mainframe cipher',
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    // Checkpoint 1: Initial default location
    cpL1 = await Checkpoint.create({
      levelNumber: 1,
      name: 'Campus Main Entrance Beacon',
      locationDescription: 'Main Gate Security Station',
      checkpointCode: 'HTG-CP01-GATE',
      associatedChallengeId: level1Challenge._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });
    const qr1 = await qrGenerator.generateCheckpointQr(cpL1);
    cpL1.qrCodeDataUrl = qr1.qrCodeDataUrl;
    cpL1.qrScanUrl = qr1.scanUrl;
    cpL1.qrToken = qr1.token;
    await cpL1.save();

    // Checkpoint 2
    cpL2 = await Checkpoint.create({
      levelNumber: 2,
      name: 'Central Library Station',
      locationDescription: 'Central Library 2nd Floor',
      checkpointCode: 'HTG-CP02-LIB',
      associatedChallengeId: level2Challenge._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });
    const qr2 = await qrGenerator.generateCheckpointQr(cpL2);
    cpL2.qrCodeDataUrl = qr2.qrCodeDataUrl;
    cpL2.qrScanUrl = qr2.scanUrl;
    cpL2.qrToken = qr2.token;
    await cpL2.save();

    // Checkpoint 10
    cpL10 = await Checkpoint.create({
      levelNumber: 10,
      name: 'Mainframe Vault Station',
      locationDescription: 'Server Room Core',
      checkpointCode: 'HTG-CP10-VAULT',
      associatedChallengeId: level10Challenge._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });
    const qr10 = await qrGenerator.generateCheckpointQr(cpL10);
    cpL10.qrCodeDataUrl = qr10.qrCodeDataUrl;
    cpL10.qrScanUrl = qr10.scanUrl;
    cpL10.qrToken = qr10.token;
    await cpL10.save();

    // Level 1: 2 questions
    q1_1 = await Question.create({
      challengeId: level1Challenge._id,
      levelNumber: 1,
      checkpointId: cpL1._id,
      checkpointCode: cpL1.checkpointCode,
      title: 'Level 1 Question 1',
      prompt: 'What port does HTTP use?',
      type: 'Flag',
      category: 'Cryptography',
      difficulty: 'EASY',
      flag: 'HTG{port_80}',
      points: 50,
      order: 1,
      status: 'Published',
      isActive: true
    });

    q1_2 = await Question.create({
      challengeId: level1Challenge._id,
      levelNumber: 1,
      checkpointId: cpL1._id,
      checkpointCode: cpL1.checkpointCode,
      title: 'Level 1 Question 2 (Final for L1)',
      prompt: 'What port does HTTPS use?',
      type: 'Flag',
      category: 'Cryptography',
      difficulty: 'EASY',
      flag: 'HTG{port_443}',
      points: 50,
      order: 2,
      status: 'Published',
      isActive: true
    });

    // Level 2: 1 question
    q2_1 = await Question.create({
      challengeId: level2Challenge._id,
      levelNumber: 2,
      checkpointId: cpL2._id,
      checkpointCode: cpL2.checkpointCode,
      title: 'Level 2 Question 1',
      prompt: 'What is DNS default port?',
      type: 'Flag',
      category: 'Cryptography',
      difficulty: 'MEDIUM',
      flag: 'HTG{port_53}',
      points: 150,
      order: 1,
      status: 'Published',
      isActive: true
    });

    // Level 10: 1 question
    q10_1 = await Question.create({
      challengeId: level10Challenge._id,
      levelNumber: 10,
      checkpointId: cpL10._id,
      checkpointCode: cpL10.checkpointCode,
      title: 'Final Mainframe Question',
      prompt: 'The final master key',
      type: 'Flag',
      category: 'Cryptography',
      difficulty: 'HARD',
      flag: 'HTG{final_matrix_root}',
      points: 500,
      order: 1,
      status: 'Published',
      isActive: true
    });
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  it('1. Admin getCheckpointLocations returns structured list of all 10 levels with routing metadata', async () => {
    const req = {};
    let responseData = null;
    const res = {
      status: () => res,
      json: (payload) => { responseData = payload; return res; }
    };

    await adminController.getCheckpointLocations(req, res);
    assert.equal(responseData.success, true);
    assert.equal(responseData.data.locations.length, 10);

    const l1 = responseData.data.locations.find((l) => l.levelNumber === 1);
    assert.equal(l1.checkpointCode, 'HTG-CP01-GATE');
    assert.equal(l1.currentLocation, 'Main Gate Security Station');
    assert.equal(l1.isFinalLevel, false);
    assert.equal(l1.leadsToLevel, 2);

    const l10 = responseData.data.locations.find((l) => l.levelNumber === 10);
    assert.equal(l10.isFinalLevel, true);
    assert.equal(l10.nextLocationName, null);
    assert.equal(l10.leadsToLevel, null);
  });

  it('2. Admin cannot leave nextLocationName empty for non-final levels (validation rejection)', async () => {
    const req = {
      params: { levelNumber: 1 },
      body: { nextLocationName: '   ' }
    };
    let responseData = null;
    let statusCode = null;
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (payload) => { responseData = payload; return res; }
    };

    await adminController.updateCheckpointLocation(req, res);
    assert.equal(statusCode, 400);
    assert.equal(responseData.success, false);
    assert.match(responseData.message, /next location name is required/i);
  });

  it('3. Admin configures and persists nextLocationName and locationInstructions in MongoDB', async () => {
    const req = {
      params: { levelNumber: 1 },
      body: {
        nextLocationName: 'CSE Department Lab 3',
        locationInstructions: 'Take the staircase near the fountain to the 3rd floor, room 302.'
      }
    };
    let responseData = null;
    const res = {
      status: () => res,
      json: (payload) => { responseData = payload; return res; }
    };

    await adminController.updateCheckpointLocation(req, res);
    assert.equal(responseData.success, true);
    assert.equal(responseData.data.nextLocationName, 'CSE Department Lab 3');
    assert.equal(responseData.data.locationInstructions, 'Take the staircase near the fountain to the 3rd floor, room 302.');

    // Verify persistence in MongoDB
    const updated = await Checkpoint.findOne({ levelNumber: 1 });
    assert.equal(updated.nextLocationName, 'CSE Department Lab 3');
    assert.equal(updated.locationInstructions, 'Take the staircase near the fountain to the 3rd floor, room 302.');
  });

  it('4. Participant answering incorrectly does NOT receive next location or advance', async () => {
    // Unlock Level 1 by scanning permanent QR
    await checkpointService.processScan({
      checkpointCode: cpL1.checkpointCode,
      token: cpL1.qrToken,
      teamId: testTeam._id,
      userId: teamLeader._id
    });

    const submitRes = await scoringService.submit({
      teamId: testTeam._id,
      userId: teamLeader._id,
      levelNumber: 1,
      flag: 'WRONG_FLAG_STRING',
      questionId: q1_1._id
    });

    assert.equal(submitRes.isCorrect, false);
    assert.equal(submitRes.isLevelComplete, false);
    assert.equal(submitRes.nextCheckpointLocation, null);
    assert.equal(submitRes.nextLocationName, null);
    assert.equal(submitRes.locationInstructions, null);
    assert.equal(submitRes.nextCheckpoint, null);

    // Verify team stays on Level 1
    const teamRecord = await Team.findById(testTeam._id);
    assert.equal(teamRecord.currentLevel, 1);
  });

  it('5. Participant answering non-final question correctly does NOT receive next location yet', async () => {
    // Submit correct answer to Question 1 of Level 1 (Question 2 still remains)
    const submitRes = await scoringService.submit({
      teamId: testTeam._id,
      userId: teamLeader._id,
      levelNumber: 1,
      flag: 'HTG{port_80}',
      questionId: q1_1._id
    });

    assert.equal(submitRes.isCorrect, true);
    assert.equal(submitRes.isLevelComplete, false);
    assert.equal(submitRes.sequenceNumber, 2);
    // Crucial check: Location is NOT revealed on intermediate questions
    assert.equal(submitRes.nextCheckpointLocation, null);
    assert.equal(submitRes.nextLocationName, null);
    assert.equal(submitRes.locationInstructions, null);
    assert.equal(submitRes.nextCheckpoint, null);
    assert.ok(submitRes.nextQuestion);
    assert.equal(submitRes.nextQuestion._id.toString(), q1_2._id.toString());
  });

  it('6. Participant answering final question of Level 1 correctly unlocks admin-configured next location', async () => {
    // Submit correct answer to Question 2 of Level 1 (final question of Level 1!)
    const submitRes = await scoringService.submit({
      teamId: testTeam._id,
      userId: teamLeader._id,
      levelNumber: 1,
      flag: 'HTG{port_443}',
      questionId: q1_2._id
    });

    assert.equal(submitRes.isCorrect, true);
    assert.equal(submitRes.isLevelComplete, true);
    assert.equal(submitRes.levelCleared, 1);
    assert.equal(submitRes.nextLevel, 2);

    // Crucial check: Returns admin-configured nextLocationName and locationInstructions!
    assert.equal(submitRes.nextLocationName, 'CSE Department Lab 3');
    assert.equal(submitRes.nextCheckpointLocation, 'CSE Department Lab 3');
    assert.equal(
      submitRes.locationInstructions,
      'Take the staircase near the fountain to the 3rd floor, room 302.'
    );
    assert.ok(submitRes.nextCheckpoint);
    assert.equal(submitRes.nextCheckpoint.name, 'CSE Department Lab 3');
    assert.equal(submitRes.nextCheckpoint.code, 'HTG-CP02-LIB');
    assert.equal(
      submitRes.nextCheckpoint.instructions,
      'Take the staircase near the fountain to the 3rd floor, room 302.'
    );
  });

  it('7. Next level remains locked until participant physically travels and scans Level 2 QR beacon', async () => {
    // Level 2 challenge request before scanning Level 2 QR must be rejected
    const req = {
      user: { teamId: testTeam._id, userId: teamLeader._id },
      params: { levelNumber: 2 }
    };
    let responseStatus = 200;
    let responseBody = null;
    const res = {
      status(code) { responseStatus = code; return this; },
      json(data) { responseBody = data; return this; }
    };

    await challengeController.getCurrentChallenge(req, res, () => {});
    assert.equal(responseStatus, 403);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.data.isLocked, true);
    assert.equal(responseBody.data.checkpointScanned, false);
    assert.equal(responseBody.data.levelNumber, 2);

    // Now participant physically scans Level 2 QR beacon
    const scanRes = await checkpointService.processScan({
      checkpointCode: cpL2.checkpointCode,
      token: cpL2.qrToken,
      teamId: testTeam._id,
      userId: teamLeader._id
    });
    assert.equal(scanRes.teamChallenge.checkpointScanned, true);
    assert.equal(scanRes.teamChallenge.levelNumber, 2);

    // Now challenge unlocks
    let unlockedStatus = 200;
    let unlockedChallenge = null;
    const successRes = {
      status(code) { unlockedStatus = code; return this; },
      json(data) { unlockedChallenge = data; return this; }
    };
    await challengeController.getCurrentChallenge(req, successRes, () => {});
    assert.equal(unlockedChallenge.success, true);
    assert.equal(unlockedChallenge.data.levelNumber, 2);
    assert.equal(unlockedChallenge.data.question.title, 'Level 2 Question 1');
  });

  it('8. Final Level 10 completion displays victory state and does NOT return a next location', async () => {
    // Fast-forward team to Level 10
    testTeam.currentLevel = 10;
    await testTeam.save();

    await checkpointService.processScan({
      checkpointCode: cpL10.checkpointCode,
      token: cpL10.qrToken,
      teamId: testTeam._id,
      userId: teamLeader._id
    });

    const submitRes = await scoringService.submit({
      teamId: testTeam._id,
      userId: teamLeader._id,
      levelNumber: 10,
      flag: 'HTG{final_matrix_root}',
      questionId: q10_1._id
    });

    assert.equal(submitRes.isCorrect, true);
    assert.equal(submitRes.isLevelComplete, true);
    assert.equal(submitRes.isEventComplete, true);
    assert.equal(submitRes.nextCheckpointLocation, null);
    assert.equal(submitRes.nextLocationName, null);
    assert.equal(submitRes.locationInstructions, null);
    assert.equal(submitRes.nextCheckpoint, null);
  });

  it('9. APIs and DTOs strictly sanitize flags and private answers', async () => {
    const questionDoc = await Question.findById(q1_1._id);
    const sanitized = await questionAssignmentService.participantQuestion
      ? await questionAssignmentService.participantQuestion(questionDoc)
      : questionDoc.toObject();

    assert.equal(sanitized.flag, undefined);
    assert.equal(sanitized.answer, undefined);
  });
});

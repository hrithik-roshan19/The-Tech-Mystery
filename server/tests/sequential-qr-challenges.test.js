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
const challengeController = require('../src/controllers/challenge.controller');
const adminController = require('../src/controllers/admin.controller');
const { participantQuestion } = require('../src/utils/participantData');

describe('Sequential QR Challenge System — 15 Scenarios', () => {
  let replica;
  let uri;
  let adminUser;
  let teamA, teamB, teamC;
  let leaderA, leaderB, leaderC;
  let level1Challenge, level2Challenge, level10Challenge;
  let cpLevel1, cpLevel2, cpLevel10;
  let q1_1, q1_2, q1_3;
  let q2_1;
  let q10_1;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    // Setup Event Config
    await EventConfig.create({
      eventName: 'THE TECH MYSTERY 2026',
      state: 'LIVE',
      qrCheckpoints: true,
      minTeamSize: 2,
      maxTeamSize: 4,
      isLeaderboardVisible: true,
      isLeaderboardFrozen: false
    });

    // Setup Admin
    adminUser = await User.create({
      username: 'admin_sys',
      email: 'admin@tulas.edu.in',
      fullName: 'System Admin',
      role: ROLES.ADMIN,
      isActive: true,
      clerkUserId: 'user_admin_seq'
    });

    // Setup Challenges
    level1Challenge = await Challenge.create({
      levelNumber: 1,
      title: 'Perimeter Breach',
      description: 'Break into the outer perimeter',
      category: 'Cryptography',
      difficulty: 'EASY',
      points: 100,
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    level2Challenge = await Challenge.create({
      levelNumber: 2,
      title: 'Internal Routing',
      description: 'Navigate network topology',
      category: 'Networking',
      difficulty: 'MEDIUM',
      points: 200,
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    level10Challenge = await Challenge.create({
      levelNumber: 10,
      title: 'Master Mainframe',
      description: 'Final sector breach',
      category: 'Web Security',
      difficulty: 'EXPERT',
      points: 1000,
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    // Setup Level Checkpoints
    cpLevel1 = await Checkpoint.create({
      levelNumber: 1,
      name: 'Main Campus Gate',
      locationDescription: 'North Gate Entrance A',
      checkpointCode: 'HTG-CP01-GATE',
      associatedChallengeId: level1Challenge._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });

    cpLevel2 = await Checkpoint.create({
      levelNumber: 2,
      name: 'Central Library Block',
      locationDescription: 'Library 2nd Floor Server Room',
      checkpointCode: 'HTG-CP02-LIB',
      associatedChallengeId: level2Challenge._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });

    cpLevel10 = await Checkpoint.create({
      levelNumber: 10,
      name: 'High Tech Core Lab',
      locationDescription: 'Mainframe Server Vault',
      checkpointCode: 'HTG-CP10-VAULT',
      associatedChallengeId: level10Challenge._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });

    // Setup Teams (min 2 members)
    leaderA = await User.create({
      username: 'leader_a',
      email: 'leader_a@tulas.edu.in',
      fullName: 'Leader A',
      role: ROLES.TEAM_LEADER,
      isActive: true,
      clerkUserId: 'clerk_leader_a'
    });
    const memberA = await User.create({
      username: 'member_a',
      email: 'member_a@tulas.edu.in',
      fullName: 'Member A',
      role: ROLES.TEAM_MEMBER,
      isActive: true,
      clerkUserId: 'clerk_member_a'
    });
    teamA = await Team.create({
      name: 'Team Alpha',
      teamCode: 'ALPHA01',
      joinCode: 'ALPHA123',
      leaderId: leaderA._id,
      members: [leaderA._id, memberA._id],
      currentLevel: 1,
      totalScore: 0
    });
    leaderA.teamId = teamA._id;
    await leaderA.save();
    memberA.teamId = teamA._id;
    await memberA.save();

    leaderB = await User.create({
      username: 'leader_b',
      email: 'leader_b@tulas.edu.in',
      fullName: 'Leader B',
      role: ROLES.TEAM_LEADER,
      isActive: true,
      clerkUserId: 'clerk_leader_b'
    });
    const memberB = await User.create({
      username: 'member_b',
      email: 'member_b@tulas.edu.in',
      fullName: 'Member B',
      role: ROLES.TEAM_MEMBER,
      isActive: true,
      clerkUserId: 'clerk_member_b'
    });
    teamB = await Team.create({
      name: 'Team Bravo',
      teamCode: 'BRAVO02',
      joinCode: 'BRAVO123',
      leaderId: leaderB._id,
      members: [leaderB._id, memberB._id],
      currentLevel: 1,
      totalScore: 0
    });
    leaderB.teamId = teamB._id;
    await leaderB.save();
    memberB.teamId = teamB._id;
    await memberB.save();

    leaderC = await User.create({
      username: 'leader_c',
      email: 'leader_c@tulas.edu.in',
      fullName: 'Leader C',
      role: ROLES.TEAM_LEADER,
      isActive: true,
      clerkUserId: 'clerk_leader_c'
    });
    const memberC = await User.create({
      username: 'member_c',
      email: 'member_c@tulas.edu.in',
      fullName: 'Member C',
      role: ROLES.TEAM_MEMBER,
      isActive: true,
      clerkUserId: 'clerk_member_c'
    });
    teamC = await Team.create({
      name: 'Team Charlie',
      teamCode: 'CHARLIE03',
      joinCode: 'CHARLIE123',
      leaderId: leaderC._id,
      members: [leaderC._id, memberC._id],
      currentLevel: 1,
      totalScore: 0
    });
    leaderC.teamId = teamC._id;
    await leaderC.save();
    memberC.teamId = teamC._id;
    await memberC.save();
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  it('Scenario 1: System provisions exactly one permanent QR code per level', async () => {
    const qrL1 = await qrGenerator.generateCheckpointQr(cpLevel1);
    const qrL2 = await qrGenerator.generateCheckpointQr(cpLevel2);

    assert.ok(qrL1.qrCodeDataUrl.startsWith('data:image/png;base64,'));
    assert.ok(qrL1.scanUrl.includes('code=HTG-CP01-GATE'));
    assert.ok(qrL2.scanUrl.includes('code=HTG-CP02-LIB'));

    const countCp1 = await Checkpoint.countDocuments({ levelNumber: 1 });
    assert.equal(countCp1, 1, 'Exactly one permanent checkpoint exists for Level 1');
  });

  it('Scenario 2: Admin creates sequential question pool with order numbers 1..N', async () => {
    q1_1 = await Question.create({
      challengeId: level1Challenge._id,
      levelNumber: 1,
      checkpointId: cpLevel1._id,
      checkpointCode: cpLevel1.checkpointCode,
      order: 1,
      title: 'Ceasar Cipher Decode',
      prompt: 'Decrypt: KHOOR ZRUOG',
      type: 'Text Answer',
      category: 'Cryptography',
      difficulty: 'EASY',
      points: 50,
      attempts: 3,
      flag: 'HELLO WORLD',
      isCaseSensitive: false,
      status: 'Published',
      isActive: true
    });

    q1_2 = await Question.create({
      challengeId: level1Challenge._id,
      levelNumber: 1,
      checkpointId: cpLevel1._id,
      checkpointCode: cpLevel1.checkpointCode,
      order: 2,
      title: 'Port Scan Recon',
      prompt: 'What port is standard HTTPS?',
      type: 'Numeric Answer',
      category: 'Networking',
      difficulty: 'EASY',
      points: 50,
      attempts: 3,
      flag: '443',
      isCaseSensitive: true,
      status: 'Published',
      isActive: true
    });

    q1_3 = await Question.create({
      challengeId: level1Challenge._id,
      levelNumber: 1,
      checkpointId: cpLevel1._id,
      checkpointCode: cpLevel1.checkpointCode,
      order: 3,
      title: 'Transport Layer Protocol',
      prompt: 'Identify the connectionless transport layer protocol from options',
      type: 'Multiple Choice',
      options: ['TCP', 'UDP', 'ICMP', 'IGMP'],
      category: 'Networking',
      difficulty: 'EASY',
      points: 50,
      attempts: 3,
      flag: 'UDP',
      isCaseSensitive: false,
      status: 'Published',
      isActive: true
    });

    assert.equal(q1_1.order, 1);
    assert.equal(q1_2.order, 2);
    assert.equal(q1_3.order, 3);
  });

  it('Scenario 3: Admin reorders questions via admin bulkWrite endpoint', async () => {
    const req = {
      body: {
        questionIds: [q1_2._id, q1_1._id, q1_3._id]
      }
    };
    let responseStatus = 200;
    let responseBody = null;
    const res = {
      status(code) { responseStatus = code; return this; },
      json(data) { responseBody = data; return this; }
    };

    await adminController.reorderQuestions(req, res, (err) => { throw err; });
    assert.equal(responseStatus, 200);
    assert.equal(responseBody.success, true);

    const reorderedQ2 = await Question.findById(q1_2._id);
    const reorderedQ1 = await Question.findById(q1_1._id);
    assert.equal(reorderedQ2.order, 1);
    assert.equal(reorderedQ1.order, 2);

    // Revert to original order for following tests: Q1_1 (#1), Q1_2 (#2), Q1_3 (#3)
    await adminController.reorderQuestions({
      body: { questionIds: [q1_1._id, q1_2._id, q1_3._id] }
    }, res, (err) => { throw err; });
  });

  it('Scenario 4: Team A scanning Level 1 permanent QR receives Question #1', async () => {
    const qr1 = await qrGenerator.generateCheckpointQr(cpLevel1);
    const scanResult = await checkpointService.processScan({
      checkpointCode: cpLevel1.checkpointCode,
      token: qr1.token,
      teamId: teamA._id,
      userId: leaderA._id
    });

    assert.equal(scanResult.teamChallenge.checkpointScanned, true);
    assert.equal(scanResult.sequenceNumber, 1);
    assert.equal(scanResult.totalQuestions, 1);
    assert.equal(scanResult.solvedCount, 0);
    assert.equal(scanResult.question._id.toString(), q1_1._id.toString());
  });

  it('Scenario 5: Incorrect answer is rejected with "Incorrect answer. Try again." and sequence does not advance', async () => {
    const result = await scoringService.submit({
      teamId: teamA._id,
      userId: leaderA._id,
      levelNumber: 1,
      flag: 'WRONG_ANSWER',
      questionId: q1_1._id
    });

    assert.equal(result.isCorrect, false);
    assert.equal(result.message, 'Incorrect answer. Try again.');
    assert.equal(result.attemptsCount, 1);
    assert.equal(result.attemptsRemaining, 2);

    // Verify progression is still on Question #1
    const prog = await questionAssignmentService.getOrAssignQuestion(teamA._id, 1);
    assert.equal(prog.sequenceNumber, 1);
    assert.equal(prog.question._id.toString(), q1_1._id.toString());
  });

  it('Scenario 6: Correct answer completes Level 1, awards points, and advances team to Level 2', async () => {
    const result = await scoringService.submit({
      teamId: teamA._id,
      userId: leaderA._id,
      levelNumber: 1,
      flag: 'HELLO WORLD',
      questionId: q1_1._id
    });

    assert.equal(result.isCorrect, true);
    assert.equal(result.message, 'Level completed! Checkpoint unlocked.');
    assert.equal(result.pointsAwarded, 50);
    assert.equal(result.isLevelComplete, true);
    assert.equal(result.nextLevel, 2);
    assert.equal(result.nextQuestion, null);
    assert.equal(result.nextCheckpointLocation, 'Central Library Block');

    const updatedTeam = await Team.findById(teamA._id);
    assert.equal(updatedTeam.currentLevel, 2);
    assert.equal(updatedTeam.totalScore, 50);
  });

  it('Scenario 7: Re-scanning Level 1 QR code after completing Level 1 is rejected (fails closed)', async () => {
    const qr1 = await qrGenerator.generateCheckpointQr(cpLevel1);
    await assert.rejects(
      async () => {
        await checkpointService.processScan({
          checkpointCode: cpLevel1.checkpointCode,
          token: qr1.token,
          teamId: teamA._id,
          userId: leaderA._id
        });
      },
      /This level has already been cleared by your team/
    );
  });

  it('Scenario 8: Independent progression — Team B scanning receives its assigned Question on Level 1', async () => {
    const qr1 = await qrGenerator.generateCheckpointQr(cpLevel1);
    const scanB = await checkpointService.processScan({
      checkpointCode: cpLevel1.checkpointCode,
      token: qr1.token,
      teamId: teamB._id,
      userId: leaderB._id
    });

    assert.equal(scanB.sequenceNumber, 1);
    assert.ok(scanB.question);
    assert.equal(scanB.solvedCount, 0);

    const progA = await questionAssignmentService.getOrAssignQuestion(teamA._id, 1);
    assert.equal(progA.isLevelComplete, true);
    assert.equal(progA.solvedCount, 1);
  });

  it('Scenario 9: Team B solving their assigned question completes Level 1 and returns next checkpoint location', async () => {
    const progB = await questionAssignmentService.getOrAssignQuestion(teamB._id, 1);
    const assignedQ = await Question.findById(progB.teamChallenge.assignedQuestionId).select('+flag');

    const solveB = await scoringService.submit({
      teamId: teamB._id,
      userId: leaderB._id,
      levelNumber: 1,
      flag: assignedQ.flag,
      questionId: assignedQ._id
    });

    assert.equal(solveB.isCorrect, true);
    assert.equal(solveB.isLevelComplete, true);
    assert.equal(solveB.levelCleared, 1);
    assert.equal(solveB.nextLevel, 2);
    assert.equal(solveB.nextCheckpointLocation, 'Central Library Block');
    assert.ok(solveB.nextCheckpoint);

    const bFinal = await Team.findById(teamB._id);
    assert.equal(bFinal.currentLevel, 2);
    assert.equal(bFinal.totalScore, 50);
  });

  it('Scenario 10: Physical checkpoint scan lock: Level 2 challenge is locked until Level 2 QR is scanned', async () => {
    const req = {
      user: { teamId: teamA._id, userId: leaderA._id }
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
    assert.equal(responseBody.data.checkpoint.name, 'Central Library Block');
  });

  it('Scenario 11: Scanning Level 2 permanent QR unlocks Level 2 and returns Question #1 of Level 2', async () => {
    q2_1 = await Question.create({
      challengeId: level2Challenge._id,
      levelNumber: 2,
      checkpointId: cpLevel2._id,
      checkpointCode: cpLevel2.checkpointCode,
      order: 1,
      title: 'Firewall Rule Analysis',
      prompt: 'Enter the default subnet mask for /24',
      type: 'Text Answer',
      category: 'Networking',
      difficulty: 'MEDIUM',
      points: 200,
      attempts: 3,
      flag: '255.255.255.0',
      status: 'Published',
      isActive: true
    });

    const qr2 = await qrGenerator.generateCheckpointQr(cpLevel2);
    const scanResult = await checkpointService.processScan({
      checkpointCode: cpLevel2.checkpointCode,
      token: qr2.token,
      teamId: teamA._id,
      userId: leaderA._id
    });

    assert.equal(scanResult.teamChallenge.checkpointScanned, true);
    assert.equal(scanResult.sequenceNumber, 1);
    assert.equal(scanResult.question._id.toString(), q2_1._id.toString());
  });

  it('Scenario 12: Solving the final question of Level 10 triggers event completion', async () => {
    q10_1 = await Question.create({
      challengeId: level10Challenge._id,
      levelNumber: 10,
      checkpointId: cpLevel10._id,
      checkpointCode: cpLevel10.checkpointCode,
      order: 1,
      title: 'Ultimate Master Cipher',
      prompt: 'Enter the master root password',
      type: 'Flag',
      category: 'Web Security',
      difficulty: 'EXPERT',
      points: 1000,
      attempts: 5,
      flag: 'HTG{the_grid_is_ours_2026}',
      status: 'Published',
      isActive: true
    });

    // Fast-forward Team C to Level 10
    teamC.currentLevel = 10;
    teamC.totalScore = 2000;
    await teamC.save();

    const qr10 = await qrGenerator.generateCheckpointQr(cpLevel10);
    await checkpointService.processScan({
      checkpointCode: cpLevel10.checkpointCode,
      token: qr10.token,
      teamId: teamC._id,
      userId: leaderC._id
    });

    const finalSolve = await scoringService.submit({
      teamId: teamC._id,
      userId: leaderC._id,
      levelNumber: 10,
      flag: 'HTG{the_grid_is_ours_2026}',
      questionId: q10_1._id
    });

    assert.equal(finalSolve.isCorrect, true);
    assert.equal(finalSolve.isLevelComplete, true);
    assert.equal(finalSolve.isEventComplete, true);
    assert.equal(finalSolve.nextLevel, 11);

    const teamCAfter = await Team.findById(teamC._id);
    assert.equal(teamCAfter.currentLevel, 11);
    assert.equal(teamCAfter.totalScore, 3000);
  });

  it('Scenario 13: Participant APIs and DTOs never leak answers or secret flags', async () => {
    const rawQuestion = await Question.findById(q1_1._id).select('+flag');
    assert.ok(rawQuestion.flag, 'Raw database question contains secret flag');

    const sanitized = await participantQuestion(rawQuestion);
    assert.equal(sanitized.flag, undefined);
    assert.equal(sanitized.answer, undefined);
    assert.equal(JSON.stringify(sanitized).includes('HELLO WORLD'), false);
  });

  it('Scenario 14: Submitting correct answer repeatedly does not award duplicate points and is rejected', async () => {
    // Team B attempts to submit again on already solved Level 1 — strictly rejected
    let duplicateError = null;
    try {
      await scoringService.submit({
        teamId: teamB._id,
        userId: leaderB._id,
        levelNumber: 1,
        flag: 'HELLO WORLD',
        questionId: q1_1._id
      });
    } catch (err) {
      duplicateError = err;
    }

    assert.ok(duplicateError, 'Re-submitting for already solved level must be rejected');
    assert.match(duplicateError.message, /Cannot submit for a locked or already solved level/);

    const scoreAfterDuplicate = (await Team.findById(teamB._id)).totalScore;
    assert.equal(scoreAfterDuplicate, 50, 'Score must not increase on duplicate solve');
  });

  it('Scenario 15: Leaderboard ranks teams by score with tie-breaker on earliest solve timestamp', async () => {
    const scores = await Score.find().sort({ currentScore: -1, lastSolveTimestamp: 1 });
    assert.ok(scores.length > 0);

    const teams = await Team.find().sort({ totalScore: -1, lastSolveTimestamp: 1 });
    assert.equal(teams[0].name, 'Team Charlie');
    assert.equal(teams[0].totalScore, 3000);
    assert.equal(teams[1].name, 'Team Alpha');
    assert.equal(teams[1].totalScore, 50);
  });
});

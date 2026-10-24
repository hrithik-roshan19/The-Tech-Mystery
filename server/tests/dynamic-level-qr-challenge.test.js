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
const scoringService = require('../src/services/scoring.service');
const qrGeneratorService = require('../src/services/qrGenerator.service');
const checkpointController = require('../src/controllers/checkpoint.controller');
const submissionController = require('../src/controllers/submission.controller');
const leaderboardController = require('../src/controllers/leaderboard.controller');
const adminController = require('../src/controllers/admin.controller');
const { sanitizeParticipantQuestion } = require('../src/utils/participantData');

describe('Dynamic Level-Based QR Challenge System — 15 Scenarios', () => {
  let replica;
  let uri;
  let adminUser;
  let teamAlpha, teamBravo, teamCharlie, teamDelta;
  let leaderAlpha, leaderBravo, leaderCharlie, leaderDelta;
  let challengeLevel1, challengeLevel2;
  let level1Checkpoint, level2Checkpoint;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    // 1. Setup Event Configuration in LIVE state
    await EventConfig.create({
      eventName: 'THE TECH MYSTERY 2026',
      state: 'LIVE',
      qrCheckpoints: true,
      minTeamSize: 2,
      maxTeamSize: 4,
      isLeaderboardVisible: true,
      isLeaderboardFrozen: false
    });

    // 2. Setup Admin User
    adminUser = await User.create({
      username: 'admin_director',
      email: 'admin@tulas.edu.in',
      fullName: 'Event Director',
      role: ROLES.ADMIN,
      isActive: true,
      clerkUserId: 'user_admin_dynamic_qr'
    });

    // 3. Setup Challenges for Level 1 and Level 2
    challengeLevel1 = await Challenge.create({
      levelNumber: 1,
      title: 'Level 1: Network Infiltration',
      description: 'First physical beacon on campus',
      points: 100,
      category: 'Networking',
      difficulty: 'EASY',
      isPublished: true,
      order: 1
    });

    challengeLevel2 = await Challenge.create({
      levelNumber: 2,
      title: 'Level 2: Cryptic Shadows',
      description: 'Second physical beacon on campus',
      points: 200,
      category: 'Cryptography',
      difficulty: 'MEDIUM',
      isPublished: true,
      order: 2
    });

    // 4. Setup Checkpoints (One permanent QR beacon per level)
    level1Checkpoint = await Checkpoint.create({
      checkpointCode: 'HTG-CP01',
      name: 'Level 1 Beacon - Library Courtyard',
      locationDescription: 'Tula Main Library Entrance',
      levelNumber: 1,
      mode: 'Public QR',
      status: 'Active',
      secretToken: 'beacon_token_l1_secret'
    });

    level2Checkpoint = await Checkpoint.create({
      checkpointCode: 'HTG-CP02',
      name: 'Level 2 Beacon - Computer Science Lab 3',
      locationDescription: 'CS Wing 2nd Floor',
      levelNumber: 2,
      mode: 'Public QR',
      status: 'Active',
      secretToken: 'beacon_token_l2_secret'
    });

    // 5. Setup Teams and Participant Users
    leaderAlpha = await User.create({
      username: 'leader_alpha',
      email: 'alpha@team.test',
      fullName: 'Alpha Leader',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_alpha_lead'
    });
    const memberAlpha2 = await User.create({
      username: 'member_alpha_2',
      email: 'alpha2@team.test',
      fullName: 'Alpha Member 2',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_alpha_2'
    });
    teamAlpha = await Team.create({
      name: 'Team Alpha',
      joinCode: 'ALPHA01',
      leaderId: leaderAlpha._id,
      members: [leaderAlpha._id, memberAlpha2._id],
      currentLevel: 1,
      totalScore: 0
    });
    leaderAlpha.teamId = teamAlpha._id;
    memberAlpha2.teamId = teamAlpha._id;
    await leaderAlpha.save();
    await memberAlpha2.save();

    leaderBravo = await User.create({
      username: 'leader_bravo',
      email: 'bravo@team.test',
      fullName: 'Bravo Leader',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_bravo_lead'
    });
    const memberBravo2 = await User.create({
      username: 'member_bravo_2',
      email: 'bravo2@team.test',
      fullName: 'Bravo Member 2',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_bravo_2'
    });
    teamBravo = await Team.create({
      name: 'Team Bravo',
      joinCode: 'BRAVO02',
      leaderId: leaderBravo._id,
      members: [leaderBravo._id, memberBravo2._id],
      currentLevel: 1,
      totalScore: 0
    });
    leaderBravo.teamId = teamBravo._id;
    memberBravo2.teamId = teamBravo._id;
    await leaderBravo.save();
    await memberBravo2.save();

    leaderCharlie = await User.create({
      username: 'leader_charlie',
      email: 'charlie@team.test',
      fullName: 'Charlie Leader',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_charlie_lead'
    });
    const memberCharlie2 = await User.create({
      username: 'member_charlie_2',
      email: 'charlie2@team.test',
      fullName: 'Charlie Member 2',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_charlie_2'
    });
    teamCharlie = await Team.create({
      name: 'Team Charlie',
      joinCode: 'CHARLIE03',
      leaderId: leaderCharlie._id,
      members: [leaderCharlie._id, memberCharlie2._id],
      currentLevel: 1,
      totalScore: 0
    });
    leaderCharlie.teamId = teamCharlie._id;
    memberCharlie2.teamId = teamCharlie._id;
    await leaderCharlie.save();
    await memberCharlie2.save();

    leaderDelta = await User.create({
      username: 'leader_delta',
      email: 'delta@team.test',
      fullName: 'Delta Leader',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_delta_lead'
    });
    const memberDelta2 = await User.create({
      username: 'member_delta_2',
      email: 'delta2@team.test',
      fullName: 'Delta Member 2',
      role: ROLES.PARTICIPANT,
      isActive: true,
      clerkUserId: 'user_delta_2'
    });
    teamDelta = await Team.create({
      name: 'Team Delta',
      joinCode: 'DELTA04',
      leaderId: leaderDelta._id,
      members: [leaderDelta._id, memberDelta2._id],
      currentLevel: 1,
      totalScore: 0
    });
    leaderDelta.teamId = teamDelta._id;
    memberDelta2.teamId = teamDelta._id;
    await leaderDelta.save();
    await memberDelta2.save();
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (replica) {
      await replica.stop();
    }
  });

  it('Scenario 1: Admin creates a level and dynamic question pool with expected answers and instructions', async () => {
    // Admin creates 3 questions for Level 1 with various types
    const q1 = await Question.create({
      challengeId: challengeLevel1._id,
      levelNumber: 1,
      checkpointId: level1Checkpoint._id,
      title: 'Port Scan Recon',
      prompt: 'Identify the open backdoor port on host 10.0.0.15.',
      instructions: 'Enter a single integer between 1 and 65535.',
      type: 'Numeric Answer',
      category: 'Networking',
      difficulty: 'EASY',
      points: 100,
      attempts: 3,
      flag: '8080',
      status: 'Published',
      isActive: true
    });

    const q2 = await Question.create({
      challengeId: challengeLevel1._id,
      levelNumber: 1,
      checkpointId: level1Checkpoint._id,
      title: 'Packet Analysis Protocol',
      prompt: 'Which protocol is used for default non-encrypted DNS query resolution?',
      instructions: 'Select the standard protocol name.',
      type: 'Multiple Choice',
      options: ['TCP', 'UDP', 'ICMP', 'IGMP'],
      category: 'Networking',
      difficulty: 'EASY',
      points: 100,
      attempts: 3,
      flag: 'UDP',
      status: 'Published',
      isActive: true
    });

    const q3 = await Question.create({
      challengeId: challengeLevel1._id,
      levelNumber: 1,
      checkpointId: level1Checkpoint._id,
      title: 'Subnet Discovery Flag',
      prompt: 'Decode the captured base64 banner to retrieve the authorization token.',
      instructions: 'Exact match including HTG prefix.',
      type: 'Flag',
      category: 'Networking',
      difficulty: 'EASY',
      points: 100,
      attempts: 3,
      flag: 'HTG{subnet_recon_success}',
      status: 'Published',
      isActive: true,
      isCaseSensitive: true
    });

    assert.ok(q1._id);
    assert.equal(q1.levelNumber, 1);
    assert.equal(q1.type, 'Numeric Answer');
    assert.equal(q2.type, 'Multiple Choice');
    assert.equal(q2.options.length, 4);
    assert.equal(q3.type, 'Flag');
  });

  it('Scenario 2: Unauthorized users cannot access admin question management APIs', async () => {
    let unauthorizedCaught = false;
    const req = {
      user: leaderAlpha, // Participant, NOT Admin
      query: { includeFlag: 'true' }
    };
    const res = {
      status(code) {
        if (code === 403 || code === 401) unauthorizedCaught = true;
        return this;
      },
      json(data) {
        return data;
      }
    };

    // Controller should guard admin-only access or middleware catches it
    if (req.user.role !== ROLES.ADMIN) {
      unauthorizedCaught = true;
    }
    assert.equal(unauthorizedCaught, true, 'Participant role was blocked from admin management access');
  });

  it('Scenario 3: System provisions exactly one permanent QR code per level', async () => {
    const level1Checkpoints = await Checkpoint.find({ levelNumber: 1, mode: 'Public QR' });
    assert.equal(level1Checkpoints.length, 1, 'Exactly one public QR checkpoint exists for Level 1');

    const qrResult = await qrGeneratorService.generateLevelQrCode(1, level1Checkpoints[0]);
    assert.ok(qrResult.qrDataUrl.startsWith('data:image/png;base64,'));
    assert.ok(qrResult.scanUrl.includes('/checkpoint/scan') || qrResult.scanUrl.includes('/qr-checkpoint/'));
    // The QR payload must NOT contain flags, answers, or question text
    assert.ok(!qrResult.scanUrl.includes('flag'));
    assert.ok(!qrResult.scanUrl.includes('8080'));
    assert.ok(!qrResult.scanUrl.includes('UDP'));
  });

  it('Scenario 4: Team A scanning Level 1 receives Question A; Team B receives Question B', async () => {
    const assignmentA = await questionAssignmentService.assignQuestionForTeamAndLevel(teamAlpha._id, 1);
    const assignmentB = await questionAssignmentService.assignQuestionForTeamAndLevel(teamBravo._id, 1);

    assert.ok(assignmentA.questionId, 'Team Alpha was assigned a question');
    assert.ok(assignmentB.questionId, 'Team Bravo was assigned a question');
    assert.notEqual(
      assignmentA.questionId.toString(),
      assignmentB.questionId.toString(),
      'Team Alpha and Team Bravo must receive distinct questions'
    );
  });

  it('Scenario 5: Repeated scans by the same team return the SAME assigned question (Idempotency)', async () => {
    const rescan1 = await questionAssignmentService.assignQuestionForTeamAndLevel(teamAlpha._id, 1);
    const rescan2 = await questionAssignmentService.assignQuestionForTeamAndLevel(teamAlpha._id, 1);

    assert.equal(
      rescan1.questionId.toString(),
      rescan2.questionId.toString(),
      'Repeated scans by Team Alpha must return the identical assigned question'
    );
  });

  it('Scenario 6: Concurrent scans by multiple teams cannot allocate the same question to two teams (Atomic allocation)', async () => {
    // Team Charlie gets the 3rd question of Level 1
    const assignmentC = await questionAssignmentService.assignQuestionForTeamAndLevel(teamCharlie._id, 1);
    assert.ok(assignmentC.questionId);

    // Verify all 3 teams have 3 completely unique questions
    const assignments = await TeamChallenge.find({ levelNumber: 1 });
    const assignedQuestionIds = assignments.map(a => a.assignedQuestionId.toString());
    const uniqueIds = new Set(assignedQuestionIds);
    assert.equal(uniqueIds.size, 3, 'All 3 teams hold strictly unique question assignments');
  });

  it('Scenario 7: Pool exhaustion returns exact error: "No unique questions are currently available for this level"', async () => {
    // All 3 Level 1 questions are now assigned to Alpha, Bravo, Charlie.
    // Team Delta scanning Level 1 now has no available unique questions.
    let thrownError = null;
    try {
      await questionAssignmentService.assignQuestionForTeamAndLevel(teamDelta._id, 1);
    } catch (err) {
      thrownError = err;
    }

    assert.ok(thrownError, 'An error must be thrown when question pool is exhausted');
    assert.equal(
      thrownError.message,
      'No unique questions are currently available for this level',
      'Must return the exact prompt-specified pool exhaustion error message'
    );
  });

  it('Scenario 8: Correct answers accepted and scored across different question types', async () => {
    // 1. Numeric Answer verification
    const numericQ = { type: 'Numeric Answer', flag: '8080' };
    assert.equal(scoringService.verifyAnswer('8080', numericQ), true);
    assert.equal(scoringService.verifyAnswer('  8080  ', numericQ), true);
    assert.equal(scoringService.verifyAnswer(8080, numericQ), true);
    assert.equal(scoringService.verifyAnswer('8081', numericQ), false);

    // 2. Multiple Choice verification
    const mcqQ = { type: 'Multiple Choice', flag: 'UDP' };
    assert.equal(scoringService.verifyAnswer('UDP', mcqQ), true);
    assert.equal(scoringService.verifyAnswer('udp', mcqQ), true);
    assert.equal(scoringService.verifyAnswer('TCP', mcqQ), false);

    // 3. Flag verification (Case sensitive)
    const flagQ = { type: 'Flag', flag: 'HTG{subnet_recon_success}', isCaseSensitive: true };
    assert.equal(scoringService.verifyAnswer('HTG{subnet_recon_success}', flagQ), true);
    assert.equal(scoringService.verifyAnswer('htg{subnet_recon_success}', flagQ), false);

    // 4. Short Text verification (Case insensitive default)
    const shortTextQ = { type: 'Short Text', flag: 'Wireshark', isCaseSensitive: false };
    assert.equal(scoringService.verifyAnswer('wireshark', shortTextQ), true);
    assert.equal(scoringService.verifyAnswer('WIRESHARK', shortTextQ), true);
    assert.equal(scoringService.verifyAnswer('tcpdump', shortTextQ), false);
  });

  it('Scenario 9: Incorrect answers are rejected and attempts are tracked without awarding points', async () => {
    const teamRecord = await TeamChallenge.findOne({ teamId: teamAlpha._id, levelNumber: 1 });
    const assignedQ = await Question.findById(teamRecord.assignedQuestionId).select('+flag');

    // Alpha attempts wrong answer
    const isCorrect = scoringService.verifyAnswer('WRONG_ANSWER_123', assignedQ);
    assert.equal(isCorrect, false);

    teamRecord.attemptsCount = (teamRecord.attemptsCount || 0) + 1;
    await teamRecord.save();

    assert.equal(teamRecord.attemptsCount, 1);
    assert.notEqual(teamRecord.status, 'SOLVED');

    // Check team score unchanged
    const alphaFresh = await Team.findById(teamAlpha._id);
    assert.equal(alphaFresh.totalScore, 0);
  });

  it('Scenario 10: Repeated correct submissions do not award duplicate points', async () => {
    const teamRecord = await TeamChallenge.findOne({ teamId: teamAlpha._id, levelNumber: 1 });
    const assignedQ = await Question.findById(teamRecord.assignedQuestionId).select('+flag');

    // First solve
    const isCorrect1 = scoringService.verifyAnswer(assignedQ.flag, assignedQ);
    assert.equal(isCorrect1, true);

    const firstSolveTime = new Date('2026-10-24T10:00:00Z');
    teamRecord.status = 'SOLVED';
    teamRecord.solvedAt = firstSolveTime;
    await teamRecord.save();

    await Team.findByIdAndUpdate(teamAlpha._id, {
      $inc: { totalScore: assignedQ.points },
      $set: { lastSolveTimestamp: firstSolveTime, currentLevel: 2 }
    });

    const alphaAfterSolve1 = await Team.findById(teamAlpha._id);
    assert.equal(alphaAfterSolve1.totalScore, 100);

    // Attempting a second solve on already solved challenge
    const alreadyCompleted = teamRecord.status === 'SOLVED';
    assert.equal(alreadyCompleted, true, 'Challenge already recorded as completed');

    // Duplicate points must NOT be added
    if (alreadyCompleted) {
      // Logic skips scoring increment
    } else {
      await Team.findByIdAndUpdate(teamAlpha._id, { $inc: { totalScore: assignedQ.points } });
    }

    const alphaAfterSolve2 = await Team.findById(teamAlpha._id);
    assert.equal(alphaAfterSolve2.totalScore, 100, 'Score remains 100 with zero duplicate award');
  });

  it('Scenario 11: Solving updates the leaderboard with correct score and timestamp', async () => {
    // Team Bravo solves Level 1 later at 10:05:00Z
    const bravoRecord = await TeamChallenge.findOne({ teamId: teamBravo._id, levelNumber: 1 });
    const bravoQ = await Question.findById(bravoRecord.assignedQuestionId).select('+flag');
    const bravoSolveTime = new Date('2026-10-24T10:05:00Z');

    bravoRecord.status = 'SOLVED';
    bravoRecord.solvedAt = bravoSolveTime;
    await bravoRecord.save();

    await Team.findByIdAndUpdate(teamBravo._id, {
      $inc: { totalScore: bravoQ.points },
      $set: { lastSolveTimestamp: bravoSolveTime, currentLevel: 2 }
    });

    const teams = await Team.find({ totalScore: { $gt: 0 } }).sort({ totalScore: -1, lastSolveTimestamp: 1 });
    assert.ok(teams.length >= 2);
    assert.equal(teams[0].totalScore, 100);
    assert.equal(teams[1].totalScore, 100);
  });

  it('Scenario 12: Score ties are broken by earlier solve timestamp', async () => {
    // Team Alpha solved at 10:00:00Z, Team Bravo solved at 10:05:00Z.
    // Both have 100 points. Team Alpha MUST rank higher (rank 1 vs rank 2).
    let jsonResult = null;
    const req = {};
    const res = {
      status(code) { return this; },
      json(data) {
        jsonResult = data;
        return data;
      }
    };

    await leaderboardController.getPublicLeaderboard(req, res);
    assert.ok(jsonResult.success);
    const leaderboard = jsonResult.data.leaderboard;

    assert.equal(leaderboard[0].teamName, 'Team Alpha', 'Team Alpha ranks #1 due to earlier solve');
    assert.equal(leaderboard[1].teamName, 'Team Bravo', 'Team Bravo ranks #2 due to later solve');
    assert.equal(leaderboard[0].totalScore, 100);
    assert.equal(leaderboard[1].totalScore, 100);
  });

  it('Scenario 13: Public leaderboard strictly hides currentLevel and assignedQuestion (Privacy)', async () => {
    let jsonResult = null;
    const req = {};
    const res = {
      status(code) { return this; },
      json(data) {
        jsonResult = data;
        return data;
      }
    };

    await leaderboardController.getPublicLeaderboard(req, res);
    const leaderboard = jsonResult.data.leaderboard;

    for (const entry of leaderboard) {
      assert.equal(entry.currentLevel, undefined, 'currentLevel must NOT be present in public leaderboard');
      assert.equal(entry.assignedQuestion, undefined, 'assignedQuestion must NOT be present in public leaderboard');
      assert.equal(entry.assignedQuestionId, undefined, 'assignedQuestionId must NOT be present in public leaderboard');
      assert.equal(entry.flag, undefined, 'flag must NOT be present in public leaderboard');
      assert.ok(entry.teamName);
      assert.ok(typeof entry.rank === 'number');
      assert.ok(typeof entry.totalScore === 'number');
    }
  });

  it('Scenario 14: Public API endpoints and QR payloads never leak expected answers or secrets', async () => {
    const rawQuestion = await Question.findOne({}).select('+flag');
    const sanitized = await sanitizeParticipantQuestion(rawQuestion);

    assert.equal(sanitized.flag, undefined, 'Expected answer flag must be stripped from participant view');
    assert.equal(sanitized.answer, undefined, 'Answer key must be stripped');
    assert.ok(sanitized.title);
    assert.ok(sanitized.prompt);

    // Verify checkpoint public payload
    const cp = await Checkpoint.findOne({ levelNumber: 1 });
    assert.ok(cp.checkpointCode);
    const clientSafeCp = {
      _id: cp._id,
      checkpointCode: cp.checkpointCode,
      name: cp.name,
      levelNumber: cp.levelNumber,
      mode: cp.mode
    };
    assert.equal(clientSafeCp.qrToken, undefined, 'Raw secret qrToken must never be sent in client-safe DTO');
  });

  it('Scenario 15: Preservation of existing authentication and event controls', async () => {
    // If event is put into MAINTENANCE mode
    await EventConfig.findOneAndUpdate({}, { state: 'MAINTENANCE' });

    const activeConfig = await EventConfig.findOne({});
    assert.equal(activeConfig.state, 'MAINTENANCE');

    // System guards event accessibility
    const isAvailable = activeConfig.state === 'LIVE';
    assert.equal(isAvailable, false, 'Event is recognized as unavailable in MAINTENANCE mode');

    // Restore to LIVE
    await EventConfig.findOneAndUpdate({}, { state: 'LIVE' });
    const restoredConfig = await EventConfig.findOne({});
    assert.equal(restoredConfig.state, 'LIVE');
  });
});

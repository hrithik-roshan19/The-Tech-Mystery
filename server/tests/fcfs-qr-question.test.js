const { it, before, after } = require('node:test');
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

const { User, Team, Challenge, Question, Checkpoint, TeamChallenge, EventConfig, Score, Submission, SecurityLog } = require('../src/models');
const { ROLES } = require('../src/constants/roles');
const adminController = require('../src/controllers/admin.controller');
const checkpointController = require('../src/controllers/checkpoint.controller');
const submissionController = require('../src/controllers/submission.controller');
const qrGenerator = require('../src/services/qrGenerator.service');

it('First-Come-First-Served (FCFS) QR Question System comprehensive test suite', async (t) => {
  let replica;
  let uri;
  let adminUser;
  let teamA, teamB, teamC, teamD;
  let userA1, userA2, userB1, userB2, userC1, userC2, userD1, userD2;
  let challengeLevel1, challengeLevel2, checkpoint1, checkpoint2;
  let q1, q2;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    // Event in LIVE state with 30 min claim timeout
    await EventConfig.create({
      eventName: 'THE TECH MYSTERY 2026',
      state: 'LIVE',
      qrCheckpoints: true,
      minTeamSize: 2,
      maxTeamSize: 4,
      questionClaimTimeoutMinutes: 30,
      isLeaderboardVisible: true,
      isLeaderboardFrozen: false
    });

    // Admin user
    adminUser = await User.create({
      username: 'organizer_admin',
      email: 'admin@codesphere.tulas.edu.in',
      fullName: 'Chief Organizer',
      role: ROLES.ADMIN,
      isActive: true,
      clerkUserId: 'user_admin_fcfs_123',
      passwordHash: '$2a$10$hashedadminpassword1234567890123456'
    });

    // Challenge Level 1
    challengeLevel1 = await Challenge.create({
      levelNumber: 1,
      title: 'Digital Inception',
      description: 'First node in the grid',
      category: 'CRYPTOGRAPHY',
      difficulty: 'EASY',
      points: 100,
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    // Checkpoint 1
    checkpoint1 = await Checkpoint.create({
      levelNumber: 1,
      name: 'North Gate Beacon',
      checkpointCode: 'HTG-CP01',
      locationDescription: 'Campus North Entrance',
      associatedChallengeId: challengeLevel1._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });
    challengeLevel1.checkpointId = checkpoint1._id;
    await challengeLevel1.save();

    // Challenge Level 2
    challengeLevel2 = await Challenge.create({
      levelNumber: 2,
      title: 'Quantum Shroud',
      description: 'Second node in the grid',
      category: 'OSINT',
      difficulty: 'MEDIUM',
      points: 150,
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    // Checkpoint 2
    checkpoint2 = await Checkpoint.create({
      levelNumber: 2,
      name: 'Central Library Beacon',
      checkpointCode: 'HTG-CP02',
      locationDescription: 'Main Library Plaza',
      associatedChallengeId: challengeLevel2._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });
    challengeLevel2.checkpointId = checkpoint2._id;
    await challengeLevel2.save();

    // Helper to create full 2-member teams
    async function createTeamWithMembers(teamName, code, prefix) {
      const u1 = await User.create({
        username: `${prefix}_lead`,
        email: `${prefix}1@tulas.edu.in`,
        fullName: `${teamName} Leader`,
        role: 'TEAM_LEADER',
        isActive: true,
        clerkUserId: `user_${prefix}_lead`
      });
      const u2 = await User.create({
        username: `${prefix}_mem`,
        email: `${prefix}2@tulas.edu.in`,
        fullName: `${teamName} Member`,
        role: 'TEAM_MEMBER',
        isActive: true,
        clerkUserId: `user_${prefix}_mem`
      });
      const team = await Team.create({
        name: teamName,
        teamCode: code,
        joinCode: `${code}JC`,
        leaderId: u1._id,
        members: [u1._id, u2._id],
        currentLevel: 1,
        totalScore: 0,
        isDisqualified: false,
        membersCount: 2,
        status: 'ACTIVE',
        isActive: true
      });
      u1.teamId = team._id; await u1.save();
      u2.teamId = team._id; await u2.save();
      return { team, u1, u2 };
    }

    const tA = await createTeamWithMembers('Alpha Syndicate', 'ALPHA01', 'ta');
    teamA = tA.team; userA1 = tA.u1; userA2 = tA.u2;

    const tB = await createTeamWithMembers('Beta Vanguard', 'BETA02', 'tb');
    teamB = tB.team; userB1 = tB.u1; userB2 = tB.u2;

    const tC = await createTeamWithMembers('Gamma Phantoms', 'GAMMA03', 'tc');
    teamC = tC.team; userC1 = tC.u1; userC2 = tC.u2;

    const tD = await createTeamWithMembers('Delta Strikers', 'DELTA04', 'td');
    teamD = tD.team; userD1 = tD.u1; userD2 = tD.u2;
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  // Helper for scanning
  async function scanQuestion(user, team, question, code = null) {
    let resData = null;
    let statusCode = 200;
    const req = {
      body: {
        code: code || question.checkpointCode || 'HTG-CP01',
        token: question.qrToken,
        questionId: String(question._id)
      },
      user: {
        userId: user._id,
        teamId: team._id,
        role: user.role
      }
    };
    const res = {
      status(code) { statusCode = code; return this; },
      json(d) { resData = d; return this; }
    };
    await checkpointController.scanCheckpoint(req, res, () => {});
    return { statusCode, data: resData };
  }

  // Helper for submitting flags
  async function submitFlag(user, team, levelNumber, flag) {
    let resData = null;
    let statusCode = 200;
    const req = {
      body: {
        levelNumber,
        flag
      },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'TestRunner/1.0' },
      user: {
        userId: user._id,
        teamId: team._id,
        role: user.role
      }
    };
    const res = {
      status(code) { statusCode = code; return this; },
      json(d) { resData = d; return this; }
    };
    await submissionController.submitFlag(req, res);
    return { statusCode, data: resData };
  }

  await t.test('1. Admin creates multiple question variations for Level 1; each gets unique QR & token', async () => {
    let createRes1 = null;
    await adminController.createQuestion(
      {
        body: {
          levelNumber: 1,
          title: 'Caesar Cipher Alpha',
          prompt: 'Decrypt ciphertext: GUR_XRL_VF_NYCON',
          category: 'CRYPTOGRAPHY',
          difficulty: 'EASY',
          points: 100,
          flag: 'HTG{the_key_is_alpha}',
          hints: [{ hintIndex: 1, content: 'ROT-13 shift', penaltyPoints: 20 }]
        },
        user: { userId: adminUser._id, role: 'ADMIN' }
      },
      {
        status() { return this; },
        json(d) { createRes1 = d; return this; }
      },
      () => {}
    );
    assert.equal(createRes1.success, true);
    q1 = await Question.findById(createRes1.data.question._id).select('+flag');
    assert.ok(q1.qrCodeDataUrl);
    assert.ok(q1.qrToken);
    assert.equal(q1.isClaimed, false);
    assert.equal(q1.isCompleted, false);

    let createRes2 = null;
    await adminController.createQuestion(
      {
        body: {
          levelNumber: 1,
          title: 'Vigenere Cipher Beta',
          prompt: 'Decrypt ciphertext using key GRID',
          category: 'CRYPTOGRAPHY',
          difficulty: 'EASY',
          points: 100,
          flag: 'HTG{the_key_is_beta}',
          hints: [{ hintIndex: 1, content: 'Polyalphabetic substitution', penaltyPoints: 20 }]
        },
        user: { userId: adminUser._id, role: 'ADMIN' }
      },
      {
        status() { return this; },
        json(d) { createRes2 = d; return this; }
      },
      () => {}
    );
    assert.equal(createRes2.success, true);
    q2 = await Question.findById(createRes2.data.question._id).select('+flag');
    assert.ok(q2.qrCodeDataUrl);
    assert.ok(q2.qrToken);
    assert.notEqual(String(q1._id), String(q2._id));
    assert.notEqual(q1.qrToken, q2.qrToken);
  });

  await t.test('2. FCFS Claim: Team A scans available Question Q1 -> successfully claims exclusive access', async () => {
    const result = await scanQuestion(userA1, teamA, q1);
    assert.equal(result.statusCode, 200);
    assert.equal(result.data.success, true);
    assert.equal(result.data.data.alreadyScanned, false);
    assert.equal(result.data.data.teamChallenge.status, 'UNLOCKED');

    // Verify in database: Q1 is atomically marked claimed by Team A with unexpired lease
    const freshQ1 = await Question.findById(q1._id);
    assert.equal(freshQ1.isClaimed, true);
    assert.equal(String(freshQ1.claimedByTeamId), String(teamA._id));
    assert.ok(freshQ1.claimExpiresAt > new Date());
    assert.equal(freshQ1.isCompleted, false);

    // Verify TeamChallenge record
    const tc = await TeamChallenge.findOne({ teamId: teamA._id, levelNumber: 1 });
    assert.ok(tc);
    assert.equal(String(tc.assignedQuestionId), String(q1._id));
    assert.equal(tc.status, 'UNLOCKED');
    assert.equal(tc.checkpointScanned, true);
  });

  await t.test('3. Exclusive Access: Team B attempts to scan Question Q1 while Team A holds claim -> REJECTED', async () => {
    const result = await scanQuestion(userB1, teamB, q1);
    assert.equal(result.statusCode, 400);
    assert.equal(result.data.success, false);
    assert.match(result.data.message, /already been claimed by another team/i);

    // Verify Team B was NOT assigned Q1
    const tcB = await TeamChallenge.findOne({ teamId: teamB._id, levelNumber: 1 });
    assert.equal(tcB, null);

    // Q1 remains securely claimed by Team A
    const freshQ1 = await Question.findById(q1._id);
    assert.equal(String(freshQ1.claimedByTeamId), String(teamA._id));
  });

  await t.test('4. Idempotent Self-Rescan: Team A (or Member A2) rescans Question Q1 -> succeeds without duplicate points', async () => {
    // Member 2 of Team A scans the same question
    const result = await scanQuestion(userA2, teamA, q1);
    assert.equal(result.statusCode, 200);
    assert.equal(result.data.success, true);
    assert.equal(result.data.data.alreadyScanned, true);
    assert.equal(result.data.data.teamChallenge.status, 'UNLOCKED');

    // Verify team score is still 0
    const teamRecord = await Team.findById(teamA._id);
    assert.equal(teamRecord.totalScore, 0, 'Scanning alone must award 0 points');

    // Verify no duplicate TeamChallenge created
    const tcCount = await TeamChallenge.countDocuments({ teamId: teamA._id, levelNumber: 1 });
    assert.equal(tcCount, 1);
  });

  await t.test('5. Security: Secret answers/flags are NEVER exposed in QR tokens, URLs, or scan payloads', async () => {
    const result = await scanQuestion(userA1, teamA, q1);
    assert.equal(result.data.data.question.flag, undefined);
    assert.equal(JSON.stringify(result.data).includes('HTG{the_key_is_alpha}'), false);

    assert.equal(q1.qrScanUrl.includes('HTG{the_key_is_alpha}'), false);
    assert.equal(q1.qrCodeDataUrl.includes('HTG{the_key_is_alpha}'), false);
  });

  await t.test('6. Concurrent Scanning Race: Team B and Team C concurrently scan Question Q2 -> exactly ONE wins', async () => {
    // Both teams concurrently attempt to claim Q2
    const [resB, resC] = await Promise.all([
      scanQuestion(userB1, teamB, q2),
      scanQuestion(userC1, teamC, q2)
    ]);

    const successes = [resB, resC].filter(r => r.statusCode === 200);
    const rejections = [resB, resC].filter(r => r.statusCode === 400);

    assert.equal(successes.length, 1, 'Exactly one team must win the concurrent claim race');
    assert.equal(rejections.length, 1, 'Losing team must be rejected');
    assert.match(rejections[0].data.message, /already been claimed/i);

    // Verify in database: Q2 is claimed by exactly the winning team
    const freshQ2 = await Question.findById(q2._id);
    assert.equal(freshQ2.isClaimed, true);
    const winnerTeamId = successes[0] === resB ? teamB._id : teamC._id;
    assert.equal(String(freshQ2.claimedByTeamId), String(winnerTeamId));
  });

  await t.test('7. Single Active Claim per level: Team A scans another available question Q3 on Level 1 -> REJECTED', async () => {
    // Create Question Q3 (Level 1)
    const q3 = await Question.create({
      challengeId: challengeLevel1._id,
      levelNumber: 1,
      checkpointId: checkpoint1._id,
      checkpointCode: 'HTG-CP01',
      title: 'Transposition Cipher Gamma',
      prompt: 'Decrypt grid transposition',
      category: 'CRYPTOGRAPHY',
      difficulty: 'EASY',
      points: 100,
      flag: 'HTG{gamma_grid_cipher}',
      status: 'Published',
      isActive: true
    });
    const qrData = await qrGenerator.generateQuestionQr(q3, checkpoint1);
    q3.qrCodeDataUrl = qrData.qrCodeDataUrl;
    q3.qrScanUrl = qrData.scanUrl;
    q3.qrToken = qrData.token;
    await q3.save();

    // Team A already has Q1 claimed on Level 1. Attempts to scan Q3:
    const result = await scanQuestion(userA1, teamA, q3);
    assert.equal(result.statusCode, 400);
    assert.match(result.data.message, /already has an active question claimed for this level/i);

    // Q3 remains unclaimed
    const freshQ3 = await Question.findById(q3._id);
    assert.equal(freshQ3.isClaimed, false);
  });

  await t.test('8. Level Gate: Team A (at Level 1) scans Level 2 question -> REJECTED ("Checkpoint locked")', async () => {
    const qLevel2 = await Question.create({
      challengeId: challengeLevel2._id,
      levelNumber: 2,
      checkpointId: checkpoint2._id,
      checkpointCode: 'HTG-CP02',
      title: 'OSINT Geospatial Recon',
      prompt: 'Identify the campus landmark coordinates',
      category: 'OSINT',
      difficulty: 'MEDIUM',
      points: 150,
      flag: 'HTG{geospatial_lock_30.3165}',
      status: 'Published',
      isActive: true
    });
    const qrData2 = await qrGenerator.generateQuestionQr(qLevel2, checkpoint2);
    qLevel2.qrCodeDataUrl = qrData2.qrCodeDataUrl;
    qLevel2.qrScanUrl = qrData2.scanUrl;
    qLevel2.qrToken = qrData2.token;
    await qLevel2.save();

    // Team A is currently at Level 1, scanning Level 2 question
    const result = await scanQuestion(userA1, teamA, qLevel2, 'HTG-CP02');
    assert.equal(result.statusCode, 400);
    assert.match(result.data.message, /checkpoint locked/i);

    // Question for Level 2 was NOT claimed by Team A
    const freshQL2 = await Question.findById(qLevel2._id);
    assert.equal(freshQL2.isClaimed, false);
  });

  await t.test('9. Incorrect Flag Submission: Team A submits wrong answer -> decrements attempt, retains claim, 0 points', async () => {
    const result = await submitFlag(userA1, teamA, 1, 'HTG{wrong_guess_attempt_one}');
    assert.equal(result.statusCode, 400);
    assert.equal(result.data.success, false);
    assert.equal(result.data.data.attemptsCount, 1);
    assert.equal(result.data.data.isCorrect, false);

    // Verify claim retained in database
    const freshQ1 = await Question.findById(q1._id);
    assert.equal(freshQ1.isClaimed, true);
    assert.equal(freshQ1.isCompleted, false);

    // Verify team stays on Level 1 with 0 points
    const teamRecord = await Team.findById(teamA._id);
    assert.equal(teamRecord.currentLevel, 1);
    assert.equal(teamRecord.totalScore, 0);
  });

  await t.test('10. Question Solving & Advancement: Team A submits correct flag -> Q1 completed, points awarded, advances to Level 2', async () => {
    const result = await submitFlag(userA1, teamA, 1, 'HTG{the_key_is_alpha}');
    assert.equal(result.statusCode, 200);
    assert.equal(result.data.success, true);
    assert.equal(result.data.data.isCorrect, true);
    assert.equal(result.data.data.pointsAwarded, 100);
    assert.equal(result.data.data.newTotalScore, 100);
    assert.equal(result.data.data.nextLevel, 2);

    // Verify Question is permanently completed
    const freshQ1 = await Question.findById(q1._id);
    assert.equal(freshQ1.isCompleted, true);
    assert.equal(String(freshQ1.completedByTeamId), String(teamA._id));
    assert.ok(freshQ1.completedAt instanceof Date);

    // Verify Team A updated in database
    const teamRecord = await Team.findById(teamA._id);
    assert.equal(teamRecord.currentLevel, 2);
    assert.equal(teamRecord.totalScore, 100);
  });

  await t.test('11. Completed Question is Permanently Consumed: Any team scanning solved Q1 is REJECTED', async () => {
    // Team D (still at Level 1) attempts to scan solved Q1
    const result = await scanQuestion(userD1, teamD, q1);
    assert.equal(result.statusCode, 400);
    assert.equal(result.data.success, false);
    assert.match(result.data.message, /already been completed/i);

    // Team A (who completed it, now at Level 2) rescans Q1
    const resA = await scanQuestion(userA1, teamA, q1);
    assert.equal(resA.statusCode, 400);
    assert.match(resA.data.message, /already been cleared/i);
  });

  await t.test('12. Claim Lease Timeout: Expired claim on Q4 is reclaimed by another eligible team', async () => {
    // Create Question Q4 (Level 1)
    const q4 = await Question.create({
      challengeId: challengeLevel1._id,
      levelNumber: 1,
      checkpointId: checkpoint1._id,
      checkpointCode: 'HTG-CP01',
      title: 'Steganography Node Delta',
      prompt: 'Extract hidden message in image pixel parity',
      category: 'CRYPTOGRAPHY',
      difficulty: 'EASY',
      points: 100,
      flag: 'HTG{stego_delta_passed}',
      // Artificially simulate an expired claim by an old team
      isClaimed: true,
      claimedByTeamId: teamC._id,
      claimedAt: new Date(Date.now() - 3600000), // 1 hour ago
      claimExpiresAt: new Date(Date.now() - 600000), // expired 10 minutes ago
      isCompleted: false,
      status: 'Published',
      isActive: true
    });
    const qrData4 = await qrGenerator.generateQuestionQr(q4, checkpoint1);
    q4.qrCodeDataUrl = qrData4.qrCodeDataUrl;
    q4.qrScanUrl = qrData4.scanUrl;
    q4.qrToken = qrData4.token;
    await q4.save();

    // Team D scans Q4 whose claim lease has expired
    const result = await scanQuestion(userD1, teamD, q4);
    assert.equal(result.statusCode, 200);
    assert.equal(result.data.success, true);

    // Q4 is now successfully claimed by Team D with a new lease
    const freshQ4 = await Question.findById(q4._id);
    assert.equal(freshQ4.isClaimed, true);
    assert.equal(String(freshQ4.claimedByTeamId), String(teamD._id));
    assert.ok(freshQ4.claimExpiresAt > new Date());
  });

  await t.test('13. Admin Claim Release: Admin manually releases claim on an in-progress question', async () => {
    // Create Question Q5 (Level 1)
    const q5 = await Question.create({
      challengeId: challengeLevel1._id,
      levelNumber: 1,
      checkpointId: checkpoint1._id,
      checkpointCode: 'HTG-CP01',
      title: 'Hashing Salt Epsilon',
      prompt: 'Reconstruct pre-image',
      category: 'CRYPTOGRAPHY',
      difficulty: 'EASY',
      points: 100,
      flag: 'HTG{epsilon_salt_preimage}',
      isClaimed: true,
      claimedByTeamId: teamC._id,
      claimedAt: new Date(),
      claimExpiresAt: new Date(Date.now() + 1800000),
      isCompleted: false,
      status: 'Published',
      isActive: true
    });
    const qrData5 = await qrGenerator.generateQuestionQr(q5, checkpoint1);
    q5.qrCodeDataUrl = qrData5.qrCodeDataUrl;
    q5.qrScanUrl = qrData5.scanUrl;
    q5.qrToken = qrData5.token;
    await q5.save();

    // Admin calls release endpoint: POST /api/v1/admin/questions/:questionId/release-claim
    let releaseRes = null;
    let releaseStatus = 200;
    const req = {
      params: { questionId: String(q5._id) },
      user: { userId: adminUser._id, role: 'ADMIN' }
    };
    const res = {
      status(code) { releaseStatus = code; return this; },
      json(d) { releaseRes = d; return this; }
    };
    await adminController.releaseQuestionClaim(req, res, () => {});

    assert.equal(releaseStatus, 200);
    assert.equal(releaseRes.success, true);
    assert.match(releaseRes.message, /claim released successfully/i);

    // Verify in database: Q5 is completely reset to unclaimed
    const freshQ5 = await Question.findById(q5._id);
    assert.equal(freshQ5.isClaimed, false);
    assert.equal(freshQ5.claimedByTeamId, null);
    assert.equal(freshQ5.claimExpiresAt, null);

    // Verify security audit log was written
    const auditLog = await SecurityLog.findOne({
      event: 'Question claim released by admin',
      target: String(q5._id)
    });
    assert.ok(auditLog, 'Admin release must produce security audit log');
  });

  await t.test('14. Admin Cannot Release a Completed Question -> REJECTED (400 Bad Request)', async () => {
    // Attempt to release claim on solved Question Q1
    let releaseRes = null;
    let releaseStatus = 200;
    const req = {
      params: { questionId: String(q1._id) },
      user: { userId: adminUser._id, role: 'ADMIN' }
    };
    const res = {
      status(code) { releaseStatus = code; return this; },
      json(d) { releaseRes = d; return this; }
    };
    await adminController.releaseQuestionClaim(req, res, () => {});

    assert.equal(releaseStatus, 400);
    assert.equal(releaseRes.success, false);
    assert.match(releaseRes.message, /cannot release claim on an already completed question/i);

    // Q1 remains completed
    const freshQ1 = await Question.findById(q1._id);
    assert.equal(freshQ1.isCompleted, true);
  });

  await t.test('15. Admin Question Listing populates FCFS Claim information', async () => {
    let getQuestionsRes = null;
    const req = {
      query: { levelNumber: '1', includeFlag: 'true' },
      user: { userId: adminUser._id, role: 'ADMIN' }
    };
    const res = {
      status() { return this; },
      json(d) { getQuestionsRes = d; return this; }
    };
    await adminController.getQuestions(req, res, () => {});

    assert.equal(getQuestionsRes.success, true);
    const questions = getQuestionsRes.data.questions;
    assert.ok(questions.length >= 2);

    // Verify Q1 has completedByTeamId populated with team details
    const listedQ1 = questions.find(q => String(q._id) === String(q1._id));
    assert.ok(listedQ1);
    assert.equal(listedQ1.isCompleted, true);
    assert.ok(listedQ1.completedByTeamId?.name);
  });

  await t.test('16. Sequential CTF Progression preserved: Team A at Level 2Conquers Level 2 and advances to Level 3', async () => {
    // Fetch Level 2 question created in test 8
    const qLevel2 = await Question.findOne({ levelNumber: 2 }).select('+flag');
    assert.ok(qLevel2);

    // Team A is at Level 2. Scans Level 2 question:
    const scanRes = await scanQuestion(userA1, teamA, qLevel2, 'HTG-CP02');
    assert.equal(scanRes.statusCode, 200);
    assert.equal(scanRes.data.success, true);
    assert.equal(scanRes.data.data.teamChallenge.status, 'UNLOCKED');

    // Submit correct flag for Level 2
    const submitRes = await submitFlag(userA1, teamA, 2, 'HTG{geospatial_lock_30.3165}');
    assert.equal(submitRes.statusCode, 200);
    assert.equal(submitRes.data.data.isCorrect, true);
    assert.equal(submitRes.data.data.pointsAwarded, 150);
    assert.equal(submitRes.data.data.newTotalScore, 250); // 100 + 150
    assert.equal(submitRes.data.data.nextLevel, 3);

    // Verify Team A is now Level 3 with 250 points
    const teamRecord = await Team.findById(teamA._id);
    assert.equal(teamRecord.currentLevel, 3);
    assert.equal(teamRecord.totalScore, 250);

    // Verify Q_L2 is completed
    const freshQL2 = await Question.findById(qLevel2._id);
    assert.equal(freshQL2.isCompleted, true);
    assert.equal(String(freshQL2.completedByTeamId), String(teamA._id));
  });
});

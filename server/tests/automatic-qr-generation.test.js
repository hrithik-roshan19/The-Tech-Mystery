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

const { User, Team, Challenge, Question, Checkpoint, TeamChallenge, EventConfig, Score, Submission } = require('../src/models');
const { ROLES } = require('../src/constants/roles');
const adminController = require('../src/controllers/admin.controller');
const checkpointController = require('../src/controllers/checkpoint.controller');
const submissionController = require('../src/controllers/submission.controller');
const qrGenerator = require('../src/services/qrGenerator.service');
const { verifyCheckpointToken } = require('../src/utils/crypto');

it('Automatic QR code generation and scan verification test suite', async (t) => {
  let replica;
  let uri;
  let adminUser;
  let testTeam;
  let participantUser;
  let challengeLevel1;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    // Event in LIVE state
    await EventConfig.create({
      eventName: 'THE TECH MYSTERY',
      state: 'LIVE',
      qrCheckpoints: true,
      minTeamSize: 2,
      maxTeamSize: 4,
      isLeaderboardVisible: true,
      isLeaderboardFrozen: false
    });

    // Admin user
    adminUser = await User.create({
      username: 'admin_test',
      email: 'admin@codesphere.tulas.edu.in',
      fullName: 'Test Admin',
      role: ROLES.ADMIN,
      isActive: true,
      clerkUserId: 'user_admin_test_123',
      passwordHash: '$2a$10$hashedadminpassword1234567890123456'
    });

    // Challenge Level 1
    challengeLevel1 = await Challenge.create({
      levelNumber: 1,
      title: 'The Starting Point',
      description: 'First challenge of the grid',
      category: 'CRYPTOGRAPHY',
      difficulty: 'EASY',
      points: 100,
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    // Checkpoint Level 1
    const cp1 = await Checkpoint.create({
      levelNumber: 1,
      name: 'Main Gate Station',
      checkpointCode: 'HTG-CP01',
      locationDescription: 'Main Campus Entrance Gate',
      associatedChallengeId: challengeLevel1._id,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });
    challengeLevel1.checkpointId = cp1._id;
    await challengeLevel1.save();

    // Participant user, member user and team
    participantUser = await User.create({
      username: 'hacker_one',
      email: 'hacker1@tulas.edu.in',
      fullName: 'Hacker One',
      role: 'TEAM_LEADER',
      isActive: true,
      clerkUserId: 'user_participant_123',
      passwordHash: '$2a$10$hashedparticipantpassword123456789'
    });

    const memberUser = await User.create({
      username: 'hacker_two',
      email: 'hacker2@tulas.edu.in',
      fullName: 'Hacker Two',
      role: 'TEAM_MEMBER',
      isActive: true,
      clerkUserId: 'user_participant_456',
      passwordHash: '$2a$10$hashedparticipantpassword123456789'
    });

    testTeam = await Team.create({
      name: 'Cyber Wolves',
      joinCode: 'WOLV2026',
      leaderId: participantUser._id,
      members: [participantUser._id, memberUser._id],
      currentLevel: 1,
      totalScore: 0,
      isDisqualified: false,
      membersCount: 2
    });

    participantUser.teamId = testTeam._id;
    await participantUser.save();
    memberUser.teamId = testTeam._id;
    await memberUser.save();
    await Score.create({ teamId: testTeam._id });
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  await t.test('1. Admin question creation automatically generates a unique QR code on the backend and stores it in MongoDB', async () => {
    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        title: 'Cipher Transmission Alpha',
        prompt: 'Decode the secret message to capture your flag.',
        levelNumber: 1,
        category: 'CRYPTOGRAPHY',
        difficulty: 'EASY',
        points: 100,
        flag: 'HTG{cipher_alpha_secret_flag}',
        status: 'Published'
      },
      user: { userId: adminUser._id, role: 'ADMIN' }
    };

    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { responseData = data; return this; }
    };

    await adminController.createQuestion(req, res, () => {});

    assert.equal(statusCode, 201);
    assert.equal(responseData.success, true);
    assert.ok(responseData.data.question);
    assert.ok(responseData.data.qrCodeDataUrl, 'Should return generated QR code data URL');
    assert.ok(responseData.data.qrScanUrl, 'Should return canonical QR scan URL');
    assert.ok(responseData.data.qrToken, 'Should return signed HMAC token');

    const created = await Question.findById(responseData.data.question._id).select('+flag');
    assert.ok(created, 'Question must be persisted in MongoDB');
    assert.ok(created.qrCodeDataUrl.startsWith('data:image/png;base64,'), 'QR code must be a valid PNG data URL');
    assert.ok(created.qrScanUrl.includes('/checkpoint/scan?code=HTG-CP01'), 'QR URL must include checkpoint code');
    assert.ok(created.qrScanUrl.includes(`qid=${created._id}`), 'QR URL must associate the question ID');
    assert.equal(created.checkpointCode, 'HTG-CP01', 'Must associate with level checkpoint code');

    // Security check: Flag/answer must NEVER be contained in the QR code or scan URL
    assert.equal(created.qrScanUrl.includes('HTG{cipher_alpha_secret_flag}'), false, 'Scan URL must NEVER contain flag');
    assert.equal(created.qrToken.includes('HTG{cipher_alpha_secret_flag}'), false, 'QR token must NEVER contain flag');
  });

  await t.test('2. Admin bulk question upload automatically generates unique QR codes for all imported questions', async () => {
    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        questions: [
          {
            title: 'Bulk Question A',
            prompt: 'Analyze the network traffic dump.',
            flag: 'HTG{bulk_flag_a}',
            levelNumber: 1,
            points: 100,
            category: 'Networking',
            difficulty: 'EASY'
          },
          {
            title: 'Bulk Question B',
            prompt: 'Extract the hidden stego image.',
            flag: 'HTG{bulk_flag_b}',
            levelNumber: 1,
            points: 100,
            category: 'Forensics',
            difficulty: 'EASY'
          }
        ]
      },
      user: { userId: adminUser._id, role: 'ADMIN' }
    };

    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { responseData = data; return this; }
    };

    await adminController.uploadQuestions(req, res, (err) => { if (err) console.error('Upload next err:', err); });
    if (statusCode !== 201) console.error('Upload failed with status', statusCode, responseData);

    assert.equal(statusCode, 201);
    assert.equal(responseData.success, true);
    assert.equal(responseData.data.createdCount, 2);
    assert.equal(responseData.data.questions.length, 2);

    for (const q of responseData.data.questions) {
      assert.ok(q.qrCodeDataUrl.startsWith('data:image/png;base64,'), 'Each bulk question must have a QR code');
      assert.ok(q.qrScanUrl.includes(`qid=${q._id}`), 'Each bulk question QR URL must associate its question ID');
      assert.equal(q.checkpointCode, 'HTG-CP01');
    }
  });

  await t.test('3. Admin checkpoint creation automatically generates unique QR code on the backend', async () => {
    // Create Challenge Level 2
    const ch2 = await Challenge.create({
      levelNumber: 2,
      title: 'Hidden in Plain Sight',
      description: 'Overview description for level 2 challenge',
      category: 'OSINT',
      points: 150,
      requiresCheckpointScan: true,
      status: 'Published',
      isActive: true
    });

    let responseData = null;
    let statusCode = null;

    const req = {
      body: {
        name: 'Central Lawn Station',
        code: 'HTG-CP02',
        levelNumber: 2,
        locationDescription: 'Tulas Central Quad Lawn',
        status: 'Active',
        mode: 'Public QR'
      },
      user: { userId: adminUser._id, role: 'ADMIN' }
    };

    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { responseData = data; return this; }
    };

    await adminController.createCheckpoint(req, res, () => {});

    assert.equal(statusCode, 201);
    assert.equal(responseData.success, true);
    assert.ok(responseData.data.checkpoint.qrCodeDataUrl, 'Checkpoint must have qrCodeDataUrl');
    assert.ok(responseData.data.checkpoint.qrScanUrl, 'Checkpoint must have qrScanUrl');
    assert.ok(responseData.data.token, 'Checkpoint must have signed token');

    const saved = await Checkpoint.findOne({ checkpointCode: 'HTG-CP02' });
    assert.ok(saved.qrCodeDataUrl.startsWith('data:image/png;base64,'));
    assert.ok(saved.qrScanUrl.includes('/checkpoint/scan?code=HTG-CP02'));
  });

  await t.test('4. Question and Checkpoint QR inspection and download endpoints return valid QR payloads', async () => {
    const question = await Question.findOne({ title: 'Cipher Transmission Alpha' });
    assert.ok(question);

    // Test GET /questions/:id/qr
    let qrResponse = null;
    const inspectRes = {
      status(code) { return this; },
      json(d) { qrResponse = d; return this; }
    };
    await adminController.getQuestionQr(
      { params: { questionId: String(question._id) } },
      inspectRes,
      () => {}
    );
    assert.equal(qrResponse.success, true);
    assert.equal(String(qrResponse.data.questionId), String(question._id));
    assert.ok(qrResponse.data.qrCodeDataUrl);

    // Test GET /questions/:id/qr/download
    let downloadedBuffer = null;
    let contentType = null;
    let contentDisposition = null;

    const downloadRes = {
      setHeader(name, val) {
        if (name.toLowerCase() === 'content-type') contentType = val;
        if (name.toLowerCase() === 'content-disposition') contentDisposition = val;
      },
      send(buf) { downloadedBuffer = buf; return this; }
    };

    await adminController.downloadQuestionQr(
      { params: { questionId: String(question._id) } },
      downloadRes,
      () => {}
    );

    assert.equal(contentType, 'image/png');
    assert.ok(contentDisposition.includes('attachment; filename="HTG-Question-L1-'));
    assert.ok(Buffer.isBuffer(downloadedBuffer));
    assert.ok(downloadedBuffer.length > 500, 'Downloaded image must be a valid PNG binary');
  });

  await t.test('5. Participant scanning QR code verifies token, unlocks level, and awards 0 points on scan', async () => {
    const question = await Question.findOne({ title: 'Cipher Transmission Alpha' });
    const cp = await Checkpoint.findOne({ checkpointCode: 'HTG-CP01' });

    let scanResponse = null;
    const req = {
      body: {
        code: 'HTG-CP01',
        token: question.qrToken,
        questionId: String(question._id)
      },
      user: {
        userId: participantUser._id,
        teamId: testTeam._id
      }
    };

    const res = {
      status(code) { return this; },
      json(data) { scanResponse = data; return this; }
    };

    await checkpointController.scanCheckpoint(req, res, () => {});
    if (!scanResponse?.success) console.error('Scan failed:', scanResponse);

    assert.equal(scanResponse.success, true);
    assert.equal(scanResponse.data.alreadyScanned, false);
    assert.equal(scanResponse.data.teamChallenge.status, 'UNLOCKED');
    assert.equal(scanResponse.data.teamChallenge.checkpointScanned, true);

    // Verify team score is still 0 (scanning verifies physical checkpoint presence, does NOT award points)
    const teamRecord = await Team.findById(testTeam._id);
    assert.equal(teamRecord.totalScore, 0, 'Scanning alone must award 0 points');
  });

  await t.test('6. Duplicate QR scan is idempotent, returns alreadyScanned: true, and cannot award duplicate points', async () => {
    const question = await Question.findOne({ title: 'Cipher Transmission Alpha' });

    let scanResponse = null;
    const req = {
      body: {
        code: 'HTG-CP01',
        token: question.qrToken,
        questionId: String(question._id)
      },
      user: {
        userId: participantUser._id,
        teamId: testTeam._id
      }
    };

    const res = {
      status(code) { return this; },
      json(data) { scanResponse = data; return this; }
    };

    await checkpointController.scanCheckpoint(req, res, () => {});

    assert.equal(scanResponse.success, true);
    assert.equal(scanResponse.data.alreadyScanned, true, 'Subsequent scans must report alreadyScanned: true');

    const teamRecord = await Team.findById(testTeam._id);
    assert.equal(teamRecord.totalScore, 0, 'Duplicate scan must NOT award points');
  });

  await t.test('7. Flag submission awards points once; duplicate submission cannot award points repeatedly', async () => {
    // 1. Submit correct flag
    let submitResponse = null;
    let submitStatus = null;

    const req1 = {
      body: {
        levelNumber: 1,
        flag: 'HTG{cipher_alpha_secret_flag}'
      },
      user: {
        userId: participantUser._id,
        teamId: testTeam._id
      },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'test-runner' }
    };

    const res1 = {
      status(code) { submitStatus = code; return this; },
      json(data) { submitResponse = data; return this; }
    };

    await submissionController.submitFlag(req1, res1);

    assert.equal(submitResponse.success, true);
    assert.equal(submitResponse.data.pointsAwarded, 100);
    assert.equal(submitResponse.data.newTotalScore, 100);
    assert.equal(submitResponse.data.isLevelComplete, true);
    assert.equal(submitResponse.data.nextLevel, 2);

    const teamAfterSolve = await Team.findById(testTeam._id);
    assert.equal(teamAfterSolve.totalScore, 100);
    assert.equal(teamAfterSolve.currentLevel, 2);

    // 2. Duplicate submission for solved level must be strictly rejected
    let dupResponse = null;
    let dupStatus = null;

    const req2 = {
      body: {
        levelNumber: 1,
        flag: 'HTG{cipher_alpha_secret_flag}'
      },
      user: {
        userId: participantUser._id,
        teamId: testTeam._id
      },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'test-runner' }
    };

    const res2 = {
      status(code) { dupStatus = code; return this; },
      json(data) { dupResponse = data; return this; }
    };

    await submissionController.submitFlag(req2, res2);

    assert.equal(dupResponse.success, false);
    assert.ok(dupResponse.message.includes('locked or already solved') || dupResponse.message.includes('already been solved'));

    const teamAfterDup = await Team.findById(testTeam._id);
    assert.equal(teamAfterDup.totalScore, 100, 'Score must remain 100 after duplicate submission attempt');
  });
});

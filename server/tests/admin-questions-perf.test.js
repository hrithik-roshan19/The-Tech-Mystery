const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');

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

const adminController = require('../src/controllers/admin.controller');
const { Question, Team, TeamChallenge, Checkpoint, Challenge, User } = require('../src/models');
const { MongoMemoryServer } = require('mongodb-memory-server');

test('Admin Questions Management - Batched assignments and projection optimization', async (t) => {
  let mongod;
  let server;
  let base;

  t.before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    const app = express();
    app.use(express.json());
    // Attach mock admin user for authorization
    app.use((req, res, next) => {
      req.user = { id: 'admin1', role: 'ADMIN' };
      next();
    });
    app.get('/api/v1/admin/questions', adminController.getQuestions);

    server = app.listen(0);
    const port = server.address().port;
    base = `http://127.0.0.1:${port}/api/v1/admin`;

    // Seed test fixtures: 1 Challenge, 1 Checkpoint, 5 Questions, 1 Team, 2 TeamChallenges
    const challenge1 = await Challenge.create({
      levelNumber: 1,
      title: 'Starting Point',
      category: 'CRYPTOGRAPHY',
      difficulty: 'EASY',
      description: 'First level cryptographic puzzle',
      points: 100,
      status: 'Published',
      isActive: true
    });

    const challenge2 = await Challenge.create({
      levelNumber: 2,
      title: 'Hidden in Plain Sight',
      category: 'LOGICAL_REASONING',
      difficulty: 'MEDIUM',
      description: 'Second level logical puzzle',
      points: 150,
      status: 'Published',
      isActive: true
    });

    const cp1 = await Checkpoint.create({
      checkpointCode: 'HTG-CP01',
      name: 'Checkpoint 1',
      levelNumber: 1,
      locationDescription: 'Library',
      status: 'Active',
      mode: 'Public QR',
      isActive: true
    });

    const leaderUser = await User.create({
      username: 'leader1',
      email: 'leader1@example.test',
      fullName: 'Alpha Leader',
      passwordHash: 'dummyhash',
      role: 'TEAM_LEADER'
    });

    const team1 = await Team.create({
      name: 'Alpha Squad',
      teamCode: 'ALPHA1',
      joinCode: 'JOIN12',
      leaderId: leaderUser._id,
      currentLevel: 1,
      totalScore: 100
    });

    const questions = [];
    for (let i = 1; i <= 3; i++) {
      questions.push(await Question.create({
        challengeId: challenge1._id,
        levelNumber: 1,
        order: i,
        checkpointId: cp1._id,
        title: `L1 Question ${i}`,
        prompt: `Decrypt code ${i}`,
        category: 'CRYPTOGRAPHY',
        difficulty: 'EASY',
        points: 100,
        flag: `HTG{flag_l1_q${i}}`,
        checkpointCode: 'HTG-CP01',
        qrScanUrl: `https://test.local/scan?q=${i}`,
        qrToken: `token-${i}`,
        qrCodeDataUrl: `data:image/png;base64,mockqr${i}`,
        isActive: true
      }));
    }

    for (let i = 1; i <= 2; i++) {
      questions.push(await Question.create({
        challengeId: challenge2._id,
        levelNumber: 2,
        order: i,
        title: `L2 Question ${i}`,
        prompt: `Solve logic ${i}`,
        category: 'LOGICAL_REASONING',
        difficulty: 'MEDIUM',
        points: 150,
        flag: `HTG{flag_l2_q${i}}`,
        checkpointCode: 'HTG-CP02',
        qrScanUrl: `https://test.local/scan?q2=${i}`,
        qrToken: `token2-${i}`,
        qrCodeDataUrl: `data:image/png;base64,mockqr2_${i}`,
        isActive: true
      }));
    }

    // Assign question 1 to team1
    await TeamChallenge.create({
      teamId: team1._id,
      challengeId: challenge1._id,
      levelNumber: 1,
      assignedQuestionId: questions[0]._id,
      status: 'SOLVED',
      attemptsCount: 1,
      checkpointScanned: true,
      pointsAwarded: 100,
      solvedAt: new Date()
    });
  });

  t.after(async () => {
    if (server) server.close();
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  await t.test('1. returns all questions with batched assignments and omits qrCodeDataUrl by default', async () => {
    const res = await fetch(`${base}/questions`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.questions.length, 5);

    // Verify qrCodeDataUrl is excluded by default to keep payload lightweight
    assert.equal(body.data.questions[0].qrCodeDataUrl, undefined);
    assert.equal(body.data.questions[0].qrScanUrl, 'https://test.local/scan?q=1');
    assert.equal(body.data.questions[0].checkpointCode, 'HTG-CP01');

    // Verify batched assignments correctly resolved for question 1
    const q1 = body.data.questions.find(q => q.title === 'L1 Question 1');
    assert.equal(q1.assignedCount, 1);
    assert.equal(q1.solvedCount, 1);
    assert.equal(q1.assignedTeams.length, 1);
    assert.equal(q1.assignedTeams[0].teamName, 'Alpha Squad');
    assert.equal(q1.assignedTeams[0].status, 'SOLVED');

    // Verify question 2 has 0 assignments
    const q2 = body.data.questions.find(q => q.title === 'L1 Question 2');
    assert.equal(q2.assignedCount, 0);
    assert.equal(q2.solvedCount, 0);
    assert.equal(q2.assignedTeams.length, 0);

    // Verify flags are excluded by default
    assert.equal(q1.flag, undefined);
  });

  await t.test('2. includes flags when includeFlag=true or includeAnswers=true is specified', async () => {
    const res = await fetch(`${base}/questions?includeFlag=true`);
    assert.equal(res.status, 200);
    const body = await res.json();
    const q1 = body.data.questions.find(q => q.title === 'L1 Question 1');
    assert.equal(q1.flag, 'HTG{flag_l1_q1}');

    const res2 = await fetch(`${base}/questions?includeAnswers=true`);
    const body2 = await res2.json();
    const q2 = body2.data.questions.find(q => q.title === 'L1 Question 2');
    assert.equal(q2.flag, 'HTG{flag_l1_q2}');
  });

  await t.test('3. includes qrCodeDataUrl when includeQr=true is explicitly requested', async () => {
    const res = await fetch(`${base}/questions?includeQr=true`);
    assert.equal(res.status, 200);
    const body = await res.json();
    const q1 = body.data.questions.find(q => q.title === 'L1 Question 1');
    assert.equal(q1.qrCodeDataUrl, 'data:image/png;base64,mockqr1');
  });

  await t.test('4. filters by levelNumber accurately', async () => {
    const res = await fetch(`${base}/questions?levelNumber=2`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.questions.length, 2);
    assert.ok(body.data.questions.every(q => q.levelNumber === 2));
  });
});

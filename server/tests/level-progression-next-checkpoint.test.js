const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

function findSystemMongo() {
  const defaultDir = 'C:/Program Files/MongoDB/Server';
  if (fs.existsSync(defaultDir)) {
    const versions = fs.readdirSync(defaultDir);
    for (const v of versions) {
      const p = path.join(defaultDir, v, 'bin', 'mongod.exe');
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

const sysMongo = findSystemMongo();
if (sysMongo) {
  process.env.MONGOMS_SYSTEM_BINARY = sysMongo;
}

const { Team, User, Challenge, Question, TeamChallenge, Checkpoint, EventConfig, Score } = require('../src/models');
const { generateCheckpointToken } = require('../src/utils/crypto');
const scoring = require('../src/services/scoring.service');
const checkpointService = require('../src/services/checkpoint.service');
const challengeController = require('../src/controllers/challenge.controller');

describe('Level Progression, Next Checkpoint Location & Multi-Question Flow Test Suite', () => {
  let mongod;
  let leader;
  let team;
  let challenge1, challenge2, challenge3, challenge4;
  let cp1, cp2, cp3, cp4;
  let q1_1, q1_2, q1_3;
  let q2_1;
  let q3_1;
  let tok1, tok2, tok3, tok4;

  before(async () => {
    mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(mongod.getUri());

    await EventConfig.create({
      eventName: 'THE TECH MYSTERY 2026',
      state: 'LIVE',
      registrationOpen: true,
      maintenanceMode: false
    });

    leader = await User.create({
      username: 'leader_progress',
      email: 'leader_progress@tulas.edu.in',
      fullName: 'Progress Leader',
      passwordHash: '$2a$10$dummyHashForTestingPurposesOnly1234567890123456789012',
      role: 'TEAM_LEADER'
    });

    const member = await User.create({
      username: 'member_progress',
      email: 'member_progress@tulas.edu.in',
      fullName: 'Progress Member',
      passwordHash: '$2a$10$dummyHashForTestingPurposesOnly1234567890123456789012',
      role: 'TEAM_MEMBER'
    });

    team = await Team.create({
      name: 'AlphaProgression',
      leaderId: leader._id,
      members: [leader._id, member._id],
      joinCode: 'PROG01',
      currentLevel: 1,
      totalScore: 0,
      status: 'Active'
    });
    leader.teamId = team._id;
    member.teamId = team._id;
    await leader.save();
    await member.save();
    await Score.create({ teamId: team._id, currentScore: 0 });

    tok1 = generateCheckpointToken('HTG-CP01', 1);
    tok2 = generateCheckpointToken('HTG-CP02', 2);
    tok3 = generateCheckpointToken('HTG-CP03', 3);
    tok4 = generateCheckpointToken('HTG-CP04', 4);

    challenge1 = await Challenge.create({
      levelNumber: 1,
      title: 'Level 1: Orientation',
      description: 'First stage challenges',
      category: 'Cryptography',
      difficulty: 'EASY',
      points: 100,
      status: 'Published',
      isActive: true,
      requiresCheckpointScan: true
    });

    challenge2 = await Challenge.create({
      levelNumber: 2,
      title: 'Level 2: Signal Intercept',
      description: 'Second stage challenges',
      category: 'Networking',
      difficulty: 'MEDIUM',
      points: 200,
      status: 'Published',
      isActive: true,
      requiresCheckpointScan: true
    });

    challenge3 = await Challenge.create({
      levelNumber: 3,
      title: 'Level 3: Cryptography',
      description: 'Third stage challenges',
      category: 'Cryptography',
      difficulty: 'MEDIUM',
      points: 300,
      status: 'Published',
      isActive: true,
      requiresCheckpointScan: true
    });

    challenge4 = await Challenge.create({
      levelNumber: 4,
      title: 'Level 4: Forensics',
      description: 'Fourth stage challenges without configured location',
      category: 'Forensics',
      difficulty: 'HARD',
      points: 400,
      status: 'Published',
      isActive: true,
      requiresCheckpointScan: true
    });

    // Checkpoints:
    // CP1 -> Points to Level 2 at 'Idea Lab - Innovation Hub'
    cp1 = await Checkpoint.create({
      levelNumber: 1,
      checkpointCode: 'HTG-CP01',
      name: 'Orientation Beacon',
      locationDescription: 'Campus Main Entrance',
      nextLocationName: 'Idea Lab - Innovation Hub',
      locationInstructions: 'Walk past the quad to the 2nd floor, Room 204.',
      associatedChallengeId: challenge1._id,
      qrToken: tok1,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });

    cp2 = await Checkpoint.create({
      levelNumber: 2,
      checkpointCode: 'HTG-CP02',
      name: 'Idea Lab Station',
      locationDescription: 'Idea Lab - Innovation Hub',
      nextLocationName: 'Central Library Archives',
      locationInstructions: 'Head to the basement archives.',
      associatedChallengeId: challenge2._id,
      qrToken: tok2,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });

    cp3 = await Checkpoint.create({
      levelNumber: 3,
      checkpointCode: 'HTG-CP03',
      name: 'Library Station',
      locationDescription: 'Central Library Archives',
      associatedChallengeId: challenge3._id,
      qrToken: tok3,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });

    // CP4 initial locationDescription configured, then cleared in Test 8 to verify null honesty
    cp4 = await Checkpoint.create({
      levelNumber: 4,
      checkpointCode: 'HTG-CP04',
      name: 'Engineering Station',
      locationDescription: 'Engineering Lab 4',
      associatedChallengeId: challenge4._id,
      qrToken: tok4,
      status: 'Active',
      isActive: true,
      mode: 'Public QR'
    });

    // Level 1: 3 sequential questions
    q1_1 = await Question.create({
      challengeId: challenge1._id,
      levelNumber: 1,
      order: 1,
      title: 'Level 1 - Question 1: Number Sequence',
      prompt: 'What is 16 * 2?',
      flag: '32',
      points: 100,
      category: 'Cryptography',
      difficulty: 'EASY',
      status: 'Published',
      isActive: true
    });

    q1_2 = await Question.create({
      challengeId: challenge1._id,
      levelNumber: 1,
      order: 2,
      title: 'Level 1 - Question 2: Web Port',
      prompt: 'Standard HTTPS port?',
      flag: '443',
      points: 100,
      category: 'Cryptography',
      difficulty: 'EASY',
      status: 'Published',
      isActive: true
    });

    q1_3 = await Question.create({
      challengeId: challenge1._id,
      levelNumber: 1,
      order: 3,
      title: 'Level 1 - Question 3: Binary',
      prompt: '5 in binary?',
      flag: '101',
      points: 100,
      category: 'Cryptography',
      difficulty: 'EASY',
      status: 'Published',
      isActive: true
    });

    // Level 2: 1 question
    q2_1 = await Question.create({
      challengeId: challenge2._id,
      levelNumber: 2,
      order: 1,
      title: 'Level 2 - Question 1: HTML Tag',
      prompt: 'Hyperlink tag?',
      flag: '<a>',
      points: 200,
      category: 'Cryptography',
      difficulty: 'MEDIUM',
      status: 'Published',
      isActive: true
    });

    // Level 3: 1 question
    q3_1 = await Question.create({
      challengeId: challenge3._id,
      levelNumber: 3,
      order: 1,
      title: 'Level 3 - Question 1: Caesar',
      prompt: 'Shift A by 3',
      flag: 'D',
      points: 300,
      category: 'Cryptography',
      difficulty: 'MEDIUM',
      status: 'Published',
      isActive: true
    });
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  test('1. Initial scan unlocks Level 1 and assigns Question 1 of 3 without level advance', async () => {
    const scanRes = await checkpointService.processScan({
      checkpointCode: 'HTG-CP01',
      token: tok1,
      teamId: team._id,
      userId: leader._id
    });

    assert.equal(scanRes.checkpoint.code, 'HTG-CP01');
    assert.equal(scanRes.sequenceNumber, 1);
    assert.equal(scanRes.totalQuestions, 3);
    assert.equal(scanRes.solvedCount, 0);
    assert.equal(scanRes.isLevelComplete, false);
    assert.equal(scanRes.nextCheckpoint || null, null);
    assert.equal(scanRes.question._id.toString(), q1_1._id.toString());

    const t = await Team.findById(team._id);
    assert.equal(t.currentLevel, 1);
    assert.equal(t.totalScore, 0);
  });

  test('2. Solving Question 1 in multi-question level advances to Question 2, awards points, but does NOT advance level or unlock checkpoint', async () => {
    const submitRes = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 1,
      flag: '32',
      questionId: q1_1._id
    });

    assert.equal(submitRes.isCorrect, true);
    assert.equal(submitRes.pointsAwarded, 100);
    assert.equal(submitRes.isLevelComplete, false);
    assert.equal(submitRes.sequenceNumber, 2);
    assert.equal(submitRes.solvedQuestionsCount, 1);
    assert.equal(submitRes.totalQuestionsInLevel, 3);
    assert.equal(submitRes.nextQuestion._id.toString(), q1_2._id.toString());
    assert.equal(submitRes.nextCheckpoint, null);
    assert.equal(submitRes.nextLocationName, null);

    const t = await Team.findById(team._id);
    assert.equal(t.currentLevel, 1); // Stays on Level 1
    assert.equal(t.totalScore, 100);
  });

  test('3. Submitting Question 2 advances to Question 3, and re-submitting an already solved question is rejected', async () => {
    const submitRes = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 1,
      flag: '443',
      questionId: q1_2._id
    });

    assert.equal(submitRes.isCorrect, true);
    assert.equal(submitRes.pointsAwarded, 100);
    assert.equal(submitRes.isLevelComplete, false);
    assert.equal(submitRes.sequenceNumber, 3);
    assert.equal(submitRes.solvedQuestionsCount, 2);
    assert.equal(submitRes.nextQuestion._id.toString(), q1_3._id.toString());

    // Re-submitting for already solved question is rejected
    await assert.rejects(
      async () => {
        await scoring.submit({
          teamId: team._id,
          userId: leader._id,
          levelNumber: 1,
          flag: '32',
          questionId: q1_1._id
        });
      },
      /does not match your team current assigned question/
    );

    const t = await Team.findById(team._id);
    assert.equal(t.currentLevel, 1); // Still on Level 1
    assert.equal(t.totalScore, 200); // 100 + 100 = 200
  });

  test('4. Answering Question 3 completes Level 1, advances team to Level 2, and unlocks next checkpoint with structured data', async () => {
    const submitRes = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 1,
      flag: '101',
      questionId: q1_3._id
    });

    assert.equal(submitRes.isCorrect, true);
    assert.equal(submitRes.pointsAwarded, 100);
    assert.equal(submitRes.isLevelComplete, true);
    assert.equal(submitRes.levelCleared, 1);
    assert.equal(submitRes.nextLevel, 2);
    assert.equal(submitRes.nextQuestion, null);

    // Verify structured nextCheckpoint
    assert.ok(submitRes.nextCheckpoint);
    assert.equal(submitRes.nextCheckpoint.code, 'HTG-CP02');
    assert.equal(submitRes.nextCheckpoint.name, 'Idea Lab - Innovation Hub');
    assert.equal(submitRes.nextCheckpoint.levelNumber, 2);
    assert.equal(submitRes.nextCheckpoint.status, 'Unlocked');
    assert.equal(submitRes.nextCheckpoint.locationDescription, 'Idea Lab - Innovation Hub');
    assert.equal(submitRes.nextCheckpoint.instructions, 'Walk past the quad to the 2nd floor, Room 204.');

    const t = await Team.findById(team._id);
    assert.equal(t.currentLevel, 2);
    assert.equal(t.totalScore, 300);
  });

  test('5. Cannot submit for Level 1 after Level 1 is solved (fails closed)', async () => {
    await assert.rejects(
      async () => {
        await scoring.submit({
          teamId: team._id,
          userId: leader._id,
          levelNumber: 1,
          flag: '101',
          questionId: q1_3._id
        });
      },
      (err) => {
        assert.match(err.message, /locked or already solved/i);
        return true;
      }
    );
  });

  test('6. Attempting to scan Checkpoint 3 while on Level 2 fails closed because checkpoint is locked', async () => {
    await assert.rejects(
      async () => {
        await checkpointService.processScan({
          checkpointCode: 'HTG-CP03',
          token: tok3,
          teamId: team._id,
          userId: leader._id
        });
      },
      (err) => {
        assert.match(err.message, /locked|prior levels/i);
        return true;
      }
    );
  });

  test('7. Scanning unlocked Checkpoint 2 activates Level 2 and mounts Question 1 of Level 2', async () => {
    const scanRes = await checkpointService.processScan({
      checkpointCode: 'HTG-CP02',
      token: tok2,
      teamId: team._id,
      userId: leader._id
    });

    assert.equal(scanRes.checkpoint.code, 'HTG-CP02');
    assert.equal(scanRes.sequenceNumber, 1);
    assert.equal(scanRes.totalQuestions, 1);
    assert.equal(scanRes.solvedCount, 0);
    assert.equal(scanRes.isLevelComplete, false);
    assert.equal(scanRes.question._id.toString(), q2_1._id.toString());
  });

  test('8. Completing Level 3 when Level 4 has unconfigured location honestly returns null (never fabricated string)', async () => {
    // Advance to Level 3
    const solve2 = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 2,
      flag: '<a>',
      questionId: q2_1._id
    });
    assert.equal(solve2.isLevelComplete, true);

    // Scan CP3
    await checkpointService.processScan({
      checkpointCode: 'HTG-CP03',
      token: tok3,
      teamId: team._id,
      userId: leader._id
    });

    // Clear locationDescription and name on Level 4 checkpoint to simulate unconfigured station
    await Checkpoint.updateOne({ levelNumber: 4 }, { $set: { locationDescription: '', name: '' } });

    // Solve Level 3
    const solve3 = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 3,
      flag: 'D',
      questionId: q3_1._id
    });

    assert.equal(solve3.isLevelComplete, true);
    assert.equal(solve3.nextLevel, 4);

    // Next checkpoint has no locationDescription and CP3 had no nextLocationName
    // Must honestly report null, NOT 'Next Station Venue' or fabricated string!
    assert.ok(solve3.nextCheckpoint);
    assert.equal(solve3.nextCheckpoint.code, 'HTG-CP04');
    assert.equal(solve3.nextCheckpoint.levelNumber, 4);
    assert.equal(solve3.nextCheckpoint.locationDescription, null);
    assert.notEqual(solve3.nextCheckpoint.locationDescription, 'Next Station Venue');
  });
});

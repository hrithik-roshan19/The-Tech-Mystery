const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

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

const { Challenge, Checkpoint, Question, Team, TeamChallenge, Score, User, EventConfig } = require('../src/models');
const { seed30Questions, QUESTIONS_DATA } = require('../scripts/seed-30-questions');
const { verifyAnswer } = require('../src/services/scoring.service');
const { participantQuestion, safeContent } = require('../src/utils/participantData');
const assignment = require('../src/services/questionAssignment.service');
const scoring = require('../src/services/scoring.service');

describe('30 Questions (3 Levels x 10 Questions) Sequential System Test Suite', () => {
  let replica;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    const uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.disconnect();
    await mongoose.connect(uri);

    // Initialize EventConfig
    await EventConfig.create({
      eventName: 'The Tech Mystery',
      state: 'LIVE',
      totalLevels: 10,
      registrationOpen: true
    });

    // Create Checkpoints HTG-CP01, HTG-CP02, HTG-CP03
    for (let lvl = 1; lvl <= 3; lvl++) {
      await Checkpoint.create({
        levelNumber: lvl,
        name: `Station ${lvl}`,
        locationDescription: `Auditorium Sector ${lvl}`,
        checkpointCode: `HTG-CP0${lvl}`,
        mode: 'Public QR',
        status: 'Active',
        isActive: true
      });
    }

    // Run seed-30-questions script
    await seed30Questions();
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  test('1. Exactly 10 questions exist per level, 30 total across Levels 1-3', async () => {
    const l1Count = await Question.countDocuments({ levelNumber: 1 });
    const l2Count = await Question.countDocuments({ levelNumber: 2 });
    const l3Count = await Question.countDocuments({ levelNumber: 3 });
    const totalCount = await Question.countDocuments({ levelNumber: { $in: [1, 2, 3] } });

    assert.equal(l1Count, 10, 'Level 1 must have exactly 10 questions');
    assert.equal(l2Count, 10, 'Level 2 must have exactly 10 questions');
    assert.equal(l3Count, 10, 'Level 3 must have exactly 10 questions');
    assert.equal(totalCount, 30, 'Total questions across Levels 1-3 must be 30');
  });

  test('2. Each question has order 1..10, Multiple Choice with 4 options, and 100 points', async () => {
    const questions = await Question.find({ levelNumber: { $in: [1, 2, 3] } })
      .sort({ levelNumber: 1, order: 1 })
      .select('+flag');

    for (const q of questions) {
      assert.ok(q.order >= 1 && q.order <= 10, `Order must be 1..10, got ${q.order}`);
      assert.equal(q.type, 'Multiple Choice', `Type must be Multiple Choice for ${q.title}`);
      assert.equal(q.points, 100, `Points must be 100 for ${q.title}`);
      assert.equal(q.options.length, 4, `Must have exactly 4 options for ${q.title}`);
      assert.ok(q.flag, `Flag must be non-empty for ${q.title}`);
      assert.equal(q.isCaseSensitive, false, `isCaseSensitive must be false for ${q.title}`);

      // Exactly one option matches flag
      const matches = q.options.filter(opt => opt.trim().toLowerCase() === q.flag.trim().toLowerCase());
      assert.equal(matches.length, 1, `Exactly one option must match flag for ${q.title}`);
    }
  });

  test('3. verifyAnswer validates correct answers case-insensitively and via option letter', async () => {
    const questions = await Question.find({ levelNumber: { $in: [1, 2, 3] } })
      .sort({ levelNumber: 1, order: 1 })
      .select('+flag');

    for (const q of questions) {
      // 1. Direct answer text
      assert.ok(verifyAnswer(q.flag, q), `verifyAnswer must accept correct flag "${q.flag}"`);
      // 2. Uppercase / lowercase variation
      assert.ok(verifyAnswer(q.flag.toUpperCase(), q), `verifyAnswer must accept uppercase variation`);
      assert.ok(verifyAnswer(q.flag.toLowerCase(), q), `verifyAnswer must accept lowercase variation`);
      // 3. Option letter (A, B, C, D)
      const correctIdx = q.options.findIndex(opt => opt.trim().toLowerCase() === q.flag.trim().toLowerCase());
      const letter = String.fromCharCode(65 + correctIdx);
      assert.ok(verifyAnswer(letter, q), `verifyAnswer must accept option letter "${letter}" for ${q.title}`);
      assert.ok(verifyAnswer(letter.toLowerCase(), q), `verifyAnswer must accept lowercase option letter "${letter.toLowerCase()}"`);

      // 4. Incorrect answer rejected
      assert.ok(!verifyAnswer('WRONG_ANSWER_999', q), 'verifyAnswer must reject incorrect answer');
    }
  });

  test('4. Participant DTO strictly sanitizes flag and does NOT withhold valid contest questions', async () => {
    const questions = await Question.find({ levelNumber: { $in: [1, 2, 3] } });

    for (const q of questions) {
      const dto = await participantQuestion(q);
      assert.equal(dto.flag, undefined, 'Participant DTO must never include flag');
      assert.notEqual(dto.prompt, 'Content withheld pending organizer review.', `Prompt must not be withheld for ${q.title}`);
      assert.notEqual(dto.title, 'Content withheld pending organizer review.', `Title must not be withheld for ${q.title}`);
      assert.equal(dto.options.length, 4, 'Participant DTO must preserve 4 options');
    }
  });

  test('5. Single question solve progression: solving assigned question completes Level 1 and advances to Level 2', async () => {
    // Create leader, member, and team
    const leader = await User.create({
      username: 'leader_30q',
      email: 'leader30q@tulas.edu.in',
      fullName: 'Leader 30Q',
      passwordHash: 'dummy_hash_for_test_123',
      role: 'TEAM_LEADER'
    });
    const member2 = await User.create({
      username: 'member2_30q',
      email: 'member2_30q@tulas.edu.in',
      fullName: 'Member 2',
      passwordHash: 'dummy_hash_for_test_123',
      role: 'TEAM_MEMBER'
    });
    const team = await Team.create({
      name: 'CyberSquad 30Q',
      leaderId: leader._id,
      members: [leader._id, member2._id],
      joinCode: 'CODE30Q',
      currentLevel: 1,
      totalScore: 0,
      status: 'Active'
    });
    leader.teamId = team._id;
    member2.teamId = team._id;
    await leader.save();
    await member2.save();
    await Score.create({ teamId: team._id, currentScore: 0 });

    const l1Questions = await Question.find({ levelNumber: 1 })
      .sort({ order: 1 })
      .select('+flag');

    // Initial assignment: assigns 1 question from Level 1 question bank
    const p1 = await assignment.getOrAssignQuestion(team._id, 1);
    assert.equal(p1.sequenceNumber, 1, 'Initial question must be sequence 1');
    assert.ok(p1.question, 'Must assign a valid question from the pool');
    assert.equal(p1.totalQuestions, 1, 'Total assigned questions for team in Level 1 is 1');

    const assignedDoc = l1Questions.find(q => String(q._id) === String(p1.question._id));
    assert.ok(assignedDoc, 'Assigned question must exist in Level 1 question bank');

    // Solve assigned question
    const res = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 1,
      flag: assignedDoc.flag,
      questionId: assignedDoc._id
    });

    assert.equal(res.isCorrect, true, 'Submission for assigned question must be correct');
    assert.equal(res.isLevelComplete, true, 'One correct answer completes Level 1 immediately');
    assert.ok(res.nextCheckpointLocation, 'Must return nextCheckpointLocation after completing Level 1');

    // Verify team score and level advancement
    const updatedTeam = await Team.findById(team._id);
    assert.equal(updatedTeam.currentLevel, 2, 'Team must advance to Level 2 after completing Level 1');
    assert.equal(updatedTeam.totalScore, 100, 'Team must receive 100 points for completing Level 1');
  });
});

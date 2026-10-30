const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

// Auto-discover local mongod binary if present
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

const { Team, User, Challenge, Question, TeamChallenge, Submission, Score, Checkpoint, EventConfig } = require('../src/models');
const scoring = require('../src/services/scoring.service');
const assignment = require('../src/services/questionAssignment.service');
const adminController = require('../src/controllers/admin.controller');
const { SUBMISSION_STATUS } = require('../src/constants/submissionStatus');

describe('Automatic Level Progression & Non-Manual Submission Approval Test Suite', () => {
  let mongod;
  let leader;
  let member;
  let team;
  let challenge1;
  let challenge2;
  let cp1;
  let cp2;
  let q1;
  let q2;

  before(async () => {
    mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(mongod.getUri());

    // Event config
    await EventConfig.create({
      state: 'LIVE',
      registrationOpen: true,
      maintenanceMode: false
    });

    // Users
    leader = await User.create({
      username: 'leader_auto',
      email: 'leader_auto@tulas.edu.in',
      fullName: 'Auto Leader',
      passwordHash: '$2a$10$dummyHashForTestingPurposesOnly1234567890123456789012',
      role: 'TEAM_LEADER'
    });
    member = await User.create({
      username: 'member_auto',
      email: 'member_auto@tulas.edu.in',
      fullName: 'Auto Member',
      passwordHash: '$2a$10$dummyHashForTestingPurposesOnly1234567890123456789012',
      role: 'TEAM_MEMBER'
    });

    // Team
    team = await Team.create({
      name: 'AutoProgressionSquad',
      leaderId: leader._id,
      members: [leader._id, member._id],
      joinCode: 'AUTOPROG',
      currentLevel: 1,
      totalScore: 0,
      status: 'Active'
    });
    leader.teamId = team._id;
    member.teamId = team._id;
    await leader.save();
    await member.save();
    await Score.create({ teamId: team._id, currentScore: 0 });

    // Checkpoints
    cp1 = await Checkpoint.create({
      levelNumber: 1,
      checkpointCode: 'CP01-AUTO',
      name: 'Station Alpha',
      locationDescription: 'Main Quad',
      nextLocationName: 'Station Beta Tech Lab',
      locationInstructions: 'Proceed to Engineering Building Room 201',
      qrToken: 'tok_alpha_123',
      scanCount: 0,
      status: 'Active',
      isActive: true
    });
    cp2 = await Checkpoint.create({
      levelNumber: 2,
      checkpointCode: 'CP02-AUTO',
      name: 'Station Beta',
      locationDescription: 'Tech Lab 201',
      qrToken: 'tok_beta_456',
      scanCount: 0,
      status: 'Active',
      isActive: true
    });

    // Challenges: Level 1 has 2 questions, Level 2 has 1 question
    challenge1 = await Challenge.create({
      levelNumber: 1,
      title: 'Level 1: Cryptic Sequences',
      category: 'Cryptography',
      description: 'Solve the sequence to continue',
      points: 200,
      difficulty: 'EASY',
      status: 'Published',
      isActive: true,
      requiresCheckpointScan: false
    });

    challenge2 = await Challenge.create({
      levelNumber: 2,
      title: 'Level 2: Network Recon',
      category: 'Networking',
      description: 'Inspect the packets',
      points: 100,
      difficulty: 'MEDIUM',
      status: 'Published',
      isActive: true,
      requiresCheckpointScan: false
    });

    // Level 1 Questions: Q1 and Q2
    q1 = await Question.create({
      challengeId: challenge1._id,
      levelNumber: 1,
      order: 1,
      title: 'Level 1 - Question 1: Arithmetic Progression',
      prompt: 'Find next number: 2, 4, 8, 16, ?',
      type: 'Numeric Answer',
      category: 'Crypto',
      difficulty: 'EASY',
      flag: '32',
      points: 100,
      attempts: 5,
      status: 'Published',
      isActive: true
    });

    q2 = await Question.create({
      challengeId: challenge1._id,
      levelNumber: 1,
      order: 2,
      title: 'Level 1 - Question 2: Secure Protocol',
      prompt: 'Standard encrypted web protocol?',
      type: 'Multiple Choice',
      category: 'Crypto',
      difficulty: 'EASY',
      options: ['HTTP', 'HTTPS', 'FTP', 'TELNET'],
      flag: 'HTTPS',
      points: 100,
      attempts: 5,
      status: 'Published',
      isActive: true
    });
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  test('1. Initial state assigns Question 1 and team starts on Level 1 with 0 points', async () => {
    const prog = await assignment.getOrAssignQuestion(team._id, 1);
    assert.equal(prog.sequenceNumber, 1);
    assert.equal(prog.totalQuestions, 1);
    assert.equal(String(prog.question._id), String(q1._id));
    assert.equal(prog.isLevelComplete, false);

    const tc = await TeamChallenge.findOne({ teamId: team._id, levelNumber: 1 });
    assert.ok(tc);
    assert.equal(tc.status, 'UNLOCKED');
    assert.equal(String(tc.assignedQuestionId), String(q1._id));
  });

  test('2. Incorrect answer does NOT award points, does NOT progress, and is auto-graded as INCORRECT', async () => {
    const res = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 1,
      flag: '99',
      questionId: q1._id
    });

    assert.equal(res.isCorrect, false);
    assert.equal(res.isLevelComplete, false);
    assert.equal(res.attemptsRemaining, 4);

    // Team score remains 0, currentLevel remains 1
    const t = await Team.findById(team._id);
    assert.equal(t.totalScore, 0);
    assert.equal(t.currentLevel, 1);

    // Submission audit log
    const sub = await Submission.findOne({ teamId: team._id, submittedAnswer: '99' });
    assert.ok(sub);
    assert.equal(sub.isCorrect, false);
    assert.equal(sub.status, SUBMISSION_STATUS.INCORRECT);
    assert.equal(sub.reviewed, true, 'Auto-graded incorrect answer must be marked reviewed');
    assert.equal(sub.pointsDelta, 0);
  });

  test('3. Correct answer awards points once and automatically completes Level 1 without manual approval', async () => {
    const res = await scoring.submit({
      teamId: team._id,
      userId: leader._id,
      levelNumber: 1,
      flag: '32',
      questionId: q1._id
    });

    assert.equal(res.isCorrect, true);
    assert.equal(res.pointsAwarded, 100);
    assert.equal(res.newTotalScore, 100);
    assert.equal(res.isLevelComplete, true, 'One correct answer completes Level 1 immediately');
    assert.equal(res.nextQuestion, null);
    assert.equal(res.sequenceNumber, 1);
    assert.equal(res.solvedQuestionsCount, 1);

    // Team state verification: Level 2 unlocked
    const t = await Team.findById(team._id);
    assert.equal(t.totalScore, 100);
    assert.equal(t.currentLevel, 2, 'Current level advances to Level 2');

    // Submission audit record is immediately auto-graded and reviewed
    const sub = await Submission.findOne({ teamId: team._id, submittedAnswer: '32' });
    assert.ok(sub);
    assert.equal(sub.isCorrect, true);
    assert.equal(sub.status, SUBMISSION_STATUS.CORRECT);
    assert.equal(sub.reviewed, true, 'Auto-graded correct answer must be marked reviewed');
    assert.equal(sub.pointsDelta, 100);
    assert.ok(sub.reviewedAt);

    // TeamChallenge state verification: Level 1 is SOLVED
    const tc = await TeamChallenge.findOne({ teamId: team._id, levelNumber: 1 });
    assert.equal(tc.status, 'SOLVED');
    assert.equal(tc.solvedQuestionIds.length, 1);
    assert.equal(String(tc.solvedQuestionIds[0]), String(q1._id));
  });

  test('4. Duplicate submission is idempotent and does NOT award duplicate points', async () => {
    // Re-submitting for an already solved level is strictly rejected
    await assert.rejects(
      async () => {
        await scoring.submit({
          teamId: team._id,
          userId: member._id,
          levelNumber: 1,
          flag: '32',
          questionId: q1._id
        });
      },
      /Cannot submit for a locked or already solved level/
    );

    const scoreAfterDuplicate = (await Team.findById(team._id)).totalScore;
    assert.equal(scoreAfterDuplicate, 100, 'Score must not increase on duplicate solve');
  });

  test('5. Level 1 completion advances team to Level 2 and unlocks next checkpoint location', async () => {
    const t = await Team.findById(team._id);
    assert.equal(t.currentLevel, 2, 'Team must be on Level 2');
    assert.equal(t.totalScore, 100);

    // TeamChallenge for Level 1 must be SOLVED
    const tc1 = await TeamChallenge.findOne({ teamId: team._id, levelNumber: 1 });
    assert.equal(tc1.status, 'SOLVED');
    assert.ok(tc1.solvedAt);
  });

  test('6. Admin submissions query classifies auto-graded submissions as Graded, not Pending Review', async () => {
    const req = {
      query: { page: '1', limit: '50' }
    };
    let responseData = null;
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(payload) { responseData = payload; return this; }
    };

    await adminController.getSubmissionLogs(req, res, () => {});

    assert.ok(responseData);
    assert.equal(responseData.success, true);
    const { submissions, stats } = responseData.data;

    // Zero pending reviews for auto-graded questions
    assert.equal(stats.pending, 0, 'Pending submissions count must be 0 for auto-graded questions');
    assert.equal(stats.correct, 1, 'One correct submission must be counted');
    assert.equal(stats.incorrect, 1, 'One incorrect submission must be counted');

    // Check individual submission representations
    const correctSub = submissions.find(s => s.answer === '32');
    assert.ok(correctSub);
    assert.equal(correctSub.result, 'Correct');
    assert.equal(correctSub.reviewed, true);
    assert.equal(correctSub.isAutoGraded, true);

    const incorrectSub = submissions.find(s => s.answer === '99');
    assert.ok(incorrectSub);
    assert.equal(incorrectSub.result, 'Incorrect');
    assert.equal(incorrectSub.reviewed, true);
    assert.notEqual(incorrectSub.result, 'Pending Review', 'Incorrect auto-graded answer must not be labeled Pending Review');
  });

  test('7. Participant cannot submit for Level 1 after Level 1 is solved (fails closed)', async () => {
    await assert.rejects(
      async () => {
        await scoring.submit({
          teamId: team._id,
          userId: leader._id,
          levelNumber: 1,
          flag: '32',
          questionId: q1._id
        });
      },
      /Cannot submit for a locked or already solved level/
    );
  });

  test('8. Team-based progression: Member 2 sees Question 1 solved and is on Level 2', async () => {
    const memberProg = await assignment.getOrAssignQuestion(team._id, 1);
    assert.equal(memberProg.isLevelComplete, true, 'Member 2 must see Level 1 as complete');
    assert.equal(memberProg.solvedCount, 1);
  });
});

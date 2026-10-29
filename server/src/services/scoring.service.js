const { Team, Score, TeamChallenge, Submission, Challenge, Question, Checkpoint, SecurityLog } = require('../models');
const transaction = require('../utils/transaction');
const { eventFor, teamFor } = require('./eligibility.service');
const assignment = require('./questionAssignment.service');
const { safeFlagCompare } = require('../utils/crypto');
const { participantQuestion } = require('../utils/participantData');
const crypto = require('crypto');

/**
 * Normalizes and verifies answers across various question types:
 * - Numeric Answer: Numeric tolerance / float or integer equivalence
 * - Multiple Choice: Trimmed letter or string comparison (case-insensitive by default)
 * - Text Answer / Short Text: Trimmed string comparison respecting configured case sensitivity
 * - Flag: Secure constant-time CTF flag comparison
 */
function verifyAnswer(submitted, question) {
  if (submitted === undefined || submitted === null || !question?.flag) return false;
  const strSubmitted = String(submitted);
  if (!strSubmitted.trim()) return false;
  const expected = String(question.flag);
  const isCaseSensitive = Boolean(question.isCaseSensitive);
  const qType = String(question.type || 'Flag').trim();

  if (qType === 'Numeric Answer') {
    const numSub = Number(strSubmitted.trim());
    const numExp = Number(expected.trim());
    if (!Number.isNaN(numSub) && !Number.isNaN(numExp)) {
      if (numSub === numExp) return true;
    } else if (strSubmitted.trim() === expected.trim()) {
      return true;
    }
    // Check acceptable alternatives if defined in question metadata
    if (Array.isArray(question.metadata?.acceptableAlternatives)) {
      const s = strSubmitted.trim().toLowerCase();
      for (const alt of question.metadata.acceptableAlternatives) {
        if (typeof alt === 'string' && alt.trim() && s === alt.trim().toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  if (qType === 'Multiple Choice') {
    const s = strSubmitted.trim();
    const e = expected.trim();
    if (!isCaseSensitive) {
      if (s.toLowerCase() === e.toLowerCase()) return true;
    } else {
      if (s === e) return true;
    }
    // Also accept option letter (A, B, C, D) corresponding to the correct option index
    if (Array.isArray(question.options) && question.options.length > 0 && /^[a-dA-D]$/.test(s)) {
      const idx = s.toUpperCase().charCodeAt(0) - 65;
      const chosenOpt = question.options[idx];
      if (chosenOpt) {
        return !isCaseSensitive
          ? chosenOpt.trim().toLowerCase() === e.toLowerCase()
          : chosenOpt.trim() === e;
      }
    }
    return false;
  }

  if (qType === 'Text Answer' || qType === 'Short Text') {
    const s = strSubmitted.trim();
    const e = expected.trim();
    if (!isCaseSensitive) {
      if (s.toLowerCase() === e.toLowerCase()) return true;
    } else {
      if (s === e) return true;
    }

    // Check acceptable alternatives if defined in question metadata
    if (Array.isArray(question.metadata?.acceptableAlternatives)) {
      for (const alt of question.metadata.acceptableAlternatives) {
        if (typeof alt === 'string' && alt.trim()) {
          const match = !isCaseSensitive
            ? s.toLowerCase() === alt.trim().toLowerCase()
            : s === alt.trim();
          if (match) return true;
        }
      }
    }
    return false;
  }

  return safeFlagCompare(strSubmitted, expected, isCaseSensitive);
}

async function audit(actor, target, detail) {
  await SecurityLog.create({
    eventId: `EVT-${crypto.randomUUID()}`,
    severity: 'INFO',
    category: 'ADMIN ACTION',
    event: 'Score decision recorded',
    actor: String(actor),
    target: String(target),
    source: 'backend',
    detail,
    status: 'RECORDED'
  });
}

async function applyDecision(tc, submission, correct, points, actor) {
  const team = await Team.findById(tc.teamId);
  if (!team) throw new Error('Team not found');
  const wasSolved = tc.status === 'SOLVED';
  if (wasSolved && String(tc.scoringSubmissionId) !== String(submission._id)) {
    throw new Error('Challenge already scored through another submission; review its scoring submission instead');
  }
  if (correct && !wasSolved && team.currentLevel !== tc.levelNumber) throw new Error('Cannot advance a locked or out-of-order level');
  if (!correct && wasSolved && team.currentLevel !== tc.levelNumber + 1) {
    throw new Error('Reverse later solves first before reversing this level');
  }
  const before = wasSolved ? tc.pointsAwarded : 0;
  const after = correct ? points : 0;
  const delta = after - before;
  const solvedDelta = Number(correct) - Number(wasSolved);
  const now = new Date();

  if (correct) {
    tc.status = 'SOLVED';
    tc.scoringSubmissionId = submission._id;
    tc.solvedAt = tc.solvedAt || now;
    tc.solvedByUserId = tc.solvedByUserId || submission.userId;
    tc.pointsAwarded = after;
    if (!wasSolved) team.currentLevel = tc.levelNumber + 1;

    // Atomically mark question completed
    if (tc.assignedQuestionId) {
      await Question.updateOne(
        { _id: tc.assignedQuestionId },
        {
          $set: {
            isCompleted: true,
            completedByTeamId: team._id,
            completedAt: tc.solvedAt || now
          }
        }
      );
    }
  } else if (wasSolved) {
    tc.status = tc.checkpointScanned ? 'UNLOCKED' : 'LOCKED';
    tc.scoringSubmissionId = null;
    tc.solvedAt = null;
    tc.solvedByUserId = null;
    tc.pointsAwarded = 0;
    team.currentLevel = tc.levelNumber;

    if (tc.assignedQuestionId) {
      await Question.updateOne(
        { _id: tc.assignedQuestionId },
        {
          $set: {
            isCompleted: false,
            completedByTeamId: null,
            completedAt: null
          }
        }
      );
    }
  }

  team.totalScore += delta;
  if (team.totalScore < 0) throw new Error('Score data requires organizer reconciliation');
  await tc.save();

  const latestSolve = await TeamChallenge.findOne({ teamId: team._id, status: 'SOLVED' }).sort({ solvedAt: -1 });
  team.lastSolveTimestamp = latestSolve?.solvedAt || null;
  await team.save();

  await Score.findOneAndUpdate(
    { teamId: team._id },
    {
      $inc: { currentScore: delta, solvedLevelsCount: solvedDelta },
      $set: { lastSolveTimestamp: team.lastSolveTimestamp },
      $push: {
        history: {
          levelNumber: tc.levelNumber,
          challengeId: tc.challengeId,
          pointsAwarded: delta,
          solvedAt: now,
          submissionId: submission._id
        }
      }
    },
    { upsert: true }
  );

  submission.isCorrect = correct;
  submission.status = correct ? 'CORRECT' : 'INCORRECT';
  submission.pointsDelta = after;
  await submission.save();

  await audit(actor, tc._id, `Score delta ${delta}; solve delta ${solvedDelta}; submission ${submission._id}`);

  // Broadcast real-time leaderboard update via Server-Sent Events (SSE)
  try {
    const leaderboardController = require('../controllers/leaderboard.controller');
    leaderboardController.broadcastLeaderboardUpdate();
  } catch (broadCastErr) {
    // Non-blocking telemetry broadcast
  }

  return { netPoints: after, newTotalScore: team.totalScore, nextLevel: team.currentLevel, alreadySolved: false };
}

module.exports = {
  verifyAnswer,

  submit({ teamId, userId, levelNumber, flag, questionId, ipAddress, userAgent }) {
    return transaction(async () => {
      const config = await eventFor('submission');
      const team = await teamFor(teamId, userId, config);
      if (team.currentLevel !== levelNumber) throw new Error('Cannot submit for a locked or already solved level');
      const challenge = await Challenge.findOne({ levelNumber, isActive: true, status: 'Published' });
      if (!challenge) throw new Error('Challenge is not published or active');

      const progression = await assignment.getOrAssignQuestion(teamId, levelNumber);
      const tc = progression.teamChallenge;
      if (!tc) throw new Error('No active challenge for the current level');
      if (tc.status === 'SOLVED') throw new Error('Level has already been solved');
      if (challenge.requiresCheckpointScan && !tc.checkpointScanned) {
        throw new Error('Physical checkpoint verification required');
      }

      // If questionId is supplied, ensure it matches current assigned question
      const targetQuestionId = questionId && /^[0-9a-fA-F]{24}$/.test(String(questionId))
        ? questionId
        : tc.assignedQuestionId;

      if (tc.assignedQuestionId && String(targetQuestionId) !== String(tc.assignedQuestionId)) {
        throw new Error('Submitted question does not match your team current assigned question');
      }

      const question = await Question.findOne({
        _id: targetQuestionId,
        challengeId: challenge._id,
        isActive: true,
        status: 'Published'
      }).select('+flag');
      if (!question) throw new Error('Assigned question is not published or active');

      const claimed = await TeamChallenge.findOneAndUpdate(
        { _id: tc._id, status: { $ne: 'SOLVED' }, attemptsCount: { $lt: question.attempts } },
        { $inc: { attemptsCount: 1 } },
        { new: true }
      );
      if (!claimed) throw new Error('Maximum submission attempts reached');

      const isCorrect = verifyAnswer(flag, question);
      const submission = await Submission.create({
        teamId,
        userId,
        challengeId: challenge._id,
        teamChallengeId: tc._id,
        questionId: question._id,
        levelNumber,
        submittedAnswer: flag,
        isCorrect,
        status: isCorrect ? 'CORRECT' : 'INCORRECT',
        pointsDelta: 0,
        ipAddress,
        userAgent
      });

      const attempts = {
        attemptsCount: claimed.attemptsCount,
        attemptsRemaining: Math.max(0, question.attempts - claimed.attemptsCount),
        maxAttempts: question.attempts,
        isCorrect
      };

      if (!isCorrect) {
        return {
          ...attempts,
          message: 'Incorrect answer. Try again.',
          isLevelComplete: false,
          nextCheckpointLocation: null,
          nextLocationName: null,
          locationInstructions: null,
          nextCheckpoint: null
        };
      }

      // Answer is correct!
      const now = new Date();
      const pointsAwarded = Math.max(0, question.points - (claimed.penaltyIncurred || 0));

      const alreadySolvedThisQuestion = (claimed.solvedQuestionIds || []).some(
        (id) => String(id) === String(question._id)
      );

      if (!alreadySolvedThisQuestion) {
        if (!claimed.solvedQuestionIds) claimed.solvedQuestionIds = [];
        claimed.solvedQuestionIds.push(question._id);
        team.totalScore = (team.totalScore || 0) + pointsAwarded;
        team.lastSolveTimestamp = now;
        claimed.pointsAwarded = (claimed.pointsAwarded || 0) + pointsAwarded;
        claimed.attemptsCount = 0; // reset attempts for next question
      }

      submission.status = 'CORRECT';
      submission.pointsDelta = pointsAwarded;
      await submission.save();

      // Check remaining questions in this level
      const allLevelQuestions = await Question.find({
        challengeId: challenge._id,
        levelNumber,
        status: 'Published',
        isActive: true
      }).sort({ order: 1, createdAt: 1 });

      const solvedIds = (claimed.solvedQuestionIds || []).map((id) => String(id));
      const remainingQuestions = allLevelQuestions.filter((q) => !solvedIds.includes(String(q._id)));

      let isLevelComplete = false;
      let nextQuestion = null;
      let nextCheckpoint = null;
      let nextLocationName = null;
      let locationInstructions = null;

      if (remainingQuestions.length > 0) {
        // More questions remain in this level!
        const nextQ = remainingQuestions[0];
        claimed.assignedQuestionId = nextQ._id;
        claimed.currentSequenceNumber = allLevelQuestions.findIndex((q) => String(q._id) === String(nextQ._id)) + 1;
        await claimed.save();
        await team.save();

        // Never reveal next location before the final question is solved
        nextCheckpoint = null;
        nextLocationName = null;
        locationInstructions = null;
        nextQuestion = await participantQuestion(nextQ);
      } else {
        // All questions in this level solved! Final question conquered!
        isLevelComplete = true;
        claimed.status = 'SOLVED';
        claimed.solvedAt = now;
        claimed.scoringSubmissionId = submission._id;
        team.currentLevel = levelNumber + 1;
        await claimed.save();
        await team.save();

        if (team.currentLevel <= 10) {
          const currentCp = await Checkpoint.findOne({ levelNumber });
          nextCheckpoint = (await Checkpoint.findOne({ levelNumber: team.currentLevel, isActive: true }))
            || (await Checkpoint.findOne({ levelNumber: team.currentLevel }));

          nextLocationName = (currentCp?.nextLocationName && currentCp.nextLocationName.trim())
            || nextCheckpoint?.name
            || nextCheckpoint?.locationDescription
            || 'Next Station Venue';

          locationInstructions = (currentCp?.locationInstructions && currentCp.locationInstructions.trim())
            || nextCheckpoint?.notes
            || null;
        }
      }

      const isEventComplete = team.currentLevel > 10;

      // Update Score collection
      await Score.findOneAndUpdate(
        { teamId: team._id },
        {
          $inc: { currentScore: pointsAwarded, solvedLevelsCount: isLevelComplete ? 1 : 0 },
          $set: { lastSolveTimestamp: team.lastSolveTimestamp },
          $push: {
            history: {
              levelNumber,
              challengeId: challenge._id,
              questionId: question._id,
              pointsAwarded,
              solvedAt: now,
              submissionId: submission._id
            }
          }
        },
        { upsert: true }
      );

      await audit(userId, claimed._id, `Question solve recorded: ${question._id}; Level ${levelNumber}; Points ${pointsAwarded}`);

      // Broadcast real-time leaderboard update via Server-Sent Events (SSE)
      try {
        const leaderboardController = require('../controllers/leaderboard.controller');
        leaderboardController.broadcastLeaderboardUpdate();
      } catch (broadCastErr) {
        // Non-blocking telemetry broadcast
      }

      return {
        ...attempts,
        isCorrect: true,
        message: isLevelComplete
          ? 'Level completed! All questions conquered.'
          : 'Correct answer!',
        pointsAwarded,
        newTotalScore: team.totalScore,
        isLevelComplete,
        isEventComplete,
        levelCleared: isLevelComplete ? levelNumber : null,
        nextLevel: isLevelComplete ? team.currentLevel : levelNumber,
        nextQuestion,
        sequenceNumber: claimed.currentSequenceNumber,
        totalQuestionsInLevel: allLevelQuestions.length,
        solvedQuestionsCount: claimed.solvedQuestionIds.length,
        nextCheckpointLocation: isLevelComplete && !isEventComplete ? nextLocationName : null,
        nextLocationName: isLevelComplete && !isEventComplete ? nextLocationName : null,
        locationInstructions: isLevelComplete && !isEventComplete ? locationInstructions : null,
        nextCheckpoint: isLevelComplete && !isEventComplete && nextCheckpoint
          ? {
              name: nextLocationName,
              locationDescription: nextCheckpoint.locationDescription,
              levelNumber: nextCheckpoint.levelNumber,
              code: nextCheckpoint.checkpointCode,
              instructions: locationInstructions
            }
          : null
      };
    });
  },

  review({ submissionId, result, points, reviewNote, adminUserId }) {
    return transaction(async () => {
      const submission = await Submission.findById(submissionId);
      if (!submission) throw new Error('Submission record not found');
      if (!['Correct', 'Incorrect'].includes(result)) throw new Error('Invalid review result');
      const tc = await TeamChallenge.findById(submission.teamChallengeId);
      const challenge = await Challenge.findById(submission.challengeId);
      if (!tc || !challenge || String(tc.teamId) !== String(submission.teamId)) throw new Error('Submission associations require reconciliation');
      const max = Math.max(0, challenge.points - (tc.penaltyIncurred || 0));
      const awarded = result === 'Correct' ? (points === undefined ? max : Number(points)) : 0;
      if (!Number.isFinite(awarded) || awarded < 0 || awarded > max) throw new Error('Awarded points exceed allowed bounds');
      if (submission.reviewed && submission.isCorrect === (result === 'Correct') && submission.pointsDelta === awarded) {
        throw new Error('Submission already reviewed with this decision');
      }
      // Serialize with participant solves and other administrative reviews.
      await Team.updateOne({ _id: tc.teamId }, { $inc: { securityRevision: 1 } });
      await applyDecision(tc, submission, result === 'Correct', awarded, adminUserId);
      submission.reviewed = true;
      submission.reviewedBy = adminUserId;
      submission.reviewedAt = new Date();
      submission.reviewNote = typeof reviewNote === 'string' ? reviewNote.slice(0, 500) : '';
      await submission.save();
      return Submission.findById(submission._id).populate('teamId').populate('challengeId').populate('questionId');
    });
  },

  applyHintPenalty(teamChallengeId, penaltyPoints) {
    return transaction(() => TeamChallenge.findOneAndUpdate(
      { _id: teamChallengeId, status: { $ne: 'SOLVED' } },
      { $inc: { penaltyIncurred: penaltyPoints } },
      { new: true }
    ));
  }
};

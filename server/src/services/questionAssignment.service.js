const { participantQuestion } = require('../utils/participantData');
const { TeamChallenge, Question, Challenge, Checkpoint, EventConfig } = require('../models');
const config = require('../config/environment');
const logger = require('../utils/logger');

/**
 * Question Progression Service
 * Implements sequential challenge questions per level through a single permanent QR code.
 *
 * PROGRESSION ARCHITECTURE:
 * - Exactly ONE permanent QR code per level.
 * - Each level contains an ordered sequence of questions (Question 1 through Question N).
 * - Each team tracks its own independent question progression in TeamChallenge.
 * - Repeated scans return the team's current unsolved question (idempotent & stable).
 * - When a question is solved, the team advances to the next question in the sequence.
 * - When all questions in the level are solved, the level completes and the next level unlocks.
 */
class QuestionAssignmentService {
  /**
   * Retrieves the current sequential question for a team at a specific level.
   *
   * @param {string} teamId
   * @param {number} levelNumber
   * @returns {Promise<{ teamChallenge: object, question: object|null, sequenceNumber: number, totalQuestions: number, solvedCount: number, isLevelComplete: boolean, nextCheckpoint?: object, emptyReason?: string }>}
   */
  async getOrAssignQuestion(teamId, levelNumber) {
    const activeChallenge = await Challenge.findOneAndUpdate(
      { levelNumber, status: 'Published', isActive: true },
      { $inc: { securityRevision: 1 } },
      { new: true }
    );
    if (!activeChallenge) throw new Error('Challenge is not published or active');

    // Fetch all published, active questions for this level, ordered by sequence
    const questions = await Question.find({
      challengeId: activeChallenge._id,
      levelNumber,
      status: 'Published',
      isActive: true
    })
      .sort({ order: 1, createdAt: 1 })
      .select('+flag');

    if (!questions || questions.length === 0) {
      // Empty state: No questions configured yet for this level
      let tc = await TeamChallenge.findOne({ teamId, levelNumber });
      if (!tc) {
        tc = await TeamChallenge.create({
          teamId,
          challengeId: activeChallenge._id,
          levelNumber,
          assignedQuestionId: null,
          currentSequenceNumber: 1,
          solvedQuestionIds: [],
          status: 'UNLOCKED',
          unlockedAt: new Date(),
          checkpointScanned: false
        });
      }
      return {
        teamChallenge: tc,
        question: null,
        sequenceNumber: 0,
        totalQuestions: 0,
        solvedCount: 0,
        isLevelComplete: false,
        emptyReason: 'No questions are configured for this level'
      };
    }

    // Find or create TeamChallenge for this team and level
    let tc = await TeamChallenge.findOne({ teamId, levelNumber });
    let isNewAssignment = false;

    if (!tc) {
      isNewAssignment = true;
      tc = await TeamChallenge.create({
        teamId,
        challengeId: activeChallenge._id,
        levelNumber,
        assignedQuestionId: questions[0]._id,
        currentSequenceNumber: 1,
        solvedQuestionIds: [],
        status: 'UNLOCKED',
        unlockedAt: new Date(),
        checkpointScanned: false
      });
    }

    // Determine current unsolved question in sequence
    const solvedSet = new Set((tc.solvedQuestionIds || []).map((id) => String(id)));
    const unsolvedIndex = questions.findIndex((q) => !solvedSet.has(String(q._id)));

    if (unsolvedIndex !== -1) {
      const currentQuestion = questions[unsolvedIndex];
      const seqNum = unsolvedIndex + 1;

      // Update assignment if sequence moved
      if (String(tc.assignedQuestionId) !== String(currentQuestion._id) || tc.currentSequenceNumber !== seqNum) {
        tc.assignedQuestionId = currentQuestion._id;
        tc.currentSequenceNumber = seqNum;
        if (tc.status === 'LOCKED') tc.status = 'UNLOCKED';
        await tc.save();
      }

      logger.info(
        `[QuestionProgression] Team ${teamId} on Level ${levelNumber} -> Question #${seqNum} of ${questions.length} (${currentQuestion._id})`
      );

      return {
        teamChallenge: tc,
        question: await participantQuestion(currentQuestion),
        rawQuestion: currentQuestion,
        sequenceNumber: seqNum,
        totalQuestions: questions.length,
        solvedCount: solvedSet.size,
        isLevelComplete: false,
        isNewAssignment
      };
    }

    // All questions in this level have been solved
    if (tc.status !== 'SOLVED') {
      tc.status = 'SOLVED';
      tc.solvedAt = tc.solvedAt || new Date();
      await tc.save();
    }

    const currentCheckpoint = await Checkpoint.findOne({ levelNumber });
    const nextCheckpoint = (await Checkpoint.findOne({
      levelNumber: levelNumber + 1,
      isActive: true
    })) || (await Checkpoint.findOne({ levelNumber: levelNumber + 1 }));

    const nextLocName = (currentCheckpoint?.nextLocationName && currentCheckpoint.nextLocationName.trim())
      || nextCheckpoint?.name
      || nextCheckpoint?.locationDescription
      || null;

    const locInstructions = (currentCheckpoint?.locationInstructions && currentCheckpoint.locationInstructions.trim())
      || nextCheckpoint?.notes
      || null;

    return {
      teamChallenge: tc,
      question: null,
      sequenceNumber: questions.length,
      totalQuestions: questions.length,
      solvedCount: questions.length,
      isLevelComplete: true,
      nextCheckpointLocation: nextLocName,
      nextLocationName: nextLocName,
      locationInstructions: locInstructions,
      nextCheckpoint: nextCheckpoint
        ? {
            name: nextLocName || nextCheckpoint.name,
            locationDescription: nextCheckpoint.locationDescription,
            levelNumber: nextCheckpoint.levelNumber,
            code: nextCheckpoint.checkpointCode,
            instructions: locInstructions
          }
        : null,
      isNewAssignment: false
    };
  }

  /**
   * Helper alias to assign or fetch question for a team at a specific level.
   *
   * @param {string} teamId
   * @param {number} levelNumber
   * @returns {Promise<{ questionId: object|null, question: object|null, teamChallenge: object, isNewAssignment: boolean }>}
   */
  async assignQuestionForTeamAndLevel(teamId, levelNumber) {
    const res = await this.getOrAssignQuestion(teamId, levelNumber);
    const qId = res.question?._id || res.teamChallenge?.assignedQuestionId || null;
    return {
      questionId: qId,
      question: res.question,
      teamChallenge: res.teamChallenge,
      isNewAssignment: Boolean(res.isNewAssignment),
      sequenceNumber: res.sequenceNumber,
      totalQuestions: res.totalQuestions,
      isLevelComplete: res.isLevelComplete
    };
  }
}

module.exports = new QuestionAssignmentService();

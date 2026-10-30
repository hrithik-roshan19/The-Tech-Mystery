const { participantQuestion } = require('../utils/participantData');
const { TeamChallenge, Question, Challenge, Checkpoint, EventConfig } = require('../models');
const config = require('../config/environment');
const logger = require('../utils/logger');

/**
 * Question Assignment Service
 * Guarantees that each team receives exactly ONE assigned question per level
 * from the level's published question bank.
 *
 * GAMEPLAY ARCHITECTURE:
 * - Exactly ONE permanent QR code per level.
 * - Each level contains a bank of questions.
 * - Each team is assigned exactly ONE question from that bank for the level.
 * - A single correct answer completes that level immediately and unlocks the next level.
 * - Solved levels return isLevelComplete = true and the unlocked next checkpoint.
 */
class QuestionAssignmentService {
  /**
   * Selects a question variation to balance distribution across teams in this level.
   *
   * @param {Array} pool - Available questions in level
   * @param {number} levelNumber
   * @returns {Promise<object>} Selected Question document
   */
  async selectBalancedVariation(pool, levelNumber) {
    if (!pool || pool.length === 0) return null;
    if (pool.length === 1) return pool[0];

    // Count existing assignments per question in this level
    const counts = await TeamChallenge.aggregate([
      { $match: { levelNumber } },
      { $group: { _id: '$assignedQuestionId', count: { $sum: 1 } } }
    ]);

    const countMap = new Map();
    counts.forEach((c) => {
      if (c._id) countMap.set(String(c._id), c.count);
    });

    const sortedPool = [...pool].sort((a, b) => {
      const countA = countMap.get(String(a._id)) || 0;
      const countB = countMap.get(String(b._id)) || 0;
      if (countA !== countB) return countA - countB;
      return (a.order || 0) - (b.order || 0);
    });

    return sortedPool[0];
  }

  /**
   * Retrieves or assigns exactly ONE question for a team at a specific level.
   *
   * @param {string} teamId
   * @param {number} levelNumber
   * @param {string} [preferredQuestionId]
   * @returns {Promise<{ teamChallenge: object, question: object|null, rawQuestion?: object, sequenceNumber: number, totalQuestions: number, solvedCount: number, isLevelComplete: boolean, nextCheckpoint?: object, emptyReason?: string, isNewAssignment?: boolean }>}
   */
  async getOrAssignQuestion(teamId, levelNumber, preferredQuestionId = null) {
    const activeChallenge = await Challenge.findOneAndUpdate(
      { levelNumber, status: 'Published', isActive: true },
      { $inc: { securityRevision: 1 } },
      { new: true }
    );
    if (!activeChallenge) throw new Error('Challenge is not published or active');

    // Fetch all published, active questions for this level
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

    // Check if this level is already solved by this squad
    const isSolved = tc && (tc.status === 'SOLVED' || (tc.solvedQuestionIds && tc.solvedQuestionIds.length > 0));

    if (isSolved) {
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
        || (nextCheckpoint?.locationDescription && nextCheckpoint.locationDescription.trim())
        || (nextCheckpoint?.name && nextCheckpoint.name.trim())
        || null;

      const locInstructions = (currentCheckpoint?.locationInstructions && currentCheckpoint.locationInstructions.trim())
        || (nextCheckpoint?.notes && nextCheckpoint.notes.trim())
        || null;

      return {
        teamChallenge: tc,
        question: null,
        sequenceNumber: 1,
        totalQuestions: 1,
        solvedCount: 1,
        isLevelComplete: true,
        nextCheckpointLocation: nextLocName,
        nextLocationName: nextLocName,
        locationInstructions: locInstructions,
        nextCheckpoint: nextCheckpoint
          ? {
              code: nextCheckpoint.checkpointCode || `HTG-CP${String(nextCheckpoint.levelNumber).padStart(2, '0')}`,
              name: nextCheckpoint.name || `Checkpoint Level ${nextCheckpoint.levelNumber}`,
              levelNumber: nextCheckpoint.levelNumber,
              locationDescription: (nextCheckpoint.locationDescription && nextCheckpoint.locationDescription.trim()) || nextLocName || null,
              status: 'Unlocked',
              instructions: locInstructions
            }
          : null,
        isNewAssignment: false
      };
    }

    // Level is unsolved. Retrieve assigned question or assign one.
    let assignedQ = null;
    let isNewAssignment = false;

    if (tc && tc.assignedQuestionId) {
      assignedQ = questions.find((q) => String(q._id) === String(tc.assignedQuestionId));
      if (!assignedQ) {
        assignedQ = await Question.findOne({
          _id: tc.assignedQuestionId,
          status: 'Published',
          isActive: true
        }).select('+flag');
      }
    }

    if (!assignedQ) {
      isNewAssignment = true;
      if (preferredQuestionId && /^[0-9a-fA-F]{24}$/.test(String(preferredQuestionId))) {
        assignedQ = questions.find((q) => String(q._id) === String(preferredQuestionId));
      }
      if (!assignedQ) {
        assignedQ = await this.selectBalancedVariation(questions, levelNumber);
      }

      if (!tc) {
        tc = await TeamChallenge.create({
          teamId,
          challengeId: activeChallenge._id,
          levelNumber,
          assignedQuestionId: assignedQ._id,
          currentSequenceNumber: 1,
          solvedQuestionIds: [],
          status: 'UNLOCKED',
          unlockedAt: new Date(),
          checkpointScanned: false
        });
      } else {
        tc.assignedQuestionId = assignedQ._id;
        tc.currentSequenceNumber = 1;
        if (tc.status === 'LOCKED') tc.status = 'UNLOCKED';
        await tc.save();
      }
    }

    logger.info(
      `[QuestionAssignment] Team ${teamId} on Level ${levelNumber} -> Assigned Question ${assignedQ._id} (${assignedQ.title})`
    );

    return {
      teamChallenge: tc,
      question: await participantQuestion(assignedQ),
      rawQuestion: assignedQ,
      sequenceNumber: 1,
      totalQuestions: 1,
      solvedCount: 0,
      isLevelComplete: false,
      isNewAssignment
    };
  }

  /**
   * Helper alias to assign or fetch question for a team at a specific level.
   *
   * @param {string} teamId
   * @param {number} levelNumber
   * @param {string} [preferredQuestionId]
   * @returns {Promise<{ questionId: object|null, question: object|null, teamChallenge: object, isNewAssignment: boolean, sequenceNumber: number, totalQuestions: number, isLevelComplete: boolean }>}
   */
  async assignQuestionForTeamAndLevel(teamId, levelNumber, preferredQuestionId = null) {
    const res = await this.getOrAssignQuestion(teamId, levelNumber, preferredQuestionId);
    const qId = res.question?._id || res.teamChallenge?.assignedQuestionId || null;
    return {
      questionId: qId,
      question: res.question,
      teamChallenge: res.teamChallenge,
      isNewAssignment: Boolean(res.isNewAssignment),
      sequenceNumber: res.sequenceNumber || 1,
      totalQuestions: res.totalQuestions || 1,
      isLevelComplete: res.isLevelComplete
    };
  }
}

module.exports = new QuestionAssignmentService();

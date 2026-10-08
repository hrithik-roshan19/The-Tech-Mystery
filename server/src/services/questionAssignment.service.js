const { TeamChallenge, Question, Challenge } = require('../models');
const logger = require('../utils/logger');

/**
 * Question Assignment Service
 * Guarantees persistent, team-specific, balanced question variation assignment.
 */
class QuestionAssignmentService {
  /**
   * Retrieves the assigned question for a team at a specific level.
   * If not yet assigned, picks a question variation from the pool and persists it atomically.
   * 
   * NEVER returns the flag/answer field to callers!
   *
   * @param {string} teamId
   * @param {number} levelNumber
   * @returns {Promise<{ teamChallenge: object, question: object }>}
   */
  async getOrAssignQuestion(teamId, levelNumber) {
    // 1. Check if already persistently assigned
    let existingAssignment = await TeamChallenge.findOne({ teamId, levelNumber })
      .populate('assignedQuestionId', '-flag')
      .populate('challengeId');

    if (existingAssignment) {
      return {
        teamChallenge: existingAssignment,
        question: existingAssignment.assignedQuestionId,
        isNewAssignment: false
      };
    }

    // 2. Fetch challenge level definition
    const challenge = await Challenge.findOne({ levelNumber, isActive: true });
    if (!challenge) {
      throw new Error(`Challenge for level ${levelNumber} is not found or inactive`);
    }

    // 3. Fetch all active questions in the pool for this level
    const pool = await Question.find({ levelNumber, isActive: true }).select('-flag');
    if (!pool || pool.length === 0) {
      throw new Error(`No active question variations available in pool for level ${levelNumber}`);
    }

    // 4. Select variation using assignment balancing (pick least assigned question)
    const assignedVariation = await this.selectBalancedVariation(pool, levelNumber);

    // 5. Persist assignment atomically
    try {
      const newTeamChallenge = await TeamChallenge.create({
        teamId,
        challengeId: challenge._id,
        levelNumber,
        assignedQuestionId: assignedVariation._id,
        status: challenge.requiresCheckpointScan ? 'LOCKED' : 'UNLOCKED',
        checkpointScanned: !challenge.requiresCheckpointScan,
        unlockedAt: challenge.requiresCheckpointScan ? null : new Date()
      });

      logger.info(
        `[Assignment] Assigned Question ${assignedVariation._id} (Level ${levelNumber}) to Team ${teamId}`
      );

      return {
        teamChallenge: newTeamChallenge,
        question: assignedVariation,
        isNewAssignment: true
      };
    } catch (err) {
      // In case of concurrent race condition (e.g. 2 teammates scanning at exact same millisecond),
      // the unique compound index { teamId, levelNumber } catches it; return the already created one.
      if (err.code === 11000) {
        logger.debug(`[Assignment] Concurrent assignment caught by unique index for team ${teamId}, level ${levelNumber}`);
        const raceWinner = await TeamChallenge.findOne({ teamId, levelNumber })
          .populate('assignedQuestionId', '-flag')
          .populate('challengeId');
        return {
          teamChallenge: raceWinner,
          question: raceWinner.assignedQuestionId,
          isNewAssignment: false
        };
      }
      throw err;
    }
  }

  /**
   * Selects the question variation with the fewest assignments across teams to balance distribution.
   *
   * @param {Array} pool - Available questions in level
   * @param {number} levelNumber
   * @returns {Promise<object>} Selected Question document
   */
  async selectBalancedVariation(pool, levelNumber) {
    if (pool.length === 1) return pool[0];

    // Count existing team assignments per question in this level
    const counts = await TeamChallenge.aggregate([
      { $match: { levelNumber } },
      { $group: { _id: '$assignedQuestionId', count: { $sum: 1 } } }
    ]);

    const countMap = new Map();
    counts.forEach((c) => countMap.set(c._id.toString(), c.count));

    // Sort pool by least assigned count
    const sortedPool = [...pool].sort((a, b) => {
      const countA = countMap.get(a._id.toString()) || 0;
      const countB = countMap.get(b._id.toString()) || 0;
      return countA - countB;
    });

    // To prevent all teams receiving the same question if count is 0,
    // take the lowest count cohort and randomly pick among them
    const lowestCount = countMap.get(sortedPool[0]._id.toString()) || 0;
    const candidates = sortedPool.filter(
      (q) => (countMap.get(q._id.toString()) || 0) === lowestCount
    );

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
}

module.exports = new QuestionAssignmentService();

const { Team, Score, TeamChallenge, Submission } = require('../models');
const logger = require('../utils/logger');

/**
 * Scoring Service
 * Manages atomic score calculation, solve bonuses, hint penalty application,
 * and leaderboard synchronization.
 */
class ScoringService {
  /**
   * Processes a successful challenge solve atomically.
   *
   * @param {object} params
   * @param {string} params.teamId
   * @param {string} params.userId
   * @param {object} params.challenge
   * @param {object} params.teamChallenge
   * @param {string} params.submissionId
   * @returns {Promise<{ netPoints: number, newTotalScore: number, nextLevel: number }>}
   */
  async recordSuccessfulSolve({ teamId, userId, challenge, teamChallenge, submissionId }) {
    const solveTime = new Date();
    const basePoints = challenge.points || 100;
    const penalty = teamChallenge.penaltyIncurred || 0;
    const netPoints = Math.max(0, basePoints - penalty);

    // 1. Mark TeamChallenge as SOLVED
    teamChallenge.status = 'SOLVED';
    teamChallenge.solvedAt = solveTime;
    teamChallenge.solvedByUserId = userId;
    teamChallenge.pointsAwarded = netPoints;
    await teamChallenge.save();

    // 2. Increment Team score and advance current level
    const nextLevel = teamChallenge.levelNumber + 1;
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        $inc: { totalScore: netPoints },
        $set: {
          lastSolveTimestamp: solveTime,
          currentLevel: nextLevel
        }
      },
      { new: true }
    );

    // 3. Update Score snapshot for fast leaderboard lookups
    await Score.findOneAndUpdate(
      { teamId },
      {
        $inc: { currentScore: netPoints, solvedLevelsCount: 1 },
        $set: { lastSolveTimestamp: solveTime },
        $push: {
          history: {
            levelNumber: teamChallenge.levelNumber,
            challengeId: challenge._id,
            pointsAwarded: netPoints,
            solvedAt: solveTime,
            submissionId
          }
        }
      },
      { upsert: true, new: true }
    );

    logger.info(
      `[Scoring] Team ${teamId} solved Level ${teamChallenge.levelNumber} (+${netPoints} pts). New Total: ${updatedTeam.totalScore}`
    );

    return {
      netPoints,
      newTotalScore: updatedTeam.totalScore,
      nextLevel
    };
  }

  /**
   * Applies penalty for requesting a hint
   */
  async applyHintPenalty(teamChallengeId, penaltyPoints) {
    return TeamChallenge.findByIdAndUpdate(
      teamChallengeId,
      { $inc: { penaltyIncurred: penaltyPoints } },
      { new: true }
    );
  }
}

module.exports = new ScoringService();

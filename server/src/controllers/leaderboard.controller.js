const { Team, EventConfig } = require('../models');
const { success } = require('../utils/apiResponse');

/**
 * Leaderboard Controller
 * Provides real-time rank ordering and scoreboards with freeze support.
 */
class LeaderboardController {
  async getLiveLeaderboard(req, res, next) {
    try {
      const config = await EventConfig.findOne();
      const isFrozen = config ? config.isLeaderboardFrozen : false;

      // Sort by totalScore DESC, then lastSolveTimestamp ASC (tie-breaker)
      const teams = await Team.find({ isDisqualified: false })
        .select('name currentLevel totalScore lastSolveTimestamp createdAt avatarUrl')
        .sort({ totalScore: -1, lastSolveTimestamp: 1 })
        .limit(100);

      const ranked = teams.map((team, index) => ({
        rank: index + 1,
        teamId: team._id,
        teamName: team.name,
        currentLevel: team.currentLevel,
        totalScore: team.totalScore,
        lastSolveTimestamp: team.lastSolveTimestamp,
        avatarUrl: team.avatarUrl
      }));

      return success(
        res,
        {
          leaderboard: ranked,
          isFrozen,
          lastUpdated: new Date().toISOString()
        },
        'Leaderboard retrieved'
      );
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LeaderboardController();

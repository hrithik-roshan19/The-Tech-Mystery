const { Team, EventConfig, Submission } = require('../models');
const { success } = require('../utils/apiResponse');

/**
 * Deterministically sorts team records according to official CTF competition rules:
 * 1. totalScore DESC
 * 2. Earlier lastSolveTimestamp ASC (nulls/unsolved placed after valid timestamps)
 * 3. Earlier team createdAt timestamp ASC
 * 4. Stable tie-breaker: MongoDB ObjectId hex string ASC
 */
function sortTeamsDeterministically(teams) {
  return teams.sort((a, b) => {
    const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
    if (scoreDiff !== 0) return scoreDiff;

    const aTime = a.lastSolveTimestamp ? new Date(a.lastSolveTimestamp).getTime() : Infinity;
    const bTime = b.lastSolveTimestamp ? new Date(b.lastSolveTimestamp).getTime() : Infinity;
    if (aTime !== bTime) return aTime - bTime;

    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (aCreated !== bCreated) return aCreated - bCreated;

    return String(a._id).localeCompare(String(b._id));
  });
}

/**
 * Leaderboard Controller
 * Provides real-time rank ordering, deterministic tie-breaking, freeze support,
 * and visibility gating.
 */
class LeaderboardController {
  async getLiveLeaderboard(req, res, next) {
    try {
      const config = await EventConfig.findOne();
      const isVisible = config ? config.isLeaderboardVisible !== false : true;
      const isFrozen = config ? Boolean(config.isLeaderboardFrozen) : false;

      // When the leaderboard is hidden by administrators, suppress public standings
      if (!isVisible) {
        return success(
          res,
          {
            leaderboard: [],
            isVisible: false,
            isFrozen,
            message: 'The public leaderboard is currently hidden by event administrators.',
            totalTeams: 0,
            lastUpdated: new Date().toISOString()
          },
          'Leaderboard is currently hidden'
        );
      }

      const teams = await Team.find({ isDisqualified: false })
        .select('name currentLevel totalScore lastSolveTimestamp createdAt avatarUrl')
        .limit(200);

      const sortedTeams = sortTeamsDeterministically(teams);

      const ranked = sortedTeams.map((team, index) => ({
        rank: index + 1,
        teamId: team._id,
        teamName: team.name,
        currentLevel: team.currentLevel,
        solvedCount: Math.max(0, (team.currentLevel || 1) - 1),
        totalScore: team.totalScore || 0,
        lastSolveTimestamp: team.lastSolveTimestamp,
        createdAt: team.createdAt,
        avatarUrl: team.avatarUrl
      }));

      return success(
        res,
        {
          leaderboard: ranked,
          isVisible: true,
          isFrozen,
          totalTeams: ranked.length,
          lastUpdated: new Date().toISOString()
        },
        'Leaderboard retrieved'
      );
    } catch (error) {
      return next(error);
    }
  }

  async getAdminLeaderboard(req, res, next) {
    try {
      const config = await EventConfig.findOne();
      const isVisible = config ? config.isLeaderboardVisible !== false : true;
      const isFrozen = config ? Boolean(config.isLeaderboardFrozen) : false;

      const teams = await Team.find()
        .populate('leaderId', 'username email fullName')
        .populate('members', 'username email fullName')
        .limit(500);

      const sortedTeams = sortTeamsDeterministically(teams);

      const ranked = sortedTeams.map((team, index) => ({
        rank: index + 1,
        rawId: String(team._id),
        teamId: team._id,
        teamName: team.name,
        code: team.joinCode,
        name: team.name,
        currentLevel: team.currentLevel,
        level: team.currentLevel,
        solvedCount: Math.max(0, (team.currentLevel || 1) - 1),
        solved: Math.max(0, (team.currentLevel || 1) - 1),
        totalScore: team.totalScore || 0,
        score: team.totalScore || 0,
        membersCount: Array.isArray(team.members) ? team.members.length : 1,
        members: team.members,
        leader: team.leaderId,
        lastSolveTimestamp: team.lastSolveTimestamp,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        isDisqualified: Boolean(team.isDisqualified),
        disqualificationReason: team.disqualificationReason || null,
        status: team.isDisqualified ? 'Disqualified' : 'Active',
        avatarUrl: team.avatarUrl
      }));

      return success(
        res,
        {
          leaderboard: ranked,
          isVisible,
          isFrozen,
          totalTeams: ranked.length,
          lastUpdated: new Date().toISOString()
        },
        'Admin leaderboard retrieved'
      );
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LeaderboardController();

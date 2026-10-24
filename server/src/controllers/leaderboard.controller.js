const { Team, EventConfig } = require('../models');
const { success } = require('../utils/apiResponse');
const logger = require('../utils/logger');

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

// Active real-time Server-Sent Events (SSE) connections
const sseClients = new Set();

/**
 * Leaderboard Controller
 * Provides real-time rank ordering, deterministic tie-breaking, freeze support,
 * and visibility gating.
 */
class LeaderboardController {
  async buildLiveLeaderboardPayload() {
    const config = await EventConfig.findOne();
    const isVisible = config ? config.isLeaderboardVisible !== false : true;
    const isFrozen = config ? Boolean(config.isLeaderboardFrozen) : false;

    if (!isVisible) {
      return {
        leaderboard: [],
        isVisible: false,
        isFrozen,
        message: 'The public leaderboard is currently hidden by event administrators.',
        totalTeams: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    const teams = await Team.find({ isDisqualified: false })
      .select('name totalScore lastSolveTimestamp createdAt avatarUrl')
      .limit(200);

    const sortedTeams = sortTeamsDeterministically(teams);

    // SECURITY & PRIVACY: Do NOT expose currentLevel or assignedQuestion in public leaderboard
    const ranked = sortedTeams.map((team, index) => ({
      rank: index + 1,
      teamId: team._id,
      teamName: team.name,
      totalScore: team.totalScore || 0,
      lastSolveTimestamp: team.lastSolveTimestamp,
      createdAt: team.createdAt,
      avatarUrl: team.avatarUrl
    }));

    return {
      leaderboard: ranked,
      isVisible: true,
      isFrozen,
      totalTeams: ranked.length,
      lastUpdated: new Date().toISOString()
    };
  }

  async getLiveLeaderboard(req, res, next) {
    try {
      const payload = await this.buildLiveLeaderboardPayload();
      return success(
        res,
        payload,
        payload.isVisible ? 'Leaderboard retrieved' : 'Leaderboard is currently hidden'
      );
    } catch (error) {
      return next(error);
    }
  }

  async getPublicLeaderboard(req, res, next) {
    return this.getLiveLeaderboard(req, res, next);
  }

  streamLeaderboard(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);

    this.buildLiveLeaderboardPayload()
      .then((payload) => {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      })
      .catch(() => {});

    req.on('close', () => {
      sseClients.delete(res);
    });
  }

  async broadcastLeaderboardUpdate() {
    if (sseClients.size === 0) return;
    try {
      const payload = await this.buildLiveLeaderboardPayload();
      const message = `data: ${JSON.stringify(payload)}\n\n`;
      for (const client of sseClients) {
        try {
          client.write(message);
        } catch {
          sseClients.delete(client);
        }
      }
    } catch (err) {
      logger.warn(`Failed to broadcast leaderboard SSE update: ${err.message}`);
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

const leaderboardController = new LeaderboardController();
module.exports = leaderboardController;

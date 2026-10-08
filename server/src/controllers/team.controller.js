const { Team } = require('../models');
const teamService = require('../services/team.service');
const { success, created, badRequest, notFound } = require('../utils/apiResponse');

/**
 * Team Controller
 * Handles team creation, joining via invite codes, and team roster queries.
 */
class TeamController {
  async createTeam(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.userId;

      const team = await teamService.createTeam(userId, name);
      return created(res, { team }, 'Team successfully created');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async joinTeam(req, res, next) {
    try {
      const { joinCode } = req.body;
      const userId = req.user.userId;

      const team = await teamService.joinTeam(userId, joinCode);
      return success(res, { team }, 'Joined team successfully');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async getMyTeam(req, res, next) {
    try {
      if (!req.user.teamId) {
        return notFound(res, 'You are not currently enrolled in any team');
      }

      const team = await Team.findById(req.user.teamId)
        .populate('leaderId', 'username fullName email')
        .populate('members', 'username fullName email collegeRollNo');

      if (!team) {
        return notFound(res, 'Team record not found');
      }

      return success(res, { team }, 'Team details retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getTeamById(req, res, next) {
    try {
      const team = await Team.findById(req.params.id)
        .populate('leaderId', 'username fullName')
        .populate('members', 'username fullName');

      if (!team) {
        return notFound(res, 'Team not found');
      }

      // Hide join code from external viewers
      const sanitized = team.toObject();
      if (req.user?.teamId !== team._id.toString() && req.user?.role !== 'ADMIN') {
        delete sanitized.joinCode;
      }

      return success(res, { team: sanitized }, 'Team retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TeamController();

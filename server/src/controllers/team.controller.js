const { participantTeam } = require('../utils/participantData');
const { Team, User } = require('../models');
const teamService = require('../services/team.service');
const authService = require('../services/auth.service');
const { success, created, badRequest, notFound } = require('../utils/apiResponse');

/**
 * Team Controller
 * Handles team creation, joining via invite codes, and team roster queries.
 */
class TeamController {
  async createTeam(req, res, next) {
    try {
      const { name, college } = req.body;
      const userId = req.user.userId;

      const team = await teamService.createTeam(userId, name, college);
      const user = await User.findById(userId).select('+tokenVersion');
      const { accessToken, refreshToken } = authService.generateTokens(user);

      return created(
        res,
        {
          team: participantTeam(team, { ...req.user, role: user.role }),
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            teamId: user.teamId
          }
        },
        'Team successfully created'
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async joinTeam(req, res, next) {
    try {
      const { joinCode } = req.body;
      const userId = req.user.userId;

      const team = await teamService.joinTeam(userId, joinCode);
      const user = await User.findById(userId).select('+tokenVersion');
      const { accessToken, refreshToken } = authService.generateTokens(user);

      return success(
        res,
        {
          team: participantTeam(team, { ...req.user, role: user.role }),
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            teamId: user.teamId
          }
        },
        'Joined team successfully'
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async rotateJoinCode(req, res) {
    try {
      return success(res, await teamService.rotateJoinCode(req.params.id, req.user.userId), 'Invitation rotated');
    } catch (err) {
      return res.status(err.statusCode || 400).json({ success: false, message: err.message });
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

      return success(res, { team: participantTeam(team, req.user) }, 'Team details retrieved');
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

      const sanitized = participantTeam(team, req.user);

      return success(res, { team: sanitized }, 'Team retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TeamController();


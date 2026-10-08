const { Team, User, Challenge, Question, Submission, Checkpoint, EventConfig } = require('../models');
const { generateCheckpointToken } = require('../utils/crypto');
const { success, badRequest, notFound } = require('../utils/apiResponse');

/**
 * Admin Controller
 * High-privilege operational endpoints for CTF event administrators.
 */
class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const totalTeams = await Team.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalChallenges = await Challenge.countDocuments();
      const totalQuestions = await Question.countDocuments();
      const totalSubmissions = await Submission.countDocuments();
      const correctSubmissions = await Submission.countDocuments({ isCorrect: true });
      const config = await EventConfig.findOne();

      return success(res, {
        stats: {
          totalTeams,
          totalUsers,
          totalChallenges,
          totalQuestions,
          totalSubmissions,
          correctSubmissions,
          accuracyRate: totalSubmissions > 0 ? ((correctSubmissions / totalSubmissions) * 100).toFixed(1) + '%' : '0%'
        },
        eventConfig: config
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAllTeams(req, res, next) {
    try {
      const teams = await Team.find()
        .populate('leaderId', 'username email fullName')
        .populate('members', 'username email fullName')
        .sort({ totalScore: -1 });

      return success(res, { teams });
    } catch (error) {
      return next(error);
    }
  }

  async disqualifyTeam(req, res, next) {
    try {
      const { teamId } = req.params;
      const { reason } = req.body;

      const team = await Team.findByIdAndUpdate(
        teamId,
        {
          isDisqualified: true,
          disqualificationReason: reason || 'Violation of event rules'
        },
        { new: true }
      );

      if (!team) return notFound(res, 'Team not found');

      return success(res, { team }, `Team ${team.name} has been disqualified`);
    } catch (error) {
      return next(error);
    }
  }

  async createChallenge(req, res, next) {
    try {
      const challenge = await Challenge.create(req.body);
      return success(res, { challenge }, 'Challenge level created', 201);
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async createQuestion(req, res, next) {
    try {
      const question = await Question.create(req.body);
      return success(res, { question }, 'Question added to challenge pool', 201);
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async getCheckpoints(req, res, next) {
    try {
      const checkpoints = await Checkpoint.find().sort({ levelNumber: 1 });
      const enriched = checkpoints.map((cp) => {
        const token = generateCheckpointToken(cp.checkpointCode, cp.levelNumber);
        return {
          ...cp.toObject(),
          hmacToken: token,
          sampleQrUrl: `/checkpoint/scan?code=${cp.checkpointCode}&token=${token}`
        };
      });

      return success(res, { checkpoints: enriched });
    } catch (error) {
      return next(error);
    }
  }

  async createCheckpoint(req, res, next) {
    try {
      const checkpoint = await Checkpoint.create(req.body);
      const token = generateCheckpointToken(checkpoint.checkpointCode, checkpoint.levelNumber);
      return success(
        res,
        {
          checkpoint,
          token,
          sampleQrUrl: `/checkpoint/scan?code=${checkpoint.checkpointCode}&token=${token}`
        },
        'Checkpoint created',
        201
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async getSubmissionLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 50;

      const submissions = await Submission.find()
        .populate('teamId', 'name')
        .populate('userId', 'username')
        .sort({ submittedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Submission.countDocuments();

      return success(
        res,
        { submissions },
        'Submissions log retrieved',
        200,
        { page, limit, total }
      );
    } catch (error) {
      return next(error);
    }
  }

  async updateEventConfig(req, res, next) {
    try {
      let config = await EventConfig.findOne();
      if (!config) {
        config = await EventConfig.create(req.body);
      } else {
        Object.assign(config, req.body);
        await config.save();
      }

      return success(res, { config }, 'Event configuration updated');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }
}

module.exports = new AdminController();

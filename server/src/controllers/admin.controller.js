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
        .populate('leaderId', 'username email fullName role collegeRollNo isActive')
        .populate('members', 'username email fullName role collegeRollNo isActive')
        .sort({ totalScore: -1, createdAt: -1 });

      return success(res, { teams });
    } catch (error) {
      return next(error);
    }
  }

  async disqualifyTeam(req, res, next) {
    try {
      const { teamId } = req.params;
      if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
        return badRequest(res, 'Invalid team ID format');
      }

      const { reason, isDisqualified } = req.body;
      const shouldDisqualify = isDisqualified === undefined ? true : Boolean(isDisqualified);
      const sanitizedReason =
        typeof reason === 'string' && reason.trim().length > 0
          ? reason.trim().slice(0, 300)
          : 'Violation of event rules';

      const team = await Team.findByIdAndUpdate(
        teamId,
        {
          isDisqualified: shouldDisqualify,
          disqualificationReason: shouldDisqualify ? sanitizedReason : null
        },
        { new: true }
      )
        .populate('leaderId', 'username email fullName role collegeRollNo isActive')
        .populate('members', 'username email fullName role collegeRollNo isActive');

      if (!team) return notFound(res, 'Team not found');

      const actionMsg = shouldDisqualify
        ? `Team ${team.name} has been disqualified`
        : `Team ${team.name} has been restored`;

      return success(res, { team }, actionMsg);
    } catch (error) {
      return next(error);
    }
  }

  async getChallenges(req, res, next) {
    try {
      const [challenges, questions, checkpoints] = await Promise.all([
        Challenge.find().sort({ levelNumber: 1 }),
        Question.find().select('-flag').sort({ levelNumber: 1, createdAt: -1 }),
        Checkpoint.find().sort({ levelNumber: 1 })
      ]);

      const enriched = challenges.map((ch) => {
        const chIdStr = String(ch._id);
        const linkedQuestions = questions.filter(
          (q) => String(q.challengeId) === chIdStr || q.levelNumber === ch.levelNumber
        );
        const linkedCheckpoints = checkpoints.filter(
          (cp) =>
            (cp.associatedChallengeId && String(cp.associatedChallengeId) === chIdStr) ||
            (ch.checkpointId && String(ch.checkpointId) === String(cp._id)) ||
            cp.levelNumber === ch.levelNumber
        );

        const derivedStatus =
          ch.status || (ch.isActive === false ? 'Paused' : 'Published');

        return {
          ...ch.toObject(),
          status: derivedStatus,
          questionCount: linkedQuestions.length,
          linkedQuestions,
          linkedCheckpoints
        };
      });

      return success(res, { challenges: enriched });
    } catch (error) {
      return next(error);
    }
  }

  async createChallenge(req, res, next) {
    try {
      const {
        levelNumber,
        title,
        subtitle,
        category,
        difficulty,
        points,
        status,
        isActive,
        description,
        objectives,
        image,
        requiresCheckpointScan,
        checkpointId
      } = req.body;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return badRequest(res, 'Challenge title is required');
      }

      let resolvedLevel = Number(levelNumber);
      if (!Number.isInteger(resolvedLevel) || resolvedLevel < 1) {
        const highest = await Challenge.findOne().sort({ levelNumber: -1 }).select('levelNumber');
        resolvedLevel = highest ? highest.levelNumber + 1 : 1;
      }

      const normalizedPoints = points !== undefined ? Number(points) : 100;
      if (Number.isNaN(normalizedPoints) || normalizedPoints < 0) {
        return badRequest(res, 'Points must be a non-negative number');
      }

      const normalizedDifficulty = difficulty
        ? String(difficulty).trim().toUpperCase()
        : 'MEDIUM';
      const validStatuses = ['Published', 'Draft', 'Paused'];
      const resolvedStatus = validStatuses.includes(status)
        ? status
        : isActive === false
        ? 'Draft'
        : 'Published';
      const resolvedActive = resolvedStatus === 'Published';

      const challenge = await Challenge.create({
        levelNumber: resolvedLevel,
        title: title.trim(),
        subtitle: typeof subtitle === 'string' ? subtitle.trim() : '',
        category: category || 'Web',
        difficulty: normalizedDifficulty,
        points: normalizedPoints,
        status: resolvedStatus,
        isActive: resolvedActive,
        description:
          typeof description === 'string' && description.trim()
            ? description.trim()
            : `${title.trim()} — Level ${resolvedLevel} challenge.`,
        objectives: Array.isArray(objectives)
          ? objectives.map((o) => String(o).trim()).filter(Boolean)
          : [],
        image: typeof image === 'string' && image.trim() ? image.trim() : '🧩',
        requiresCheckpointScan:
          requiresCheckpointScan !== undefined ? Boolean(requiresCheckpointScan) : true,
        checkpointId: checkpointId || null
      });

      return success(
        res,
        {
          challenge: {
            ...challenge.toObject(),
            questionCount: 0,
            linkedQuestions: [],
            linkedCheckpoints: []
          }
        },
        'Challenge level created',
        201
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async updateChallenge(req, res, next) {
    try {
      const { challengeId } = req.params;
      if (!challengeId || !/^[0-9a-fA-F]{24}$/.test(challengeId)) {
        return badRequest(res, 'Invalid challenge ID format');
      }

      const existing = await Challenge.findById(challengeId);
      if (!existing) {
        return notFound(res, 'Challenge not found');
      }

      const {
        levelNumber,
        title,
        subtitle,
        category,
        difficulty,
        points,
        status,
        isActive,
        description,
        objectives,
        image,
        requiresCheckpointScan,
        checkpointId
      } = req.body;

      if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
          return badRequest(res, 'Challenge title cannot be empty');
        }
        existing.title = title.trim();
      }
      if (subtitle !== undefined) {
        existing.subtitle = typeof subtitle === 'string' ? subtitle.trim() : '';
      }
      if (levelNumber !== undefined) {
        const lvl = Number(levelNumber);
        if (!Number.isInteger(lvl) || lvl < 1) {
          return badRequest(res, 'Level number must be a positive integer');
        }
        existing.levelNumber = lvl;
      }
      if (category !== undefined) {
        existing.category = category;
      }
      if (difficulty !== undefined) {
        existing.difficulty = String(difficulty).trim().toUpperCase();
      }
      if (points !== undefined) {
        const pts = Number(points);
        if (Number.isNaN(pts) || pts < 0) {
          return badRequest(res, 'Points must be a non-negative number');
        }
        existing.points = pts;
      }
      if (description !== undefined && typeof description === 'string' && description.trim()) {
        existing.description = description.trim();
      }
      if (Array.isArray(objectives)) {
        existing.objectives = objectives.map((o) => String(o).trim()).filter(Boolean);
      }
      if (typeof image === 'string' && image.trim()) {
        existing.image = image.trim();
      }
      if (requiresCheckpointScan !== undefined) {
        existing.requiresCheckpointScan = Boolean(requiresCheckpointScan);
      }
      if (checkpointId !== undefined) {
        existing.checkpointId = checkpointId || null;
      }

      const validStatuses = ['Published', 'Draft', 'Paused'];
      if (status !== undefined && validStatuses.includes(status)) {
        existing.status = status;
        existing.isActive = status === 'Published';
      } else if (isActive !== undefined) {
        existing.isActive = Boolean(isActive);
        existing.status = existing.isActive ? 'Published' : 'Paused';
      }

      await existing.save();

      const [linkedQuestions, linkedCheckpoints] = await Promise.all([
        Question.find({
          $or: [{ challengeId: existing._id }, { levelNumber: existing.levelNumber }]
        }).select('-flag'),
        Checkpoint.find({
          $or: [
            { associatedChallengeId: existing._id },
            { levelNumber: existing.levelNumber }
          ]
        })
      ]);

      return success(
        res,
        {
          challenge: {
            ...existing.toObject(),
            questionCount: linkedQuestions.length,
            linkedQuestions,
            linkedCheckpoints
          }
        },
        `Challenge "${existing.title}" updated`
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async getQuestions(req, res, next) {
    try {
      const filter = {};
      if (req.query.levelNumber) {
        filter.levelNumber = Number(req.query.levelNumber);
      }
      if (req.query.challengeId && /^[0-9a-fA-F]{24}$/.test(req.query.challengeId)) {
        filter.challengeId = req.query.challengeId;
      }

      const questions = await Question.find(filter)
        .select('-flag')
        .populate('challengeId', 'levelNumber title category difficulty points status isActive')
        .sort({ levelNumber: 1, createdAt: -1 });

      return success(res, { questions });
    } catch (error) {
      return next(error);
    }
  }

  async createQuestion(req, res, next) {
    try {
      const { challengeId, levelNumber, title, prompt, category, difficulty, flag, isCaseSensitive, hints, assetUrls } = req.body;

      if (!title || !prompt || !flag) {
        return badRequest(res, 'Question title, prompt, and secret flag are required');
      }

      let targetChallenge = null;
      if (challengeId && /^[0-9a-fA-F]{24}$/.test(challengeId)) {
        targetChallenge = await Challenge.findById(challengeId);
      } else if (levelNumber !== undefined) {
        targetChallenge = await Challenge.findOne({ levelNumber: Number(levelNumber) });
      }

      if (!targetChallenge) {
        return badRequest(
          res,
          `No challenge level found for ${challengeId ? `ID ${challengeId}` : `Level ${levelNumber}`}. Create the Challenge level first.`
        );
      }

      const question = await Question.create({
        challengeId: targetChallenge._id,
        levelNumber: targetChallenge.levelNumber,
        title: String(title).trim(),
        prompt: String(prompt).trim(),
        category: category || targetChallenge.category,
        difficulty: difficulty
          ? String(difficulty).trim().toUpperCase()
          : targetChallenge.difficulty,
        flag: String(flag).trim(),
        isCaseSensitive: isCaseSensitive !== undefined ? Boolean(isCaseSensitive) : true,
        hints: Array.isArray(hints) ? hints : [],
        assetUrls: Array.isArray(assetUrls) ? assetUrls : []
      });

      const safeQuestion = question.toObject();
      delete safeQuestion.flag;

      return success(res, { question: safeQuestion }, 'Question added to challenge pool', 201);
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


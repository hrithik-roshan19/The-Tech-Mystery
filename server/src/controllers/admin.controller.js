const mongoose = require('mongoose');
const { Team, User, Challenge, Question, TeamChallenge, Submission, Checkpoint, EventConfig, Score } = require('../models');
const { generateCheckpointToken } = require('../utils/crypto');
const { success, badRequest, notFound } = require('../utils/apiResponse');
const { SUBMISSION_STATUS } = require('../constants/submissionStatus');
const logger = require('../utils/logger');

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

      // Admins are authenticated & authorized via requireAdmin middleware.
      // Include flag if admin explicitly requests it or by default for admin question manager.
      const query = Question.find(filter)
        .populate('challengeId', 'levelNumber title category difficulty points status isActive')
        .sort({ levelNumber: 1, createdAt: -1 });

      if (req.query.includeFlag === 'true' || req.query.withFlag === 'true') {
        query.select('+flag');
      } else {
        query.select('-flag');
      }

      const questions = await query;

      return success(res, { questions });
    } catch (error) {
      return next(error);
    }
  }

  async createQuestion(req, res, next) {
    try {
      const {
        challengeId,
        challenge: challengeName,
        levelNumber,
        level,
        title,
        prompt,
        category,
        difficulty,
        flag,
        answer,
        type,
        points,
        status,
        attempts,
        required,
        hint,
        isCaseSensitive,
        hints,
        assetUrls
      } = req.body;

      const secretFlag = flag || answer;
      if (!title || !prompt || !secretFlag) {
        return badRequest(res, 'Question title, prompt, and secret flag / answer are required');
      }

      const targetLevel = levelNumber !== undefined ? Number(levelNumber) : (level !== undefined ? Number(level) : undefined);
      let targetChallenge = null;
      if (challengeId && /^[0-9a-fA-F]{24}$/.test(challengeId)) {
        targetChallenge = await Challenge.findById(challengeId);
      } else if (challengeName && typeof challengeName === 'string') {
        targetChallenge = await Challenge.findOne({ title: challengeName.trim() });
      }
      if (!targetChallenge && targetLevel !== undefined) {
        targetChallenge = await Challenge.findOne({ levelNumber: targetLevel });
      }

      if (!targetChallenge) {
        return badRequest(
          res,
          `No challenge level found for ${challengeId ? `ID ${challengeId}` : challengeName ? `Challenge "${challengeName}"` : `Level ${targetLevel}`}. Create the Challenge level first.`
        );
      }

      const formattedHints = Array.isArray(hints)
        ? hints
        : hint && typeof hint === 'string' && hint.trim()
        ? [{ hintIndex: 1, content: hint.trim(), penaltyPoints: 20 }]
        : [];

      const initialStatus = ['Published', 'Draft', 'Paused'].includes(status) ? status : 'Published';

      const question = await Question.create({
        challengeId: targetChallenge._id,
        levelNumber: targetChallenge.levelNumber,
        title: String(title).trim(),
        prompt: String(prompt).trim(),
        type: ['Text Answer', 'Flag', 'Multiple Choice', 'File Upload'].includes(type) ? type : 'Flag',
        category: category || targetChallenge.category,
        difficulty: difficulty
          ? String(difficulty).trim().toUpperCase()
          : targetChallenge.difficulty,
        points: points !== undefined && !Number.isNaN(Number(points)) ? Math.max(0, Number(points)) : 100,
        status: initialStatus,
        isActive: initialStatus === 'Published',
        attempts: attempts !== undefined && !Number.isNaN(Number(attempts)) ? Math.max(1, Number(attempts)) : 3,
        required: required !== undefined ? Boolean(required) : true,
        flag: String(secretFlag).trim(),
        isCaseSensitive: isCaseSensitive !== undefined ? Boolean(isCaseSensitive) : true,
        hints: formattedHints,
        assetUrls: Array.isArray(assetUrls) ? assetUrls : []
      });

      const populatedQuestion = await Question.findById(question._id)
        .select('+flag')
        .populate('challengeId', 'levelNumber title category difficulty points status isActive');

      return success(res, { question: populatedQuestion }, 'Question added to challenge pool', 201);
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async updateQuestion(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!questionId || !/^[0-9a-fA-F]{24}$/.test(questionId)) {
        return badRequest(res, 'Valid question ID is required');
      }

      const existing = await Question.findById(questionId).select('+flag');
      if (!existing) {
        return notFound(res, 'Question not found');
      }

      const {
        title,
        prompt,
        challengeId,
        challenge: challengeName,
        levelNumber,
        level,
        type,
        category,
        difficulty,
        points,
        status,
        isActive,
        attempts,
        required,
        flag,
        answer,
        hint,
        hints,
        isCaseSensitive,
        assetUrls
      } = req.body;

      if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
          return badRequest(res, 'Question title cannot be empty');
        }
        existing.title = title.trim();
      }
      if (prompt !== undefined) {
        if (typeof prompt !== 'string' || !prompt.trim()) {
          return badRequest(res, 'Question prompt cannot be empty');
        }
        existing.prompt = prompt.trim();
      }
      if (type !== undefined && ['Text Answer', 'Flag', 'Multiple Choice', 'File Upload'].includes(type)) {
        existing.type = type;
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
      if (attempts !== undefined) {
        const att = Number(attempts);
        if (Number.isNaN(att) || att < 1) {
          return badRequest(res, 'Attempts must be a positive integer');
        }
        existing.attempts = att;
      }
      if (required !== undefined) {
        existing.required = Boolean(required);
      }

      const validStatuses = ['Published', 'Draft', 'Paused'];
      if (status !== undefined && validStatuses.includes(status)) {
        existing.status = status;
        existing.isActive = status === 'Published';
      } else if (isActive !== undefined) {
        existing.isActive = Boolean(isActive);
        existing.status = existing.isActive ? 'Published' : 'Paused';
      }

      const secretFlag = flag !== undefined ? flag : answer;
      if (secretFlag !== undefined && typeof secretFlag === 'string' && secretFlag.trim()) {
        existing.flag = secretFlag.trim();
      }

      if (hint !== undefined && typeof hint === 'string') {
        existing.hints = [{ hintIndex: 1, content: hint.trim(), penaltyPoints: 20 }];
      } else if (Array.isArray(hints)) {
        existing.hints = hints;
      }

      if (isCaseSensitive !== undefined) {
        existing.isCaseSensitive = Boolean(isCaseSensitive);
      }
      if (Array.isArray(assetUrls)) {
        existing.assetUrls = assetUrls;
      }

      // Check if challenge/level was modified
      const targetLevel = levelNumber !== undefined ? Number(levelNumber) : (level !== undefined ? Number(level) : undefined);
      let targetChallenge = null;
      if (challengeId && /^[0-9a-fA-F]{24}$/.test(challengeId)) {
        targetChallenge = await Challenge.findById(challengeId);
      } else if (challengeName && typeof challengeName === 'string') {
        targetChallenge = await Challenge.findOne({ title: challengeName.trim() });
      } else if (targetLevel !== undefined && targetLevel !== existing.levelNumber) {
        targetChallenge = await Challenge.findOne({ levelNumber: targetLevel });
      }

      if (targetChallenge) {
        existing.challengeId = targetChallenge._id;
        existing.levelNumber = targetChallenge.levelNumber;
      }

      await existing.save();

      const populated = await Question.findById(existing._id)
        .select('+flag')
        .populate('challengeId', 'levelNumber title category difficulty points status isActive');

      return success(res, { question: populated }, `Question "${existing.title}" updated`);
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async getCheckpoints(req, res, next) {
    try {
      const checkpoints = await Checkpoint.find()
        .populate('associatedChallengeId', 'levelNumber title category difficulty points status isActive')
        .sort({ levelNumber: 1, createdAt: 1 });

      const enriched = await Promise.all(
        checkpoints.map(async (cp) => {
          const token = generateCheckpointToken(cp.checkpointCode, cp.levelNumber);
          const teamsCount = await TeamChallenge.countDocuments({
            levelNumber: cp.levelNumber,
            checkpointScanned: true
          });

          return {
            ...cp.toObject(),
            token,
            hmacToken: token,
            teamsCount,
            teams: teamsCount,
            scans: cp.scanCount || 0,
            challenge: cp.associatedChallengeId?.title || `Level ${cp.levelNumber}`,
            location: cp.locationDescription,
            code: cp.checkpointCode,
            level: cp.levelNumber,
            status: cp.status || (cp.isActive ? 'Active' : 'Paused'),
            mode: cp.mode || 'Team-bound QR',
            lastScan: cp.lastScanAt ? new Date(cp.lastScanAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—',
            sampleQrUrl: `/checkpoint/scan?code=${cp.checkpointCode}&token=${token}`
          };
        })
      );

      return success(res, { checkpoints: enriched });
    } catch (error) {
      return next(error);
    }
  }

  async createCheckpoint(req, res, next) {
    try {
      const {
        name,
        code,
        checkpointCode,
        level,
        levelNumber,
        challenge,
        challengeId,
        associatedChallengeId,
        location,
        locationDescription,
        status,
        mode,
        notes
      } = req.body;

      const codeVal = String(code || checkpointCode || '').trim().toUpperCase();
      const nameVal = String(name || '').trim();
      const locVal = String(location || locationDescription || '').trim();
      const lvlVal = Number(level !== undefined ? level : (levelNumber !== undefined ? levelNumber : 1));

      if (!nameVal || !codeVal || !locVal) {
        return badRequest(res, 'Checkpoint name, code, and location description are required');
      }

      const existing = await Checkpoint.findOne({ checkpointCode: codeVal });
      if (existing) {
        return badRequest(res, `Checkpoint with code "${codeVal}" already exists`);
      }

      let targetChallenge = null;
      if (associatedChallengeId && /^[0-9a-fA-F]{24}$/.test(associatedChallengeId)) {
        targetChallenge = await Challenge.findById(associatedChallengeId);
      } else if (challengeId && /^[0-9a-fA-F]{24}$/.test(challengeId)) {
        targetChallenge = await Challenge.findById(challengeId);
      } else if (challenge && typeof challenge === 'string') {
        targetChallenge = await Challenge.findOne({ title: challenge.trim() });
      }
      if (!targetChallenge && lvlVal) {
        targetChallenge = await Challenge.findOne({ levelNumber: lvlVal });
      }

      const finalStatus = ['Active', 'Paused', 'Draft'].includes(status) ? status : 'Draft';
      const finalMode = ['Public QR', 'Team-bound QR'].includes(mode) ? mode : 'Team-bound QR';

      const checkpoint = await Checkpoint.create({
        name: nameVal,
        checkpointCode: codeVal,
        locationDescription: locVal,
        levelNumber: targetChallenge ? targetChallenge.levelNumber : lvlVal,
        associatedChallengeId: targetChallenge ? targetChallenge._id : null,
        status: finalStatus,
        isActive: finalStatus === 'Active',
        mode: finalMode,
        notes: notes ? String(notes).trim() : null
      });

      const token = generateCheckpointToken(checkpoint.checkpointCode, checkpoint.levelNumber);
      const populated = await Checkpoint.findById(checkpoint._id)
        .populate('associatedChallengeId', 'levelNumber title category difficulty points status isActive');

      return success(
        res,
        {
          checkpoint: {
            ...populated.toObject(),
            token,
            hmacToken: token,
            challenge: populated.associatedChallengeId?.title || `Level ${populated.levelNumber}`,
            location: populated.locationDescription,
            code: populated.checkpointCode,
            level: populated.levelNumber,
            scans: 0,
            teams: 0,
            lastScan: '—',
            sampleQrUrl: `/checkpoint/scan?code=${checkpoint.checkpointCode}&token=${token}`
          },
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

  async updateCheckpoint(req, res, next) {
    try {
      const { checkpointId } = req.params;
      if (!checkpointId || !/^[0-9a-fA-F]{24}$/.test(checkpointId)) {
        return badRequest(res, 'Valid checkpoint ID is required');
      }

      const existing = await Checkpoint.findById(checkpointId);
      if (!existing) {
        return notFound(res, 'Checkpoint not found');
      }

      const {
        name,
        code,
        checkpointCode,
        level,
        levelNumber,
        challenge,
        challengeId,
        associatedChallengeId,
        location,
        locationDescription,
        status,
        isActive,
        mode,
        notes
      } = req.body;

      if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim()) {
          return badRequest(res, 'Checkpoint name cannot be empty');
        }
        existing.name = name.trim();
      }

      const codeVal = code !== undefined ? code : checkpointCode;
      if (codeVal !== undefined) {
        const trimmedCode = String(codeVal).trim().toUpperCase();
        if (!trimmedCode) {
          return badRequest(res, 'Checkpoint code cannot be empty');
        }
        const conflict = await Checkpoint.findOne({
          checkpointCode: trimmedCode,
          _id: { $ne: existing._id }
        });
        if (conflict) {
          return badRequest(res, `Another checkpoint already uses code "${trimmedCode}"`);
        }
        existing.checkpointCode = trimmedCode;
      }

      const locVal = location !== undefined ? location : locationDescription;
      if (locVal !== undefined) {
        if (typeof locVal !== 'string' || !locVal.trim()) {
          return badRequest(res, 'Location description cannot be empty');
        }
        existing.locationDescription = locVal.trim();
      }

      const lvlVal = level !== undefined ? level : levelNumber;
      if (lvlVal !== undefined) {
        const lvlNum = Number(lvlVal);
        if (!Number.isInteger(lvlNum) || lvlNum < 1) {
          return badRequest(res, 'Level must be a positive integer');
        }
        existing.levelNumber = lvlNum;
      }

      if (mode !== undefined && ['Public QR', 'Team-bound QR'].includes(mode)) {
        existing.mode = mode;
      }

      const validStatuses = ['Active', 'Paused', 'Draft'];
      if (status !== undefined && validStatuses.includes(status)) {
        existing.status = status;
        existing.isActive = status === 'Active';
      } else if (isActive !== undefined) {
        existing.isActive = Boolean(isActive);
        existing.status = existing.isActive ? 'Active' : 'Paused';
      }

      if (notes !== undefined) {
        existing.notes = typeof notes === 'string' ? notes.trim() : null;
      }

      let targetChallenge = null;
      if (associatedChallengeId && /^[0-9a-fA-F]{24}$/.test(associatedChallengeId)) {
        targetChallenge = await Challenge.findById(associatedChallengeId);
      } else if (challengeId && /^[0-9a-fA-F]{24}$/.test(challengeId)) {
        targetChallenge = await Challenge.findById(challengeId);
      } else if (challenge && typeof challenge === 'string') {
        targetChallenge = await Challenge.findOne({ title: challenge.trim() });
      }

      if (targetChallenge) {
        existing.associatedChallengeId = targetChallenge._id;
        existing.levelNumber = targetChallenge.levelNumber;
      }

      await existing.save();

      const populated = await Checkpoint.findById(existing._id)
        .populate('associatedChallengeId', 'levelNumber title category difficulty points status isActive');

      const token = generateCheckpointToken(populated.checkpointCode, populated.levelNumber);
      const teamsCount = await TeamChallenge.countDocuments({
        levelNumber: populated.levelNumber,
        checkpointScanned: true
      });

      return success(
        res,
        {
          checkpoint: {
            ...populated.toObject(),
            token,
            hmacToken: token,
            teamsCount,
            teams: teamsCount,
            scans: populated.scanCount || 0,
            challenge: populated.associatedChallengeId?.title || `Level ${populated.levelNumber}`,
            location: populated.locationDescription,
            code: populated.checkpointCode,
            level: populated.levelNumber,
            sampleQrUrl: `/checkpoint/scan?code=${populated.checkpointCode}&token=${token}`
          }
        },
        `Checkpoint "${existing.name}" updated`
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async getSubmissionLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 100;
      const { result, level, team, search } = req.query;

      const filter = {};

      if (level && level !== 'All Levels') {
        const parsedLevel = Number(level);
        if (!Number.isNaN(parsedLevel)) {
          filter.levelNumber = parsedLevel;
        }
      }

      if (result && result !== 'All Results') {
        if (result === 'Correct') {
          filter.$or = [{ status: SUBMISSION_STATUS.CORRECT }, { isCorrect: true }];
        } else if (result === 'Incorrect') {
          filter.$and = [
            { $or: [{ status: SUBMISSION_STATUS.INCORRECT }, { isCorrect: false }] },
            { status: { $ne: SUBMISSION_STATUS.PENDING_REVIEW } }
          ];
        } else if (result === 'Pending Review') {
          filter.$or = [
            { status: SUBMISSION_STATUS.PENDING_REVIEW },
            { reviewed: false, isCorrect: false }
          ];
        }
      }

      if (team && team !== 'All Teams') {
        if (mongoose.Types.ObjectId.isValid(team)) {
          filter.teamId = team;
        } else {
          const matchingTeams = await Team.find({
            name: { $regex: String(team).trim(), $options: 'i' }
          }).select('_id');
          filter.teamId = { $in: matchingTeams.map((t) => t._id) };
        }
      }

      const submissions = await Submission.find(filter)
        .populate('teamId', 'name joinCode currentLevel totalScore')
        .populate('userId', 'username fullName')
        .populate('challengeId', 'title levelNumber points')
        .populate('questionId', 'title type points prompt category')
        .populate('reviewedBy', 'username fullName')
        .sort({ submittedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalMatching = await Submission.countDocuments(filter);

      // Compute global summary counts across all submissions
      const totalGlobal = await Submission.countDocuments();
      const correctGlobal = await Submission.countDocuments({
        $or: [{ status: SUBMISSION_STATUS.CORRECT }, { isCorrect: true }]
      });
      const incorrectGlobal = await Submission.countDocuments({
        status: SUBMISSION_STATUS.INCORRECT
      });
      const pendingGlobal = await Submission.countDocuments({
        $or: [
          { status: SUBMISSION_STATUS.PENDING_REVIEW },
          { reviewed: false, isCorrect: false }
        ]
      });

      const pointsAgg = await Submission.aggregate([
        { $group: { _id: null, totalPoints: { $sum: '$pointsDelta' } } }
      ]);
      const totalPointsAwarded = pointsAgg[0]?.totalPoints || 0;

      // Format submissions for frontend table and inspector
      let formatted = submissions.map((item) => {
        const dateObj = item.submittedAt || item.createdAt || new Date();
        const timeStr = dateObj.toTimeString ? dateObj.toTimeString().split(' ')[0] : '00:00:00';
        const dateStr = dateObj.toLocaleDateString
          ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Oct 13, 2026';

        let resultLabel = 'Incorrect';
        if (
          item.status === SUBMISSION_STATUS.PENDING_REVIEW ||
          (!item.reviewed && !item.isCorrect)
        ) {
          resultLabel = 'Pending Review';
        } else if (item.isCorrect || item.status === SUBMISSION_STATUS.CORRECT) {
          resultLabel = 'Correct';
        } else if (item.status === SUBMISSION_STATUS.INCORRECT) {
          resultLabel = 'Incorrect';
        }

        const idStr = String(item._id);
        const displayId = `SUB-${idStr.slice(-4).toUpperCase()}`;

        return {
          id: displayId,
          rawId: idStr,
          team: item.teamId?.name || 'Unknown Team',
          teamCode: item.teamId?.joinCode || 'TEAM-??',
          question: item.questionId?.title || 'Challenge Question',
          challenge: item.challengeId?.title || `Level ${item.levelNumber} Challenge`,
          level: item.levelNumber,
          answer: item.submittedAnswer,
          result: resultLabel,
          points: item.pointsDelta || 0,
          maxPoints: item.questionId?.points || item.challengeId?.points || 100,
          submittedAt: timeStr,
          date: dateStr,
          attempts: 1,
          reviewed: Boolean(item.reviewed),
          reviewNote: item.reviewNote || '',
          reviewedBy: item.reviewedBy?.username || null,
          reviewedAt: item.reviewedAt || null,
          mode: item.questionId?.type || 'Text Answer',
          isLive: true
        };
      });

      // Search filtering across text fields if requested
      if (search && String(search).trim()) {
        const term = String(search).trim().toLowerCase();
        formatted = formatted.filter((item) =>
          [item.id, item.team, item.teamCode, item.question, item.challenge, item.answer].some(
            (val) => String(val || '').toLowerCase().includes(term)
          )
        );
      }

      return success(
        res,
        {
          submissions: formatted,
          stats: {
            total: totalGlobal,
            correct: correctGlobal,
            incorrect: incorrectGlobal,
            pending: pendingGlobal,
            totalPoints: totalPointsAwarded
          }
        },
        'Submissions log retrieved',
        200,
        { page, limit, total: totalMatching }
      );
    } catch (error) {
      return next(error);
    }
  }

  async reviewSubmission(req, res, next) {
    try {
      const { submissionId } = req.params;
      const { result, points, reviewNote } = req.body;
      const adminUserId = req.user.userId;

      // Handle rawId or displayId lookup
      let submission = null;
      if (mongoose.Types.ObjectId.isValid(submissionId)) {
        submission = await Submission.findById(submissionId)
          .populate('teamId')
          .populate('challengeId')
          .populate('questionId');
      } else {
        // Try looking up by ending 4 chars or ID
        const clean = String(submissionId).replace(/^SUB-/, '').toLowerCase();
        const allSubs = await Submission.find()
          .populate('teamId')
          .populate('challengeId')
          .populate('questionId')
          .sort({ submittedAt: -1 })
          .limit(200);
        submission = allSubs.find(
          (s) => String(s._id).toLowerCase().endsWith(clean)
        );
      }

      if (!submission) {
        return notFound(res, 'Submission record not found');
      }

      if (!['Correct', 'Incorrect'].includes(result)) {
        return badRequest(res, "Result must be 'Correct' or 'Incorrect'");
      }

      // Prevent duplicate points award if already approved and scored
      if (submission.reviewed && submission.isCorrect && result === 'Correct') {
        return badRequest(
          res,
          'Submission is already approved and scored. Duplicate scoring is forbidden.'
        );
      }

      const questionMaxPoints =
        submission.questionId?.points || submission.challengeId?.points || 100;
      let awardedPoints = 0;

      if (result === 'Correct') {
        awardedPoints =
          points !== undefined ? Math.max(0, Number(points)) : questionMaxPoints;
        if (Number.isNaN(awardedPoints)) {
          return badRequest(res, 'Awarded points must be a valid number');
        }
        if (awardedPoints > questionMaxPoints) {
          return badRequest(
            res,
            `Awarded points (${awardedPoints}) cannot exceed question max points (${questionMaxPoints})`
          );
        }
      }

      const previousPoints = submission.pointsDelta || 0;
      const pointsDiff = awardedPoints - previousPoints;

      // Update submission fields
      submission.reviewed = true;
      submission.reviewedBy = adminUserId;
      submission.reviewedAt = new Date();
      submission.reviewNote = reviewNote ? String(reviewNote).trim() : '';
      submission.isCorrect = result === 'Correct';
      submission.status =
        result === 'Correct'
          ? SUBMISSION_STATUS.CORRECT
          : SUBMISSION_STATUS.INCORRECT;
      submission.pointsDelta = awardedPoints;

      await submission.save();

      // If approved, update TeamChallenge and Team scores atomically
      if (result === 'Correct') {
        let tc = null;
        if (submission.teamChallengeId) {
          tc = await TeamChallenge.findById(submission.teamChallengeId);
        }
        if (!tc && submission.teamId && submission.challengeId) {
          tc = await TeamChallenge.findOne({
            teamId: submission.teamId._id,
            challengeId: submission.challengeId._id
          });
        }

        if (tc) {
          tc.status = 'SOLVED';
          tc.solvedAt = tc.solvedAt || new Date();
          tc.solvedByUserId = tc.solvedByUserId || submission.userId;
          tc.pointsAwarded = awardedPoints;
          await tc.save();
        }

        if (pointsDiff !== 0 && submission.teamId) {
          await Team.findByIdAndUpdate(submission.teamId._id, {
            $inc: { totalScore: pointsDiff },
            $set: { lastSolveTimestamp: new Date() }
          });

          await Score.findOneAndUpdate(
            { teamId: submission.teamId._id },
            {
              $inc: { currentScore: pointsDiff, solvedLevelsCount: 1 },
              $set: { lastSolveTimestamp: new Date() },
              $push: {
                history: {
                  levelNumber: submission.levelNumber,
                  challengeId: submission.challengeId?._id,
                  pointsAwarded: awardedPoints,
                  solvedAt: new Date(),
                  submissionId: submission._id
                }
              }
            },
            { upsert: true, new: true }
          );
        }
      } else if (previousPoints > 0 && submission.teamId) {
        // If reversing a previously awarded submission
        await Team.findByIdAndUpdate(submission.teamId._id, {
          $inc: { totalScore: -previousPoints }
        });

        await Score.findOneAndUpdate(
          { teamId: submission.teamId._id },
          { $inc: { currentScore: -previousPoints } }
        );

        if (submission.teamChallengeId) {
          const tc = await TeamChallenge.findById(submission.teamChallengeId);
          if (tc) {
            tc.pointsAwarded = Math.max(0, (tc.pointsAwarded || 0) - previousPoints);
            await tc.save();
          }
        }
      }

      logger.info(
        `[Admin Review] Submission ${submission._id} marked ${result} (${awardedPoints} pts) by Admin ${adminUserId}. Note: "${reviewNote || ''}"`
      );

      const dateObj = submission.submittedAt || new Date();
      const timeStr = dateObj.toTimeString ? dateObj.toTimeString().split(' ')[0] : '00:00:00';
      const dateStr = dateObj.toLocaleDateString
        ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Oct 13, 2026';

      const updatedRecord = {
        id: `SUB-${String(submission._id).slice(-4).toUpperCase()}`,
        rawId: String(submission._id),
        team: submission.teamId?.name || 'Unknown Team',
        teamCode: submission.teamId?.joinCode || 'TEAM-??',
        question: submission.questionId?.title || 'Challenge Question',
        challenge: submission.challengeId?.title || `Level ${submission.levelNumber} Challenge`,
        level: submission.levelNumber,
        answer: submission.submittedAnswer,
        result,
        points: awardedPoints,
        maxPoints: questionMaxPoints,
        submittedAt: timeStr,
        date: dateStr,
        attempts: 1,
        reviewed: true,
        reviewNote: submission.reviewNote || '',
        reviewedBy: req.user.username || 'Admin',
        reviewedAt: submission.reviewedAt,
        mode: submission.questionId?.type || 'Text Answer',
        isLive: true
      };

      return success(
        res,
        { submission: updatedRecord },
        `Submission marked ${result} with ${awardedPoints} points awarded.`
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


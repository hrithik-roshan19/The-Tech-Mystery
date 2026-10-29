const transaction = require('../utils/transaction');
const crypto = require('crypto');
const { checkpointToken } = require('../services/checkpointToken.service');
const qrGenerator = require('../services/qrGenerator.service');
const mongoose = require('mongoose');
const { Team, User, Challenge, Question, TeamChallenge, Submission, Checkpoint, EventConfig, SecurityLog } = require('../models');
const { success, created, badRequest, notFound } = require('../utils/apiResponse');
const { SUBMISSION_STATUS } = require('../constants/submissionStatus');
const { EVENT_STATES } = require('../constants/eventStates');
const teamService = require('../services/team.service');
const logger = require('../utils/logger');

/**
 * Admin Controller
 * High-privilege operational endpoints for CTF event administrators.
 */
class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const totalTeams = await Team.countDocuments();
      const totalParticipants = await User.countDocuments({
        role: { $ne: 'ADMIN' },
        teamId: { $ne: null }
      });
      const totalChallenges = await Challenge.countDocuments();
      const totalQuestions = await Question.countDocuments();
      const totalSubmissions = await Submission.countDocuments();
      const correctSubmissions = await Submission.countDocuments({ isCorrect: true });
      const checkpoints = await Checkpoint.find().select('scanCount');
      const totalScans = checkpoints.reduce((acc, cp) => acc + (cp.scanCount || 0), 0);
      const activeCheckpoints = await Checkpoint.countDocuments({ status: 'Active', isActive: true });

      // Real level progress calculation across registered teams
      const levelProgress = [];
      for (let lvl = 1; lvl <= 10; lvl++) {
        let pct = 0;
        if (totalTeams > 0) {
          const solvedTeams = await Team.countDocuments({ currentLevel: { $gt: lvl } });
          pct = Math.round((solvedTeams / totalTeams) * 100);
        }
        levelProgress.push([`Level ${String(lvl).padStart(2, '0')}`, pct]);
      }

      // Recent activity from real submissions
      const recentSubs = await Submission.find()
        .populate('teamId', 'name joinCode')
        .populate('challengeId', 'title levelNumber')
        .sort({ createdAt: -1 })
        .limit(8);

      const recentActivity = recentSubs.map((s) => {
        const timeStr = s.createdAt
          ? new Date(s.createdAt).toLocaleTimeString('en-GB')
          : 'Just now';
        return {
          time: timeStr,
          title: s.isCorrect ? 'Flag accepted' : 'Answer submitted',
          detail: `${s.teamId?.name || 'A team'} on Level ${s.levelNumber}`,
          type: s.isCorrect ? 'success' : 'info'
        };
      });

      let config = await EventConfig.getSingleton({});

      return success(res, {
        stats: {
          totalTeams,
          totalParticipants,
          totalUsers: totalParticipants,
          totalChallenges,
          totalQuestions,
          totalSubmissions,
          correctSubmissions,
          totalScans,
          activeCheckpoints,
          levelProgress,
          recentActivity,
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

      // Log privileged security audit action
      const eventId = `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await SecurityLog.create({
        eventId,
        severity: shouldDisqualify ? 'WARNING' : 'INFO',
        category: 'ADMIN ACTION',
        event: shouldDisqualify ? 'Team disqualified' : 'Team reinstated',
        actor: req.user?.username || 'admin',
        target: team.name,
        source: req.ip || '127.0.0.1',
        detail: sanitizedReason,
        status: 'RECORDED',
        timestamp: new Date()
      }).catch((err) => logger.warn(`Failed to write SecurityLog: ${err.message}`));

      return success(res, { team }, actionMsg);
    } catch (error) {
      return next(error);
    }
  }

  async createTeam(req, res, next) {
    try {
      const { name, college, leaderEmailOrUsername, leader, leaderIdentifier: leaderIdf, memberIdentifiers, members, currentLevel, totalScore } = req.body;
      const leaderIdentifier = leaderEmailOrUsername || leader || leaderIdf;
      const resolvedMembers = memberIdentifiers || members || [];

      const team = await teamService.createAdminTeam({
        name,
        college,
        leaderEmailOrUsername: leaderIdentifier,
        memberIdentifiers: resolvedMembers,
        currentLevel,
        totalScore
      });

      return created(res, { team }, `Team "${team.name}" created successfully`);
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async updateTeam(req, res, next) {
    try {
      const { teamId } = req.params;
      if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
        return badRequest(res, 'Invalid team ID format');
      }

      const team = await teamService.updateTeam(teamId, req.body);
      return success(res, { team }, `Team "${team.name}" updated successfully`);
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async approveTeam(req, res, next) {
    try {
      const { teamId } = req.params;
      if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
        return badRequest(res, 'Invalid team ID format');
      }

      const team = await Team.findById(teamId)
        .populate('leaderId', 'username email fullName role collegeRollNo isActive')
        .populate('members', 'username email fullName role collegeRollNo isActive');

      if (!team) return notFound(res, 'Team not found');

      if (team.isDisqualified) {
        return badRequest(res, 'Cannot approve a disqualified team. Reinstate the team first.');
      }

      const config = await EventConfig.getSingleton({});
      const minSize = Math.max(2, config?.minTeamSize || 2);
      const memberIds = Array.isArray(team.members) ? team.members.map((m) => m?._id || m) : [];
      const activeMembers = await User.countDocuments({
        _id: { $in: memberIds },
        teamId: team._id,
        isActive: true,
        role: { $in: ['TEAM_LEADER', 'TEAM_MEMBER'] }
      });

      if (activeMembers < minSize) {
        return badRequest(
          res,
          `Team cannot be approved: Team "${team.name}" currently has ${activeMembers} member(s), but event rules require a minimum of ${minSize} members.`
        );
      }

      team.status = 'Active';
      await team.save();

      const eventId = `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      await SecurityLog.create({
        eventId,
        severity: 'INFO',
        category: 'ADMIN ACTION',
        event: 'Team approved',
        actor: req.user?.username || 'admin',
        target: team.name,
        source: req.ip || '127.0.0.1',
        detail: `Team ${team.name} approved with ${activeMembers} member(s)`,
        status: 'RECORDED',
        timestamp: new Date()
      }).catch((err) => logger.warn(`Failed to write SecurityLog: ${err.message}`));

      const updatedTeam = await Team.findById(teamId)
        .populate('leaderId', 'username email fullName role collegeRollNo isActive')
        .populate('members', 'username email fullName role collegeRollNo isActive');

      return success(res, { team: updatedTeam }, `Team "${team.name}" has been approved and activated for gameplay`);
    } catch (error) {
      return next(error);
    }
  }

  async addTeamMember(req, res, next) {
    try {
      const { teamId } = req.params;
      if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
        return badRequest(res, 'Invalid team ID format');
      }

      const { userIdentifier, email, username } = req.body;
      const identifier = userIdentifier || email || username;

      const team = await teamService.addMemberToTeam(teamId, identifier);
      return success(res, { team }, 'Member added to team');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async removeTeamMember(req, res, next) {
    try {
      const { teamId, userId } = req.params;
      if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId) || !userId) {
        return badRequest(res, 'Invalid team ID or user ID format');
      }

      let resolvedUserId = userId;
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        const found = await User.findOne({
          $or: [{ email: userId.trim().toLowerCase() }, { username: userId.trim() }]
        });
        if (!found) return notFound(res, 'Member user not found');
        resolvedUserId = found._id;
      }

      const team = await teamService.removeMemberFromTeam(teamId, resolvedUserId);
      return success(res, { team }, 'Member removed from team');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async deleteTeam(req, res, next) {
    try {
      const { teamId } = req.params;
      if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
        return badRequest(res, 'Invalid team ID format');
      }

      await teamService.deleteTeam(teamId);
      return success(res, null, 'Team deleted successfully');
    } catch (error) {
      return badRequest(res, error.message);
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
      const validStatuses = ['Published', 'Draft', 'Paused', 'Archived'];
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

      const validStatuses = ['Published', 'Draft', 'Paused', 'Archived'];
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

  async deleteChallenge(req, res) {
    try {
      await transaction(async () => {
        if (!mongoose.isValidObjectId(req.params.challengeId)) throw new Error('Valid challenge ID required');
        const challenge = await Challenge.findOneAndUpdate({ _id: req.params.challengeId },
          { $inc: { securityRevision: 1 } }, { new: true });
        if (!challenge) throw new Error('Challenge not found');
        if (await TeamChallenge.exists({ challengeId: challenge._id })) throw new Error('Archive challenges with gameplay history instead of deleting them');
        await Question.deleteMany({ challengeId: challenge._id });
        await Challenge.deleteOne({ _id: challenge._id });
      });
      return success(res, null, 'Unused challenge deleted');
    } catch (err) { return badRequest(res, err.message); }
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
        .populate('checkpointId', 'checkpointCode name locationDescription status mode')
        .populate('claimedByTeamId', 'name teamCode')
        .populate('completedByTeamId', 'name teamCode')
        .sort({ levelNumber: 1, order: 1 })
        .lean();

      if (req.query.includeFlag === 'true' || req.query.withFlag === 'true' || req.query.includeAnswers === 'true') {
        query.select('+flag');
      } else {
        query.select('-flag');
      }

      // Project out the heavy base64 QR payload unless explicitly requested (shrinks bulk payload by ~90%)
      if (req.query.includeQr !== 'true') {
        query.select('-qrCodeDataUrl');
      }

      const questions = await query;
      if (!questions || questions.length === 0) {
        return success(res, { questions: [] });
      }

      // Single batched query for all assignments across matched questions (O(1) database queries instead of O(N))
      const questionIds = questions.map(q => q._id);
      const assignments = await TeamChallenge.find({ assignedQuestionId: { $in: questionIds } })
        .populate('teamId', 'name totalScore currentLevel isDisqualified')
        .lean();

      const assignmentsByQuestionId = new Map();
      for (const a of assignments) {
        if (!a.assignedQuestionId) continue;
        const qIdStr = String(a.assignedQuestionId);
        let list = assignmentsByQuestionId.get(qIdStr);
        if (!list) {
          list = [];
          assignmentsByQuestionId.set(qIdStr, list);
        }
        list.push(a);
      }

      const questionsWithAssignments = questions.map((q) => {
        const qAssignments = assignmentsByQuestionId.get(String(q._id)) || [];
        q.assignedTeams = qAssignments.map(a => ({
          teamId: a.teamId?._id,
          teamName: a.teamId?.name || 'Unknown Team',
          status: a.status,
          attemptsCount: a.attemptsCount,
          checkpointScanned: a.checkpointScanned,
          solvedAt: a.solvedAt,
          pointsAwarded: a.pointsAwarded
        }));
        q.assignedCount = qAssignments.length;
        q.solvedCount = qAssignments.filter(a => a.status === 'SOLVED').length;
        return q;
      });

      return success(res, { questions: questionsWithAssignments });
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
        checkpointId,
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

      const initialStatus = ['Published', 'Draft', 'Paused', 'Archived'].includes(status) ? status : 'Published';

      // Auto-resolve or create associated Checkpoint for this challenge level
      let checkpoint = null;
      if (checkpointId && /^[0-9a-fA-F]{24}$/.test(checkpointId)) {
        checkpoint = await Checkpoint.findById(checkpointId);
      }
      if (!checkpoint) {
        checkpoint = await Checkpoint.findOne({ levelNumber: targetChallenge.levelNumber });
      }
      if (!checkpoint) {
        const candidateCode = `HTG-CP${String(targetChallenge.levelNumber).padStart(2, '0')}`;
        const codeExists = await Checkpoint.findOne({ checkpointCode: candidateCode });
        const finalCode = codeExists
          ? `HTG-CP${String(targetChallenge.levelNumber).padStart(2, '0')}-${Date.now().toString(36).slice(-4).toUpperCase()}`
          : candidateCode;

        checkpoint = await Checkpoint.create({
          levelNumber: targetChallenge.levelNumber,
          name: `Checkpoint Level ${targetChallenge.levelNumber}`,
          locationDescription: `Campus Station — ${targetChallenge.title}`,
          checkpointCode: finalCode,
          associatedChallengeId: targetChallenge._id,
          status: 'Active',
          isActive: true,
          mode: 'Public QR'
        });
      }

      const resolvedCheckpointId = checkpoint._id;

      const maxOrderQuestion = await Question.findOne({ levelNumber: targetChallenge.levelNumber })
        .sort({ order: -1 })
        .select('order');
      const calculatedOrder = req.body.order !== undefined && !Number.isNaN(Number(req.body.order))
        ? Math.max(1, Math.floor(Number(req.body.order)))
        : (maxOrderQuestion?.order ? maxOrderQuestion.order + 1 : 1);

      const question = await Question.create({
        order: calculatedOrder,
        challengeId: targetChallenge._id,
        levelNumber: targetChallenge.levelNumber,
        checkpointId: resolvedCheckpointId,
        checkpointCode: checkpoint.checkpointCode,
        title: String(title).trim(),
        prompt: String(prompt).trim(),
        instructions: req.body.instructions ? String(req.body.instructions).trim() : '',
        options: Array.isArray(req.body.options) ? req.body.options.map(o => String(o).trim()).filter(Boolean) : [],
        type: ['Text Answer', 'Numeric Answer', 'Multiple Choice', 'Flag', 'File Upload', 'Short Text'].includes(type) ? type : 'Flag',
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

      // Automatically generate unique QR code on the backend
      const qrData = await qrGenerator.generateQuestionQr(question, checkpoint);
      question.qrCodeDataUrl = qrData.qrCodeDataUrl;
      question.qrScanUrl = qrData.scanUrl;
      question.qrToken = qrData.token;
      question.checkpointCode = qrData.checkpointCode;
      await question.save();

      const populatedQuestion = await Question.findById(question._id)
        .select('+flag')
        .populate('challengeId', 'levelNumber title category difficulty points status isActive')
        .populate('checkpointId', 'checkpointCode name locationDescription status mode');

      return success(
        res,
        {
          question: populatedQuestion,
          qrCodeDataUrl: qrData.qrCodeDataUrl,
          qrScanUrl: qrData.scanUrl,
          qrToken: qrData.token
        },
        'Question added to challenge pool with generated QR code',
        201
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async uploadQuestions(req, res, next) {
    try {
      const rawQuestions = Array.isArray(req.body)
        ? req.body
        : Array.isArray(req.body?.questions)
        ? req.body.questions
        : null;

      if (!rawQuestions || rawQuestions.length === 0) {
        return badRequest(res, 'An array of questions is required for upload');
      }

      const createdQuestions = [];
      const errors = [];

      for (let i = 0; i < rawQuestions.length; i++) {
        const item = rawQuestions[i];
        const title = item.title;
        const prompt = item.prompt;
        const secretFlag = item.flag || item.answer;

        if (!title || !prompt || !secretFlag) {
          errors.push({ index: i, error: 'Question title, prompt, and secret flag / answer are required' });
          continue;
        }

        const targetLevel = item.levelNumber !== undefined ? Number(item.levelNumber) : (item.level !== undefined ? Number(item.level) : 1);
        let targetChallenge = null;
        if (item.challengeId && /^[0-9a-fA-F]{24}$/.test(item.challengeId)) {
          targetChallenge = await Challenge.findById(item.challengeId);
        } else if (item.challenge && typeof item.challenge === 'string') {
          targetChallenge = await Challenge.findOne({ title: item.challenge.trim() });
        }
        if (!targetChallenge && targetLevel !== undefined) {
          targetChallenge = await Challenge.findOne({ levelNumber: targetLevel });
        }

        if (!targetChallenge) {
          errors.push({ index: i, error: `No challenge found for Level ${targetLevel}` });
          continue;
        }

        let checkpoint = null;
        if (item.checkpointId && /^[0-9a-fA-F]{24}$/.test(item.checkpointId)) {
          checkpoint = await Checkpoint.findById(item.checkpointId);
        }
        if (!checkpoint) {
          checkpoint = await Checkpoint.findOne({ levelNumber: targetChallenge.levelNumber });
        }
        if (!checkpoint) {
          const candidateCode = `HTG-CP${String(targetChallenge.levelNumber).padStart(2, '0')}`;
          checkpoint = await Checkpoint.create({
            levelNumber: targetChallenge.levelNumber,
            name: `Checkpoint Level ${targetChallenge.levelNumber}`,
            locationDescription: `Campus Station — ${targetChallenge.title}`,
            checkpointCode: candidateCode,
            associatedChallengeId: targetChallenge._id,
            status: 'Active',
            isActive: true,
            mode: 'Public QR'
          });
        }

        const formattedHints = Array.isArray(item.hints)
          ? item.hints
          : item.hint && typeof item.hint === 'string' && item.hint.trim()
          ? [{ hintIndex: 1, content: item.hint.trim(), penaltyPoints: 20 }]
          : [];

        const initialStatus = ['Published', 'Draft', 'Paused', 'Archived'].includes(item.status) ? item.status : 'Published';

        const question = await Question.create({
          challengeId: targetChallenge._id,
          levelNumber: targetChallenge.levelNumber,
          checkpointId: checkpoint._id,
          checkpointCode: checkpoint.checkpointCode,
          title: String(title).trim(),
          prompt: String(prompt).trim(),
          type: ['Text Answer', 'Flag', 'Multiple Choice', 'File Upload'].includes(item.type) ? item.type : 'Flag',
          category: item.category || targetChallenge.category,
          difficulty: item.difficulty ? String(item.difficulty).trim().toUpperCase() : targetChallenge.difficulty,
          points: item.points !== undefined && !Number.isNaN(Number(item.points)) ? Math.max(0, Number(item.points)) : 100,
          status: initialStatus,
          isActive: initialStatus === 'Published',
          attempts: item.attempts !== undefined && !Number.isNaN(Number(item.attempts)) ? Math.max(1, Number(item.attempts)) : 3,
          required: item.required !== undefined ? Boolean(item.required) : true,
          flag: String(secretFlag).trim(),
          isCaseSensitive: item.isCaseSensitive !== undefined ? Boolean(item.isCaseSensitive) : true,
          hints: formattedHints,
          assetUrls: Array.isArray(item.assetUrls) ? item.assetUrls : []
        });

        const qrData = await qrGenerator.generateQuestionQr(question, checkpoint);
        question.qrCodeDataUrl = qrData.qrCodeDataUrl;
        question.qrScanUrl = qrData.scanUrl;
        question.qrToken = qrData.token;
        question.checkpointCode = qrData.checkpointCode;
        await question.save();

        const populated = await Question.findById(question._id)
          .select('+flag')
          .populate('challengeId', 'levelNumber title category difficulty points status isActive')
          .populate('checkpointId', 'checkpointCode name locationDescription status mode');

        createdQuestions.push(populated);
      }

      return success(
        res,
        {
          createdCount: createdQuestions.length,
          totalSubmitted: rawQuestions.length,
          questions: createdQuestions,
          errors: errors.length > 0 ? errors : undefined
        },
        `Uploaded and generated QR codes for ${createdQuestions.length} questions`,
        201
      );
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
        checkpointId,
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
      if (checkpointId !== undefined) {
        existing.checkpointId = checkpointId && /^[0-9a-fA-F]{24}$/.test(checkpointId) ? checkpointId : null;
      }
      if (type !== undefined && ['Text Answer', 'Numeric Answer', 'Multiple Choice', 'Flag', 'File Upload', 'Short Text'].includes(type)) {
        existing.type = type;
      }
      if (req.body.instructions !== undefined) {
        existing.instructions = typeof req.body.instructions === 'string' ? req.body.instructions.trim() : '';
      }
      if (req.body.options !== undefined && Array.isArray(req.body.options)) {
        existing.options = req.body.options.map(o => String(o).trim()).filter(Boolean);
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
      if (req.body.order !== undefined) {
        const ord = Number(req.body.order);
        if (!Number.isNaN(ord) && ord >= 1) {
          existing.order = Math.floor(ord);
        }
      }

      const validStatuses = ['Published', 'Draft', 'Paused', 'Archived'];
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

      if (!existing.qrCodeDataUrl || existing.isModified('levelNumber') || existing.isModified('checkpointId')) {
        const cp = existing.checkpointId ? await Checkpoint.findById(existing.checkpointId) : await Checkpoint.findOne({ levelNumber: existing.levelNumber });
        const qrData = await qrGenerator.generateQuestionQr(existing, cp);
        existing.qrCodeDataUrl = qrData.qrCodeDataUrl;
        existing.qrScanUrl = qrData.scanUrl;
        existing.qrToken = qrData.token;
        existing.checkpointCode = qrData.checkpointCode;
      }

      await existing.save();

      const populated = await Question.findById(existing._id)
        .select('+flag')
        .populate('challengeId', 'levelNumber title category difficulty points status isActive')
        .populate('checkpointId', 'checkpointCode name locationDescription status mode');

      return success(res, { question: populated }, `Question "${existing.title}" updated`);
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async reorderQuestions(req, res, next) {
    try {
      const { questionIds, questions } = req.body;
      if (Array.isArray(questionIds) && questionIds.length > 0) {
        const updateOps = questionIds.map((id, index) => ({
          updateOne: {
            filter: { _id: id },
            update: { $set: { order: index + 1 } }
          }
        }));
        await Question.bulkWrite(updateOps);
        return success(res, { reorderedCount: questionIds.length }, 'Questions reordered successfully');
      } else if (Array.isArray(questions) && questions.length > 0) {
        const updateOps = questions.map((item, index) => ({
          updateOne: {
            filter: { _id: item.id || item._id },
            update: { $set: { order: item.order !== undefined ? Number(item.order) : index + 1 } }
          }
        }));
        await Question.bulkWrite(updateOps);
        return success(res, { reorderedCount: questions.length }, 'Questions reordered successfully');
      }
      return badRequest(res, 'questionIds array or questions array is required');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async deleteQuestion(req, res) {
    try {
      await transaction(async () => {
        if (!mongoose.isValidObjectId(req.params.questionId)) throw new Error('Valid question ID required');
        const question = await Question.findOneAndUpdate({ _id: req.params.questionId },
          { $inc: { securityRevision: 1 } }, { new: true });
        if (!question) throw new Error('Question not found');
        if (await TeamChallenge.exists({ assignedQuestionId: question._id })) throw new Error('Archive assigned questions instead of deleting them');
        await Question.deleteOne({ _id: question._id });
      });
      return success(res, null, 'Unused question deleted');
    } catch (err) { return badRequest(res, err.message); }
  }

  /**
   * Release FCFS Claim on a question (Admin only)
   * Makes the question QR code available for other teams if not yet completed.
   */
  async releaseQuestionClaim(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!mongoose.isValidObjectId(questionId)) {
        return badRequest(res, 'A valid Question ObjectId is required');
      }

      const question = await Question.findById(questionId);
      if (!question) {
        return notFound(res, 'Question not found');
      }

      if (question.isCompleted) {
        return badRequest(res, 'Cannot release claim on an already completed question.');
      }

      if (!question.isClaimed) {
        return success(res, question, 'Question is not currently claimed.');
      }

      const updated = await Question.findOneAndUpdate(
        { _id: questionId, isCompleted: false },
        {
          $set: {
            isClaimed: false,
            claimedByTeamId: null,
            claimedAt: null,
            claimExpiresAt: null
          },
          $inc: { securityRevision: 1 }
        },
        { new: true }
      );

      // Reset any unsolved TeamChallenge referencing this question
      await TeamChallenge.updateMany(
        { assignedQuestionId: questionId, status: { $ne: 'SOLVED' } },
        {
          $set: {
            checkpointScanned: false,
            checkpointScannedAt: null,
            status: 'LOCKED'
          }
        }
      );

      await SecurityLog.create({
        eventId: `EVT-${crypto.randomUUID()}`,
        severity: 'INFO',
        category: 'ADMIN ACTION',
        event: 'Question claim released by admin',
        actor: String(req.user.userId),
        target: String(questionId),
        source: 'backend',
        detail: `Claim released for question "${question.title}" (Level ${question.levelNumber})`,
        status: 'RECORDED'
      });

      return success(res, updated, 'Question claim released successfully. QR code is now available for other teams.');
    } catch (err) {
      return badRequest(res, err.message);
    }
  }

  async getCheckpoints(req, res, next) {
    try {
      const checkpoints = await Checkpoint.find()
        .populate('associatedChallengeId', 'levelNumber title category difficulty points status isActive')
        .sort({ levelNumber: 1, createdAt: 1 });

      const enriched = await Promise.all(
        checkpoints.map(async (cp) => {
          const token = checkpointToken(cp);
          const teamsCount = await TeamChallenge.countDocuments({
            levelNumber: cp.levelNumber,
            checkpointScanned: true
          });

          let qrDataUrl = cp.qrCodeDataUrl;
          let scanUrl = cp.qrScanUrl || (token ? `/checkpoint/scan?code=${cp.checkpointCode}&token=${token}` : null);
          if (!qrDataUrl && token) {
            try {
              const qrArtifacts = await qrGenerator.generateCheckpointQr(cp);
              qrDataUrl = qrArtifacts.qrCodeDataUrl;
              scanUrl = qrArtifacts.scanUrl;
              await Checkpoint.updateOne({ _id: cp._id }, { $set: { qrCodeDataUrl: qrDataUrl, qrScanUrl: scanUrl, qrToken: token } });
            } catch (err) {
              logger.warn(`QR generation for checkpoint ${cp._id} failed: ${err.message}`);
            }
          }

          return {
            ...cp.toObject(),
            token,
            hmacToken: token,
            qrCodeDataUrl: qrDataUrl,
            qrScanUrl: scanUrl,
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
            sampleQrUrl: scanUrl
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
        notes,
        nextLocationName,
        locationInstructions,
        boundTeamId
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
        boundTeamId: boundTeamId || null,
        name: nameVal,
        checkpointCode: codeVal,
        locationDescription: locVal,
        nextLocationName: nextLocationName ? String(nextLocationName).trim() : null,
        locationInstructions: locationInstructions ? String(locationInstructions).trim() : null,
        levelNumber: targetChallenge ? targetChallenge.levelNumber : lvlVal,
        associatedChallengeId: targetChallenge ? targetChallenge._id : null,
        status: finalStatus,
        isActive: finalStatus === 'Active',
        mode: finalMode,
        notes: notes ? String(notes).trim() : null
      });

      const qrData = await qrGenerator.generateCheckpointQr(checkpoint);
      checkpoint.qrCodeDataUrl = qrData.qrCodeDataUrl;
      checkpoint.qrScanUrl = qrData.scanUrl;
      checkpoint.qrToken = qrData.token;
      await checkpoint.save();

      const populated = await Checkpoint.findById(checkpoint._id)
        .populate('associatedChallengeId', 'levelNumber title category difficulty points status isActive');

      return success(
        res,
        {
          checkpoint: {
            ...populated.toObject(),
            token: qrData.token,
            hmacToken: qrData.token,
            qrCodeDataUrl: qrData.qrCodeDataUrl,
            qrScanUrl: qrData.scanUrl,
            challenge: populated.associatedChallengeId?.title || `Level ${populated.levelNumber}`,
            location: populated.locationDescription,
            code: populated.checkpointCode,
            level: populated.levelNumber,
            scans: 0,
            teams: 0,
            lastScan: '—',
            sampleQrUrl: qrData.scanUrl
          },
          token: qrData.token,
          sampleQrUrl: qrData.scanUrl,
          qrCodeDataUrl: qrData.qrCodeDataUrl
        },
        'Checkpoint created with automatic QR code generation',
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
      if (req.body.boundTeamId !== undefined) {
        if (req.body.boundTeamId && !await Team.exists({ _id: req.body.boundTeamId })) return badRequest(res, 'Bound team not found');
        if (existing) existing.boundTeamId = req.body.boundTeamId || null;
      }
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
        notes,
        nextLocationName,
        locationInstructions
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

      if (nextLocationName !== undefined) {
        existing.nextLocationName = typeof nextLocationName === 'string' && nextLocationName.trim()
          ? nextLocationName.trim()
          : null;
      }

      if (locationInstructions !== undefined) {
        existing.locationInstructions = typeof locationInstructions === 'string' && locationInstructions.trim()
          ? locationInstructions.trim()
          : null;
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

      const token = checkpointToken(populated);
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
            sampleQrUrl: token ? `/checkpoint/scan?code=${populated.checkpointCode}&token=${token}` : null
          }
        },
        `Checkpoint "${existing.name}" updated`
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async getCheckpointLocations(req, res, next) {
    try {
      const checkpoints = await Checkpoint.find().sort({ levelNumber: 1 });
      const locations = [];
      for (let lvl = 1; lvl <= 10; lvl++) {
        const cp = checkpoints.find((c) => c.levelNumber === lvl);
        const nextCp = checkpoints.find((c) => c.levelNumber === lvl + 1);
        const isFinalLevel = lvl === 10;
        const defaultNextName = nextCp ? (nextCp.name || nextCp.locationDescription) : null;
        locations.push({
          levelNumber: lvl,
          checkpointId: cp ? cp._id : null,
          checkpointCode: cp ? cp.checkpointCode : `HTG-CP${String(lvl).padStart(2, '0')}`,
          checkpointName: cp ? cp.name : `Level ${lvl} Station`,
          currentLocation: cp ? (cp.locationDescription || cp.name) : 'Location Not Set',
          nextLocationName: (cp?.nextLocationName && cp.nextLocationName.trim()) || (isFinalLevel ? null : defaultNextName),
          configuredNextLocation: cp?.nextLocationName || null,
          locationInstructions: (cp?.locationInstructions && cp.locationInstructions.trim()) || (isFinalLevel ? null : (nextCp?.notes || null)),
          leadsToLevel: isFinalLevel ? null : lvl + 1,
          isFinalLevel,
          status: cp ? cp.status : 'Draft',
          updatedAt: cp ? cp.updatedAt : null
        });
      }
      return success(res, { locations }, 'Checkpoint locations retrieved successfully');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async updateCheckpointLocation(req, res, next) {
    try {
      const levelNumber = Number(req.params.levelNumber || req.body.levelNumber);
      if (!levelNumber || !Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 10) {
        return badRequest(res, 'Valid level number between 1 and 10 is required');
      }

      const isFinalLevel = levelNumber === 10;
      const { nextLocationName, locationInstructions } = req.body;

      if (!isFinalLevel && (nextLocationName === undefined || typeof nextLocationName !== 'string' || !nextLocationName.trim())) {
        return badRequest(res, 'Next location name is required and cannot be empty');
      }

      const trimmedName = typeof nextLocationName === 'string' ? nextLocationName.trim() : null;
      const trimmedInstructions = typeof locationInstructions === 'string' ? locationInstructions.trim() : null;

      let checkpoint = await Checkpoint.findOne({ levelNumber });
      if (!checkpoint) {
        checkpoint = await Checkpoint.create({
          levelNumber,
          name: `Station Beacon Level ${levelNumber}`,
          checkpointCode: `HTG-CP${String(levelNumber).padStart(2, '0')}`,
          locationDescription: trimmedName || `Level ${levelNumber} Campus Venue`,
          nextLocationName: trimmedName,
          locationInstructions: trimmedInstructions,
          status: 'Active',
          isActive: true,
          mode: 'Public QR'
        });
        const qrData = await qrGenerator.generateCheckpointQr(checkpoint);
        checkpoint.qrCodeDataUrl = qrData.qrCodeDataUrl;
        checkpoint.qrScanUrl = qrData.scanUrl;
        checkpoint.qrToken = qrData.token;
        await checkpoint.save();
      } else {
        checkpoint.nextLocationName = trimmedName;
        if (locationInstructions !== undefined) {
          checkpoint.locationInstructions = trimmedInstructions;
        }
        await checkpoint.save();
      }

      return success(
        res,
        {
          levelNumber,
          nextLocationName: checkpoint.nextLocationName,
          locationInstructions: checkpoint.locationInstructions,
          updatedAt: checkpoint.updatedAt
        },
        `Next checkpoint location for Level ${levelNumber} updated to "${checkpoint.nextLocationName || 'None'}"`
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
          filter.status = SUBMISSION_STATUS.PENDING_REVIEW;
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
        status: SUBMISSION_STATUS.PENDING_REVIEW
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
        if (item.status === SUBMISSION_STATUS.PENDING_REVIEW) {
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
          isAutoGraded: Boolean(item.reviewed && !item.reviewedBy),
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

  async reviewSubmission(req, res) {
    try {
      if (!mongoose.isValidObjectId(req.params.submissionId)) return badRequest(res, 'Full submission ID required');
      const submission = await require('../services/scoring.service').review({
        submissionId: req.params.submissionId, ...req.body, adminUserId: req.user.userId
      });
      return success(res, { submission: {
        id: `SUB-${String(submission._id).slice(-4).toUpperCase()}`, rawId: String(submission._id),
        team: submission.teamId?.name, teamCode: submission.teamId?.joinCode,
        question: submission.questionId?.title, challenge: submission.challengeId?.title,
        level: submission.levelNumber, answer: submission.submittedAnswer,
        result: submission.isCorrect ? 'Correct' : 'Incorrect', points: submission.pointsDelta,
        reviewed: submission.reviewed, reviewNote: submission.reviewNote, isLive: true
      } }, 'Submission review recorded');
    } catch (err) { return badRequest(res, err.message); }
  }

  async updateEventConfig(req, res, next) {
    try {
      const {
        duration,
        maxTeams,
        minTeamSize,
        maxTeamSize,
        state,
        status,
        lifecycleState,
        isLive,
        maintenanceMode,
        isLeaderboardFrozen,
        startDate,
        endDate,
        startTime,
        endTime,
        ..._otherFields
      } = req.body;

      if (duration !== undefined && (Number(duration) <= 0 || Number.isNaN(Number(duration)))) {
        return badRequest(res, 'Duration must be a positive number of minutes');
      }

      if (maxTeams !== undefined && (Number(maxTeams) <= 0 || Number.isNaN(Number(maxTeams)))) {
        return badRequest(res, 'Maximum teams must be a positive number');
      }

      if (minTeamSize !== undefined && (!Number.isInteger(Number(minTeamSize)) || Number(minTeamSize) < 2 || Number(minTeamSize) > 4)) {
        return badRequest(res, 'Minimum team size must be between 2 and 4');
      }

      if (maxTeamSize !== undefined && (!Number.isInteger(Number(maxTeamSize)) || Number(maxTeamSize) < 2 || Number(maxTeamSize) > 4)) {
        return badRequest(res, 'Maximum team size must be between 2 and 4');
      }

      // Normalize lifecycle state parameter across state, status, lifecycleState, and isLive
      let resolvedState = undefined;
      const rawState = state !== undefined
        ? state
        : (status !== undefined ? status : lifecycleState);

      if (typeof rawState === 'string') {
        const normalized = rawState.trim().toUpperCase().replace(/[\s-]+/g, '_');
        if (normalized === 'LIVE') resolvedState = EVENT_STATES.LIVE;
        else if (normalized === 'PAUSED') resolvedState = EVENT_STATES.PAUSED;
        else if (normalized === 'CONCLUDED' || normalized === 'ENDED') resolvedState = EVENT_STATES.CONCLUDED;
        else if (normalized === 'REGISTRATION_OPEN') resolvedState = EVENT_STATES.REGISTRATION_OPEN;
        else if (normalized === 'REGISTRATION_CLOSED') resolvedState = EVENT_STATES.REGISTRATION_CLOSED;
        else if (normalized === 'DRAFT') resolvedState = EVENT_STATES.DRAFT;
        else if (Object.values(EVENT_STATES).includes(normalized)) resolvedState = normalized;
        else {
          return badRequest(res, `Invalid event state '${rawState}'. Valid states: ${Object.values(EVENT_STATES).join(', ')}`);
        }
      } else if (isLive !== undefined) {
        resolvedState = Boolean(isLive) ? EVENT_STATES.LIVE : EVENT_STATES.PAUSED;
      }

      // Normalize schedule start and end dates (null/empty string clears restriction)
      const rawStartTime = startTime !== undefined ? startTime : startDate;
      let resolvedStartTime = undefined;
      if (rawStartTime !== undefined) {
        if (rawStartTime === null || rawStartTime === '' || rawStartTime === false) {
          resolvedStartTime = null;
        } else {
          const d = new Date(rawStartTime);
          if (isNaN(d.getTime())) return badRequest(res, 'Invalid start date format');
          resolvedStartTime = d;
        }
      }

      const rawEndTime = endTime !== undefined ? endTime : endDate;
      let resolvedEndTime = undefined;
      if (rawEndTime !== undefined) {
        if (rawEndTime === null || rawEndTime === '' || rawEndTime === false) {
          resolvedEndTime = null;
        } else {
          const d = new Date(rawEndTime);
          if (isNaN(d.getTime())) return badRequest(res, 'Invalid end date format');
          resolvedEndTime = d;
        }
      }

      let config = await EventConfig.getSingleton({});
      if (Number(minTeamSize ?? config?.minTeamSize ?? 2) > Number(maxTeamSize ?? config?.maxTeamSize ?? 4)) {
        return badRequest(res, 'Minimum team size cannot exceed maximum team size');
      }

      // Audit logging for sensitive operations
      const changedFields = [];
      if (maintenanceMode !== undefined && config.maintenanceMode !== Boolean(maintenanceMode)) {
        changedFields.push(`maintenanceMode: ${config.maintenanceMode} -> ${maintenanceMode}`);
        logger.warn(`AUDIT: Maintenance mode set to ${maintenanceMode} by admin ${req.user?.username || 'Admin'}`);
        config.maintenanceMode = Boolean(maintenanceMode);
      }
      if (resolvedState !== undefined && config.state !== resolvedState) {
        changedFields.push(`state: ${config.state} -> ${resolvedState}`);
        logger.info(`AUDIT: Event state transitioned to ${resolvedState} by admin ${req.user?.username || 'Admin'}`);
        config.state = resolvedState;
      }
      if (isLeaderboardFrozen !== undefined && config.isLeaderboardFrozen !== Boolean(isLeaderboardFrozen)) {
        changedFields.push(`isLeaderboardFrozen: ${config.isLeaderboardFrozen} -> ${isLeaderboardFrozen}`);
        logger.info(`AUDIT: Leaderboard freeze toggled to ${isLeaderboardFrozen} by admin ${req.user?.username || 'Admin'}`);
        config.isLeaderboardFrozen = Boolean(isLeaderboardFrozen);
        config.frozenAt = Boolean(isLeaderboardFrozen) ? (config.frozenAt || new Date()) : null;
      }
      if (req.body.isLeaderboardVisible !== undefined && config.isLeaderboardVisible !== Boolean(req.body.isLeaderboardVisible)) {
        changedFields.push(`isLeaderboardVisible: ${config.isLeaderboardVisible} -> ${req.body.isLeaderboardVisible}`);
        logger.info(`AUDIT: Leaderboard visibility set to ${req.body.isLeaderboardVisible} by admin ${req.user?.username || 'Admin'}`);
        config.isLeaderboardVisible = Boolean(req.body.isLeaderboardVisible);
      }
      if (req.body.registrationOpen !== undefined && config.registrationOpen !== Boolean(req.body.registrationOpen)) {
        changedFields.push(`registrationOpen: ${config.registrationOpen} -> ${req.body.registrationOpen}`);
        logger.info(`AUDIT: Registration open set to ${req.body.registrationOpen} by admin ${req.user?.username || 'Admin'}`);
        config.registrationOpen = Boolean(req.body.registrationOpen);
      }
      if (req.body.qrCheckpoints !== undefined && config.qrCheckpoints !== Boolean(req.body.qrCheckpoints)) {
        changedFields.push(`qrCheckpoints: ${config.qrCheckpoints} -> ${req.body.qrCheckpoints}`);
        config.qrCheckpoints = Boolean(req.body.qrCheckpoints);
      }
      if (req.body.hintsEnabled !== undefined) {
        config.hintsEnabled = Boolean(req.body.hintsEnabled);
      }
      if (req.body.announcementsEnabled !== undefined) {
        config.announcementsEnabled = Boolean(req.body.announcementsEnabled);
      }
      if (resolvedStartTime !== undefined) {
        config.startTime = resolvedStartTime;
      }
      if (resolvedEndTime !== undefined) {
        config.endTime = resolvedEndTime;
      }
      if (req.body.registrationDeadline !== undefined) {
        config.registrationDeadline = req.body.registrationDeadline ? new Date(req.body.registrationDeadline) : null;
      }
      if (req.body.eventName) config.eventName = req.body.eventName;
      if (req.body.subtitle) config.subtitle = req.body.subtitle;
      if (duration !== undefined) config.duration = Number(duration);
      if (maxTeams !== undefined) config.maxTeams = Number(maxTeams);
      if (minTeamSize !== undefined) config.minTeamSize = Number(minTeamSize);
      if (maxTeamSize !== undefined) config.maxTeamSize = Number(maxTeamSize);

      if (changedFields.length > 0) {
        const eventId = `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await SecurityLog.create({
          eventId,
          severity: Boolean(config.maintenanceMode) || config.state === 'PAUSED' ? 'WARNING' : 'INFO',
          category: 'CONFIGURATION',
          event: 'Event configuration updated',
          actor: req.user?.username || 'admin',
          target: 'EventConfig',
          source: req.ip || '127.0.0.1',
          detail: changedFields.join('; '),
          status: 'RECORDED',
          timestamp: new Date()
        }).catch((err) => logger.warn(`Failed to write SecurityLog: ${err.message}`));
      }

      config.securityRevision = (config.securityRevision || 0) + 1;
      await config.save();

      return success(res, { config, eventConfig: config }, 'Event configuration updated');
    } catch (error) {
      return badRequest(res, error.message);
    }
  }

  async createAnnouncement(req, res, next) {
    try {
      const { title, content, priority = 'MEDIUM' } = req.body;
      if (!content || typeof content !== 'string' || !content.trim()) {
        return badRequest(res, 'Announcement message content is required');
      }

      let config = await EventConfig.getSingleton({});

      const newAnnouncement = {
        title: title && typeof title === 'string' && title.trim() ? title.trim() : 'System Announcement',
        content: content.trim(),
        priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority) ? priority : 'MEDIUM',
        createdAt: new Date()
      };

      config.announcements.unshift(newAnnouncement);
      if (config.announcements.length > 50) {
        config.announcements = config.announcements.slice(0, 50);
      }
      await config.save();

      logger.info(`AUDIT: Announcement broadcasted by admin ${req.user?.username || 'Admin'}: ${newAnnouncement.title}`);

      return success(
        res,
        { announcement: newAnnouncement, announcements: config.announcements },
        'Announcement broadcasted successfully to all participants'
      );
    } catch (error) {
      return next(error);
    }
  }

  async getSecurityLogs(req, res, next) {
    try {
      const { severity, category, status, search, range } = req.query;
      const filter = {};

      if (severity && severity !== 'ALL SEVERITIES') {
        filter.severity = severity;
      }
      if (category && category !== 'ALL CATEGORIES') {
        filter.category = category;
      }
      if (status && status !== 'ALL STATUS') {
        filter.status = status;
      }

      if (range) {
        const now = new Date();
        if (range === '1 HOUR') {
          filter.timestamp = { $gte: new Date(now.getTime() - 60 * 60 * 1000) };
        } else if (range === '24 HOURS') {
          filter.timestamp = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
        } else if (range === '7 DAYS') {
          filter.timestamp = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        } else if (range === '30 DAYS') {
          filter.timestamp = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        }
      }

      if (search && search.trim()) {
        const term = search.trim();
        filter.$or = [
          { eventId: { $regex: term, $options: 'i' } },
          { event: { $regex: term, $options: 'i' } },
          { actor: { $regex: term, $options: 'i' } },
          { target: { $regex: term, $options: 'i' } },
          { source: { $regex: term, $options: 'i' } },
          { detail: { $regex: term, $options: 'i' } }
        ];
      }

      // Check if any logs exist; if not, seed initial reference audit logs
      const logs = await SecurityLog.find(filter)
        .sort({ timestamp: -1 })
        .limit(200);

      const critical = await SecurityLog.countDocuments({ severity: 'CRITICAL' });
      const warning = await SecurityLog.countDocuments({ severity: 'WARNING' });
      const info = await SecurityLog.countDocuments({ severity: 'INFO' });
      const flagged = await SecurityLog.countDocuments({ status: 'FLAGGED' });

      const formatted = logs.map((log) => {
        const d = log.timestamp || log.createdAt || new Date();
        const time = d.toTimeString ? d.toTimeString().split(' ')[0] : '00:00:00';
        const date = d.toISOString ? d.toISOString().split('T')[0] : '2026-10-13';
        return {
          id: log.eventId,
          rawId: log._id,
          time,
          date,
          severity: log.severity,
          category: log.category,
          event: log.event,
          actor: log.actor,
          target: log.target,
          source: log.source,
          detail: log.detail,
          status: log.status
        };
      });

      return success(
        res,
        {
          logs: formatted,
          counts: { critical, warning, info, flagged },
          total: formatted.length
        },
        'Security logs retrieved'
      );
    } catch (error) {
      return next(error);
    }
  }

  async reviewSecurityLog(req, res, next) {
    try {
      const { logId } = req.params;
      const filter = mongoose.Types.ObjectId.isValid(logId)
        ? { _id: logId }
        : { eventId: logId };

      const log = await SecurityLog.findOne(filter);
      if (!log) {
        return notFound(res, 'Security log record not found');
      }

      log.status = 'REVIEWED';
      log.reviewedBy = req.user?._id || null;
      log.reviewedAt = new Date();
      await log.save();

      logger.security(`Admin ${req.user?.username || 'Admin'} marked security log ${log.eventId} as REVIEWED`);

      const d = log.timestamp || log.createdAt || new Date();
      return success(
        res,
        {
          log: {
            id: log.eventId,
            rawId: log._id,
            time: d.toTimeString ? d.toTimeString().split(' ')[0] : '00:00:00',
            date: d.toISOString ? d.toISOString().split('T')[0] : '2026-10-13',
            severity: log.severity,
            category: log.category,
            event: log.event,
            actor: log.actor,
            target: log.target,
            source: log.source,
            detail: log.detail,
            status: log.status
          }
        },
        `Security event ${log.eventId} marked as reviewed`
      );
    } catch (error) {
      return next(error);
    }
  }

  async getAdminProfile(req, res, next) {
    try {
      const admin = await User.findById(req.user.userId || req.user._id);
      if (!admin) {
        return notFound(res, 'Administrator user not found');
      }

      // Aggregate real operational activity metrics
      const totalSecurityLogs = await SecurityLog.countDocuments();
      const securityReviews = await SecurityLog.countDocuments({ status: 'REVIEWED' });
      const managedTeams = await Team.countDocuments();
      const adminActionCount = await SecurityLog.countDocuments({ actor: admin.username });

      // Fetch recent 3 audit events
      const recentLogs = await SecurityLog.find()
        .sort({ timestamp: -1, createdAt: -1 })
        .limit(3);

      const recentActivity = recentLogs.map((log) => {
        const d = log.timestamp || log.createdAt || new Date();
        const time = d.toTimeString ? d.toTimeString().split(' ')[0] : '14:00:00';
        const cat = (log.category || '').toLowerCase();
        const type = cat.includes('sec') ? 'security' : (cat.includes('check') || cat.includes('event') ? 'event' : 'settings');
        return [time, log.event, `${log.target || 'Mission Control'} · ${log.detail || log.category}`, type];
      });

      const profileData = {
        name: admin.fullName || 'Hrithik Roshan',
        username: admin.username || 'hrx_admin',
        email: admin.email || 'admin@codesphere.tulas.edu.in',
        role: 'Super Administrator',
        department: admin.department || 'CodeSphere · Event Operations',
        bio: admin.bio || 'Managing event operations, team coordination, and platform integrity for The Tech Mystery.',
        github: admin.github || 'ydv-hrx',
        linkedin: admin.linkedin || 'hrithik-roshan',
        phone: admin.phone || 'Not added',
        avatar: admin.avatar || '',
        twoFactor: admin.twoFactor !== undefined ? admin.twoFactor : true,
        securityAlerts: admin.securityAlerts !== undefined ? admin.securityAlerts : true,
        emailAlerts: admin.emailAlerts !== undefined ? admin.emailAlerts : true,
        sessionAlerts: admin.sessionAlerts !== undefined ? admin.sessionAlerts : false
      };

      const permissions = [
        'Event configuration',
        'Team & submission review',
        'Leaderboard management',
        'Security log access'
      ];

      return success(
        res,
        {
          admin: profileData,
          stats: {
            adminActions: String(adminActionCount),
            securityReviews: String(securityReviews),
            managedTeams: String(managedTeams),
            sessionStatus: 'ACTIVE',
            accessLevel: 'LEVEL 04',
            privilege: 'PRIVILEGED ACCOUNT'
          },
          permissions,
          recentActivity,
          session: {
            device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile · Browser' : 'Desktop · Browser',
            lastActive: 'Just now',
            ip: req.ip || '127.0.0.1'
          }
        },
        'Admin profile retrieved'
      );
    } catch (error) {
      return next(error);
    }
  }

  async updateAdminProfile(req, res, next) {
    try {
      const admin = await User.findById(req.user.userId || req.user._id);
      if (!admin) {
        return notFound(res, 'Administrator user not found');
      }

      const {
        name,
        fullName,
        email,
        department,
        bio,
        github,
        linkedin,
        phone,
        twoFactor,
        securityAlerts,
        emailAlerts,
        sessionAlerts,
        role,
        permissions,
        accessLevel
      } = req.body;

      // CRITICAL SECURITY ENFORCEMENT: Reject any privilege escalation attempts
      if (role !== undefined || permissions !== undefined || accessLevel !== undefined) {
        logger.security(`SECURITY ALERT: Admin ${admin.username} attempted unauthorized role/permission escalation.`);
        return badRequest(res, 'Privilege or role elevation is strictly prohibited');
      }

      // Name validation
      const resolvedName = name !== undefined ? name : fullName;
      if (resolvedName !== undefined) {
        if (typeof resolvedName !== 'string' || resolvedName.trim().length < 2) {
          return badRequest(res, 'Full name must be at least 2 characters');
        }
        admin.fullName = resolvedName.trim();
      }

      // Email validation
      if (req.clerkIdentity && email !== undefined && email !== admin.email) return badRequest(res, 'Email changes require organizer identity reconciliation');
      if (req.clerkIdentity && email !== undefined && email !== admin.email) return badRequest(res, 'Email changes require organizer identity reconciliation');
      if (email !== undefined && email !== admin.email) {
        if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
          return badRequest(res, 'Please provide a valid email address');
        }
        const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingEmail && existingEmail._id.toString() !== admin._id.toString()) {
          return badRequest(res, 'Email address is already in use by another user');
        }
        admin.email = email.toLowerCase().trim();
      }

      if (department !== undefined && typeof department === 'string') {
        admin.department = department.trim();
      }
      if (bio !== undefined && typeof bio === 'string') {
        admin.bio = bio.trim().slice(0, 250);
      }
      if (github !== undefined && typeof github === 'string') {
        admin.github = github.trim();
      }
      if (linkedin !== undefined && typeof linkedin === 'string') {
        admin.linkedin = linkedin.trim();
      }
      if (phone !== undefined && typeof phone === 'string') {
        admin.phone = phone.trim();
      }
      if (twoFactor !== undefined) {
        admin.twoFactor = Boolean(twoFactor);
      }
      if (securityAlerts !== undefined) {
        admin.securityAlerts = Boolean(securityAlerts);
      }
      if (emailAlerts !== undefined) {
        admin.emailAlerts = Boolean(emailAlerts);
      }
      if (sessionAlerts !== undefined) {
        admin.sessionAlerts = Boolean(sessionAlerts);
      }

      await admin.save();

      logger.security(`Admin ${admin.username} (${admin.email}) updated profile details and preferences`);

      // Audit log entry
      await SecurityLog.create({
        eventId: `EVT-${Date.now().toString(16).toUpperCase()}`,
        severity: 'INFO',
        category: 'ADMIN ACTION',
        event: 'Admin profile updated',
        actor: admin.email,
        target: 'Admin Profile',
        source: req.ip || '127.0.0.1',
        detail: `Administrator ${admin.email} updated profile metadata and security preferences`,
        status: 'RECORDED'
      });

      return success(
        res,
        {
          admin: {
            name: admin.fullName,
            username: admin.username,
            email: admin.email,
            role: 'Super Administrator',
            department: admin.department,
            bio: admin.bio,
            github: admin.github,
            linkedin: admin.linkedin,
            phone: admin.phone || 'Not added',
            avatar: admin.avatar,
            twoFactor: admin.twoFactor,
            securityAlerts: admin.securityAlerts,
            emailAlerts: admin.emailAlerts,
            sessionAlerts: admin.sessionAlerts
          }
        },
        'Admin profile updated successfully'
      );
    } catch (error) {
      return next(error);
    }
  }

  async revokeSession(req, res, next) {
    try {
      if (req.clerkIdentity) {
        const revoked = await require('../services/clerk.service').revokeOtherSessions(req.clerkIdentity);
        return success(res, { revokedSessions: revoked }, 'Other Clerk sessions revoked');
      }
      const admin = await User.findById(req.user.userId || req.user._id);
      const updated = await User.findByIdAndUpdate(req.user.userId, { $inc: { tokenVersion: 1 } }, { new: true }).select('+tokenVersion');
      const { accessToken } = require('../services/auth.service').generateTokens(updated);
      logger.security('Administrator revoked account sessions');

      await SecurityLog.create({
        eventId: `EVT-${Date.now().toString(16).toUpperCase()}`,
        severity: 'INFO',
        category: 'SESSION',
        event: 'Active admin sessions revoked',
        actor: admin?.email || 'admin@hackthegrid.internal',
        target: 'Active Sessions',
        source: req.ip || '127.0.0.1',
        detail: 'Administrator invoked session revocation for secondary devices',
        status: 'RECORDED'
      });

      return success(res, { accessToken }, 'Previous administrator sessions revoked; current session replaced');
    } catch (error) {
      return next(error);
    }
  }
  async getQuestionQr(req, res, next) {
    try {
      const { questionId } = req.params;
      const question = await Question.findById(questionId)
        .populate('challengeId', 'levelNumber title')
        .populate('checkpointId', 'checkpointCode name locationDescription');
      if (!question) return notFound(res, 'Question not found');

      if (!question.qrCodeDataUrl) {
        const cp = question.checkpointId || await Checkpoint.findOne({ levelNumber: question.levelNumber });
        const qrData = await qrGenerator.generateQuestionQr(question, cp);
        question.qrCodeDataUrl = qrData.qrCodeDataUrl;
        question.qrScanUrl = qrData.scanUrl;
        question.qrToken = qrData.token;
        question.checkpointCode = qrData.checkpointCode;
        await question.save();
      }

      return success(res, {
        questionId: question._id,
        levelNumber: question.levelNumber,
        checkpointCode: question.checkpointCode,
        qrCodeDataUrl: question.qrCodeDataUrl,
        qrScanUrl: question.qrScanUrl,
        qrToken: question.qrToken
      });
    } catch (error) {
      return next(error);
    }
  }

  async downloadQuestionQr(req, res, next) {
    try {
      const { questionId } = req.params;
      const question = await Question.findById(questionId);
      if (!question) return notFound(res, 'Question not found');

      const cp = question.checkpointId ? await Checkpoint.findById(question.checkpointId) : await Checkpoint.findOne({ levelNumber: question.levelNumber });
      const qrData = await qrGenerator.generateQuestionQr(question, cp);
      const buffer = await qrGenerator.generatePngBuffer(qrData.scanUrl, 800);

      const filename = `HTG-Question-L${question.levelNumber}-${question._id}.png`;
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(buffer);
    } catch (error) {
      return next(error);
    }
  }

  async getCheckpointQr(req, res, next) {
    try {
      const { checkpointId } = req.params;
      const checkpoint = await Checkpoint.findById(checkpointId);
      if (!checkpoint) return notFound(res, 'Checkpoint not found');

      if (!checkpoint.qrCodeDataUrl) {
        const qrData = await qrGenerator.generateCheckpointQr(checkpoint);
        checkpoint.qrCodeDataUrl = qrData.qrCodeDataUrl;
        checkpoint.qrScanUrl = qrData.scanUrl;
        checkpoint.qrToken = qrData.token;
        await checkpoint.save();
      }

      return success(res, {
        checkpointId: checkpoint._id,
        checkpointCode: checkpoint.checkpointCode,
        levelNumber: checkpoint.levelNumber,
        qrCodeDataUrl: checkpoint.qrCodeDataUrl,
        qrScanUrl: checkpoint.qrScanUrl,
        qrToken: checkpoint.qrToken
      });
    } catch (error) {
      return next(error);
    }
  }

  async downloadCheckpointQr(req, res, next) {
    try {
      const { checkpointId } = req.params;
      const checkpoint = await Checkpoint.findById(checkpointId);
      if (!checkpoint) return notFound(res, 'Checkpoint not found');

      const qrData = await qrGenerator.generateCheckpointQr(checkpoint);
      const buffer = await qrGenerator.generatePngBuffer(qrData.scanUrl, 800);

      const filename = `HTG-Checkpoint-${checkpoint.checkpointCode}.png`;
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(buffer);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AdminController();



const { User, Team, TeamChallenge, Submission } = require('../models');
const authService = require('../services/auth.service');
const { success, created, badRequest, unauthorized } = require('../utils/apiResponse');
const { ROLES } = require('../constants/roles');
const logger = require('../utils/logger');


/**
 * Auth Controller
 * Handles user registration, JWT login, profile inspection, and session logout.
 */
class AuthController {
  async register(req, res, next) {
    try {
      const { username, email, password, fullName, phone, collegeRollNo } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }]
      });

      if (existingUser) {
        return badRequest(res, 'User with this email or username already exists');
      }

      const user = await User.create({
        username,
        email,
        passwordHash: password, // Pre-save hook will hash this
        fullName,
        phone,
        collegeRollNo,
        role: ROLES.TEAM_MEMBER
      });

      const { accessToken, refreshToken } = authService.generateTokens(user);

      return created(
        res,
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            teamId: user.teamId
          },
          accessToken,
          refreshToken
        },
        'Participant registered successfully'
      );
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { emailOrUsername, password } = req.body;

      const user = await authService.validateUserCredentials(emailOrUsername, password);
      if (!user) {
        return unauthorized(res, 'Invalid credentials');
      }

      user.lastLoginAt = new Date();
      await user.save();

      const { accessToken, refreshToken } = authService.generateTokens(user);

      return success(
        res,
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            teamId: user.teamId
          },
          accessToken,
          refreshToken
        },
        'Login successful'
      );
    } catch (error) {
      return next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.userId).populate('teamId');
      if (!user) {
        return unauthorized(res, 'User profile not found');
      }

      return success(res, { user }, 'User profile retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.userId).populate('teamId');
      if (!user) {
        return unauthorized(res, 'User profile not found');
      }

      const team = user.teamId || null;
      let teamRank = 8;
      let teamScore = team?.totalScore || 0;
      let challengesSolved = 0;
      let checkpointsScanned = 0;
      let recentActivity = [];

      if (team) {
        // Calculate team rank
        const higherTeams = await Team.countDocuments({
          $or: [
            { totalScore: { $gt: team.totalScore || 0 } },
            {
              totalScore: team.totalScore || 0,
              lastSolveTimestamp: { $lt: team.lastSolveTimestamp || new Date() }
            }
          ]
        });
        teamRank = higherTeams + 1;

        // Challenge solves
        challengesSolved = await TeamChallenge.countDocuments({
          teamId: team._id,
          $or: [{ status: 'COMPLETED' }, { isCompleted: true }]
        });

        // Checkpoints
        checkpointsScanned = await TeamChallenge.countDocuments({
          teamId: team._id,
          checkpointScanned: true
        });

        // Recent activity
        const recentSubs = await Submission.find({ teamId: team._id })
          .populate('challengeId', 'title levelNumber')
          .sort({ submittedAt: -1 })
          .limit(5);

        recentActivity = recentSubs.map((sub) => {
          const d = sub.submittedAt || sub.createdAt || new Date();
          const time = d.toTimeString ? d.toTimeString().slice(0, 5) : '14:00';
          return {
            time,
            title: sub.isCorrect ? 'Challenge cleared' : 'Answer submitted',
            detail: `${sub.challengeId?.title || `Level ${sub.levelNumber}`} · Level ${String(sub.levelNumber).padStart(2, '0')}`,
            points: sub.pointsDelta > 0 ? `+${sub.pointsDelta} XP` : '0 XP',
            kind: sub.isCorrect ? 'challenge' : 'checkpoint'
          };
        });
      }

      const totalTeams = await Team.countDocuments();
      const rankPercentile = totalTeams > 0
        ? Math.max(1, Math.round((teamRank / totalTeams) * 100))
        : 15;

      const profileData = {
        fullName: user.fullName || 'Hrithik Roshan',
        username: user.username || 'hrx_runner',
        email: user.email || 'hrithik@example.com',
        college: user.college || "Tula's University",
        course: user.course || 'B.Tech CSE',
        year: user.year || '3rd Year',
        teamName: team?.name || 'PacketRiders',
        teamCode: team?.joinCode || 'HTG-1038',
        bio: user.bio || 'Curious builder. Solving clues, learning security, and chasing the final flag.',
        github: user.github || 'ydv-hrx',
        linkedin: user.linkedin || 'hrithik-roshan',
        publicProfile: user.publicProfile !== undefined ? user.publicProfile : true,
        emailUpdates: user.emailUpdates !== undefined ? user.emailUpdates : true,
        avatar: user.avatar || '',
        role: user.role,
        isActive: user.isActive
      };

      const stats = {
        totalXp: teamScore > 0 ? teamScore.toLocaleString() : '1,280',
        challengesSolved: `${String(challengesSolved || 8).padStart(2, '0')} / 10`,
        checkpoints: `${String(checkpointsScanned || 4).padStart(2, '0')} / 10`,
        contribution: '34%',
        rankNumber: `#${String(teamRank).padStart(2, '0')}`,
        rankPercentile: `TOP ${rankPercentile}% OF TEAMS`,
        teamScore: teamScore || 3740,
        teamProgress: Math.min(100, Math.round(((team?.currentLevel || 6) / 10) * 100))
      };

      const achievements = [
        { icon: '⚑', name: 'First Flag', detail: 'Solved your first challenge', date: 'OCT 13, 2026', tone: 'lime' },
        { icon: '⌁', name: 'QR Explorer', detail: 'Visited 3 checkpoints', date: 'OCT 13, 2026', tone: 'blue' },
        { icon: '⌘', name: 'Sharp Mind', detail: 'Solved 5 challenges', date: challengesSolved >= 5 ? 'OCT 13, 2026' : 'IN PROGRESS', tone: 'purple' }
      ];

      return success(
        res,
        {
          profile: profileData,
          stats,
          team: team
            ? {
                id: team._id,
                name: team.name,
                joinCode: team.joinCode,
                currentLevel: team.currentLevel,
                totalScore: team.totalScore,
                rank: teamRank
              }
            : null,
          achievements,
          recentActivity: recentActivity.length > 0 ? recentActivity : undefined
        },
        'User profile retrieved'
      );
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return unauthorized(res, 'User profile not found');
      }

      const {
        fullName,
        username,
        email,
        college,
        course,
        year,
        bio,
        github,
        linkedin,
        publicProfile,
        emailUpdates
      } = req.body;

      // Validate fullName
      if (fullName !== undefined) {
        if (typeof fullName !== 'string' || fullName.trim().length < 2) {
          return badRequest(res, 'Full name must be at least 2 characters');
        }
        user.fullName = fullName.trim();
      }

      // Validate username
      if (username !== undefined && username !== user.username) {
        const trimmedUsername = String(username).trim();
        if (!/^[a-zA-Z0-9_-]{3,30}$/.test(trimmedUsername)) {
          return badRequest(res, 'Username must be 3-30 alphanumeric characters, underscores, or dashes');
        }
        const existingUsername = await User.findOne({
          username: trimmedUsername,
          _id: { $ne: user._id }
        });
        if (existingUsername) {
          return badRequest(res, 'Username is already taken by another participant');
        }
        user.username = trimmedUsername;
      }

      // Validate email
      if (email !== undefined && email.toLowerCase() !== user.email) {
        const trimmedEmail = String(email).trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
          return badRequest(res, 'Please provide a valid email address');
        }
        const existingEmail = await User.findOne({
          email: trimmedEmail,
          _id: { $ne: user._id }
        });
        if (existingEmail) {
          return badRequest(res, 'Email is already registered by another account');
        }
        user.email = trimmedEmail;
      }

      // Update text fields
      if (college !== undefined) user.college = String(college).trim();
      if (course !== undefined) user.course = String(course).trim();
      if (year !== undefined) user.year = String(year).trim();
      if (bio !== undefined) user.bio = String(bio).trim().slice(0, 180);
      if (github !== undefined) user.github = String(github).trim().replace(/^@/, '');
      if (linkedin !== undefined) user.linkedin = String(linkedin).trim();

      // Preferences
      if (publicProfile !== undefined) user.publicProfile = Boolean(publicProfile);
      if (emailUpdates !== undefined) user.emailUpdates = Boolean(emailUpdates);

      await user.save();

      const populated = await User.findById(user._id).populate('teamId');

      return success(
        res,
        {
          profile: {
            fullName: populated.fullName,
            username: populated.username,
            email: populated.email,
            college: populated.college,
            course: populated.course,
            year: populated.year,
            bio: populated.bio,
            github: populated.github,
            linkedin: populated.linkedin,
            publicProfile: populated.publicProfile,
            emailUpdates: populated.emailUpdates,
            teamName: populated.teamId?.name || '',
            teamCode: populated.teamId?.joinCode || ''
          }
        },
        'Profile updated successfully'
      );
    } catch (error) {
      return next(error);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return unauthorized(res, 'User profile not found');
      }

      const { avatar } = req.body;
      if (!avatar || typeof avatar !== 'string') {
        return badRequest(res, 'Avatar data string is required');
      }

      // Basic payload safety check: max 500KB
      if (avatar.length > 500 * 1024) {
        return badRequest(res, 'Avatar payload exceeds 500KB maximum size');
      }

      user.avatar = avatar;
      await user.save();

      return success(res, { avatar: user.avatar }, 'Avatar updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const user = await User.findById(req.user.userId).select('+passwordHash');
      if (!user) {
        return unauthorized(res, 'User profile not found');
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return badRequest(res, 'Current password and new password are required');
      }

      if (newPassword.length < 6) {
        return badRequest(res, 'New password must be at least 6 characters');
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return badRequest(res, 'Current password is incorrect');
      }

      user.passwordHash = newPassword; // Pre-save hook hashes it
      await user.save();

      logger.security(`Password changed for user ${user.username}`);

      return success(res, null, 'Password updated successfully');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();



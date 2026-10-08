const { User } = require('../models');
const authService = require('../services/auth.service');
const { success, created, badRequest, unauthorized } = require('../utils/apiResponse');
const { ROLES } = require('../constants/roles');

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
}

module.exports = new AuthController();


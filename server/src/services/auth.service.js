const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { User } = require('../models');

/**
 * Authentication Service
 * Manages JWT generation, password validation, and user session lifecycles.
 */
class AuthService {
  /**
   * Generates Access Token and Refresh Token for authenticated user
   */
  generateTokens(user) {
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      teamId: user.teamId ? user.teamId.toString() : null
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Validates user credentials
   */
  async validateUserCredentials(emailOrUsername, password) {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    }).select('+passwordHash');

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return null;
    }

    return user;
  }
}

module.exports = new AuthService();


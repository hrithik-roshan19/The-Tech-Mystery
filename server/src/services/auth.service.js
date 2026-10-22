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
    if (config.authProvider !== 'jwt') return {};

    const payload = {
      userId: user._id.toString(),
      tokenVersion: user.tokenVersion || 0,
      tokenUse: 'access',
      username: user.username,
      role: user.role,
      teamId: user.teamId ? user.teamId.toString() : null
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    return { accessToken };
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
    }).select('+passwordHash +tokenVersion');

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


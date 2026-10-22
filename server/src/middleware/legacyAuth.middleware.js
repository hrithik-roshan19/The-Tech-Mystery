const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { unauthorized } = require('../utils/apiResponse');
const { User } = require('../models');

/**
 * Authentication Middleware
 * Validates incoming JWT Bearer tokens and attaches authoritative user details to `req.user`.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Authentication token required (format: Bearer <token>)');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return unauthorized(res, 'Malformed authorization token');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return unauthorized(res, 'Session token has expired. Please log in again.');
      }
      return unauthorized(res, 'Invalid authentication token.');
    }

    if (!decoded || !decoded.userId) {
      return unauthorized(res, 'Invalid authentication token payload');
    }

    if (!mongoose.isValidObjectId(decoded.userId)) {
      return unauthorized(res, 'User account no longer exists');
    }

    // Verify user against database: fetch authoritative fields
    const freshUser = await User.findById(decoded.userId).select('role teamId isActive +tokenVersion');
    if (!freshUser) return unauthorized(res, 'User account no longer exists');
    if (decoded.tokenUse !== 'access' || decoded.tokenVersion !== (freshUser.tokenVersion || 0)) {
      return unauthorized(res, 'Session is no longer valid. Please log in again.');
    }

    if (!freshUser.isActive) {
      return unauthorized(res, 'Account has been deactivated. Please contact an administrator.');
    }

    req.user = {
      ...decoded,
      _id: freshUser._id,
      userId: freshUser._id.toString(),
      role: freshUser.role,
      teamId: freshUser.teamId ? freshUser.teamId.toString() : null,
      isActive: freshUser.isActive
    };

    return next();
  } catch {
    return unauthorized(res, 'Authentication could not be verified');
  }
};

/**
 * Optional Auth Middleware
 * Populates req.user if a valid token for an active user is provided,
 * while preserving public access for requests without a token or with invalid tokens.
 */
const optionalAuth = async (req, res, next) => {
  try {
    req.user = null;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
    } catch {
      // Ignore invalid or expired token for optional auth routes (proceed as public visitor)
      return next();
    }

    if (!decoded || !decoded.userId || !mongoose.isValidObjectId(decoded.userId)) {
      return next();
    }

    // Fetch authoritative fields directly from MongoDB
    const freshUser = await User.findById(decoded.userId).select('role teamId isActive +tokenVersion');
    if (!freshUser || !freshUser.isActive || decoded.tokenUse !== 'access' || decoded.tokenVersion !== (freshUser.tokenVersion || 0)) {
      // Do not retain stale token role/team information when user is missing or inactive
      req.user = null;
      return next();
    }

    req.user = {
      ...decoded,
      _id: freshUser._id,
      userId: freshUser._id.toString(),
      role: freshUser.role,
      teamId: freshUser.teamId ? freshUser.teamId.toString() : null,
      isActive: freshUser.isActive
    };

    return next();
  } catch (error) {
    // Database or server errors must NOT silently convert into authenticated users
    req.user = null;
    return next(error);
  }
};

module.exports = {
  authenticate,
  optionalAuth
};


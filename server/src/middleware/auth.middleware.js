const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { unauthorized, forbidden } = require('../utils/apiResponse');

/**
 * Authentication Middleware
 * Validates incoming JWT Bearer tokens and attaches user details to `req.user`.
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

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return unauthorized(res, 'Session token has expired. Please log in again.');
        }
        return unauthorized(res, 'Invalid authentication token.');
      }

      // Attach decoded payload (userId, teamId, role, username)
      req.user = decoded;
      return next();
    });
  } catch (error) {
    return unauthorized(res, `Authentication error: ${error.message}`);
  }
};

/**
 * Optional Auth Middleware
 * Populates req.user if valid token provided, but doesn't block unauthenticated requests.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (!err && decoded) {
      req.user = decoded;
    }
    return next();
  });
};

module.exports = {
  authenticate,
  optionalAuth
};

const rateLimit = require('express-rate-limit');
const config = require('../config/environment');
const { rateLimited } = require('../utils/apiResponse');

const isLocalOrTest = (req) => {
  if (process.env.NODE_ENV === 'test' || config.env === 'test') return true;
  if (config.env === 'development' && (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1')) {
    return true;
  }
  return false;
};

/**
 * Standard API Rate Limiter
 * Guards general endpoints from scanning/scraping.
 * Uses express-rate-limit standard validation which verifies safe proxy trust
 * configured via app.set('trust proxy', config.trustProxy).
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalOrTest,
  handler: (req, res) => {
    return rateLimited(res, 'Too many requests. Please throttle your queries.');
  }
});

/**
 * Stricter Rate Limiter for Authentication (Login / Register)
 * Prevents credential stuffing / brute-forcing user passwords.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalOrTest,
  handler: (req, res) => {
    return rateLimited(res, 'Too many authentication attempts. Please try again in 15 minutes.');
  }
});

/**
 * Submission Attempt Limiter
 * Critical anti-cheat defense: prevents automated brute-forcing of flags.
 */
const submissionLimiter = rateLimit({
  windowMs: config.rateLimit.submissionWindowMs,
  max: config.rateLimit.submissionMaxRequests,
  skip: isLocalOrTest,
  keyGenerator: (req) => {
    // Limit per team + challenge ID if authenticated, else fallback to IP
    if (req.user && req.user.teamId) {
      return `team_${req.user.teamId}`;
    }
    return req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return rateLimited(res, 'Rate limit exceeded on flag submissions. Anti-brute-force cool-down active. Please wait 60 seconds.');
  }
});

/**
 * Checkpoint QR Scan Limiter
 * Throttles rapid barcode scanner loop injection.
 */
const qrScanLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalOrTest,
  handler: (req, res) => {
    return rateLimited(res, 'QR scan rate limit exceeded. Please wait a few seconds before re-scanning.');
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  submissionLimiter,
  qrScanLimiter
};

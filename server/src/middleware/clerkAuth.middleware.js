const clerk = require('../services/clerk.service');
const { User } = require('../models');
const logger = require('../utils/logger');

const sendFailure = (res, error) => res.status(error.statusCode || 503).json({ success: false,
  message: error.statusCode ? error.message : 'Authentication verification unavailable', errorCode: error.errorCode });

async function verifyIdentity(req) {
  const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization || '');
  if (!match || !match[1] || match[1] === 'null' || match[1] === 'undefined') {
    throw clerk.failure(401, 'Clerk Bearer session token required');
  }
  return clerk.verifySession(match[1]);
}

async function requireClerkSession(req, res, next) {
  try { req.clerkIdentity = await verifyIdentity(req); return next(); }
  catch (error) { return sendFailure(res, error); }
}

async function resolveUser(req) {
  const identity = await verifyIdentity(req);
  const user = await User.findOne({ clerkUserId: identity.clerkUserId }).select('role teamId isActive username');
  if (!user) {
    const idPrefix = typeof identity.clerkUserId === 'string' ? `${identity.clerkUserId.substring(0, 8)}...` : 'unknown';

    // Inspect if the verified Clerk identity belongs to an existing administrative account
    let isAdminAccount = false;
    try {
      const email = await clerk.verifiedEmail(identity);
      if (email) {
        const adminUser = await User.findOne({ email, role: 'ADMIN' });
        if (adminUser) {
          isAdminAccount = true;
        }
      }
    } catch {
      // Identity lookup error in Clerk client; fallback to standard unlinked flow
    }

    if (isAdminAccount) {
      logger.warn(`[Auth] Clerk session verified (${idPrefix}) for admin email, but account is unlinked in database. Returning CLERK_ADMIN_UNLINKED.`);
      throw clerk.failure(403, 'Organizer-assisted admin account linking required. Contact the lead organizer.', 'CLERK_ADMIN_UNLINKED');
    }

    logger.warn(`[Auth] Clerk session verified (${idPrefix}), but no matching account found in database. Returning CLERK_ACCOUNT_UNLINKED.`);
    throw clerk.failure(403, 'Link or register an application account to continue', 'CLERK_ACCOUNT_UNLINKED');
  }
  if (!user.isActive) {
    logger.warn(`[Auth] User account '${user.username}' (role: ${user.role}) is deactivated. Returning ACCOUNT_INACTIVE.`);
    throw clerk.failure(403, 'Account has been deactivated', 'ACCOUNT_INACTIVE');
  }
  req.clerkIdentity = identity;
  return { _id: user._id, userId: String(user._id), username: user.username, role: user.role,
    teamId: user.teamId ? String(user.teamId) : null, isActive: user.isActive, authProvider: 'clerk' };
}
async function authenticate(req, res, next) {
  try { req.user = await resolveUser(req); return next(); }
  catch (error) { return sendFailure(res, error); }
}
async function optionalAuth(req, res, next) {
  req.user = null;
  if (!req.headers.authorization) return next();
  try { req.user = await resolveUser(req); return next(); }
  catch (error) { if ([401, 403].includes(error.statusCode)) return next(); return next(error); }
}
module.exports = { authenticate, optionalAuth, requireClerkSession };

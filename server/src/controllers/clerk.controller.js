const { User } = require('../models');
const clerk = require('../services/clerk.service');
const transaction = require('../utils/transaction');
const { eventFor } = require('../services/eligibility.service');
const { success } = require('../utils/apiResponse');
const logger = require('../utils/logger');

function isApprovedIdentityIndex(index) {
  if (!index || !index.unique || !index.key) return false;
  const keys = Object.keys(index.key);
  if (keys.length !== 1) return false;
  return keys[0] === 'clerkUserId' && Math.abs(Number(index.key.clerkUserId)) === 1;
}

async function requireMappingIndex() {
  const indexes = await User.collection.indexes().catch(() => []);
  if (!indexes.some(isApprovedIdentityIndex)) {
    logger.error('[Clerk Identity Mapping]: Required unique identity index on clerkUserId is missing from users collection', {
      foundIndexNames: indexes.map(i => i.name),
      foundKeys: indexes.map(i => Object.keys(i.key || {}).join(','))
    });
    throw clerk.failure(503, 'Account mapping requires the approved unique identity index');
  }
}
function responseError(res, error) {
  return res.status(error.statusCode || (error.code === 11000 ? 409 : 503)).json({ success: false,
    message: error.statusCode ? error.message : 'Account operation could not complete. Contact an organizer.' });
}

module.exports = {
  async link(req, res) {
    try {
      const { emailOrUsername, password } = req.body;
      if (typeof emailOrUsername !== 'string' || !emailOrUsername.trim() || typeof password !== 'string' || !password || password.length > 256) {
        throw clerk.failure(400, 'Existing account credentials are required');
      }
      await requireMappingIndex();
      const email = await clerk.verifiedEmail(req.clerkIdentity);
      await transaction(async () => {
        const user = await User.findOne({ $or: [{ email: emailOrUsername.trim().toLowerCase() }, { username: emailOrUsername.trim() }] })
          .select('+passwordHash +clerkUserId +tokenVersion');
        if (!user || !user.isActive || user.role === 'ADMIN' || user.email !== email ||
            !await user.comparePassword(password) || user.clerkUserId) {
          throw clerk.failure(403, 'Account cannot be self-linked. Verify credentials or contact an organizer.');
        }
        if (await User.exists({ clerkUserId: req.clerkIdentity.clerkUserId })) throw clerk.failure(409, 'Identity already linked');
        user.clerkUserId = req.clerkIdentity.clerkUserId;
        user.clerkLinkedAt = new Date();
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();
      });
      return success(res, null, 'Existing account linked; team, role and history preserved');
    } catch (error) { return responseError(res, error); }
  },
  async register(req, res) {
    try {
      const { username, fullName } = req.body;
      if (typeof username !== 'string' || !/^[A-Za-z0-9_-]{3,30}$/.test(username) ||
          typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.length > 100) {
        throw clerk.failure(400, 'Valid username and full name required');
      }
      await requireMappingIndex();
      const email = await clerk.verifiedEmail(req.clerkIdentity);
      await transaction(async () => {
        await eventFor('registration');
        if (await User.exists({ $or: [{ email }, { username }, { clerkUserId: req.clerkIdentity.clerkUserId }] })) {
          throw clerk.failure(409, 'An account already exists. Link the existing account or contact an organizer.');
        }
        await User.create({ username, fullName: fullName.trim(), email,
          clerkUserId: req.clerkIdentity.clerkUserId, clerkLinkedAt: new Date(), role: 'TEAM_MEMBER', teamId: null });
      });
      return success(res, null, 'Participant account created; team enrollment remains separate', 201);
    } catch (error) { return responseError(res, error); }
  }
};

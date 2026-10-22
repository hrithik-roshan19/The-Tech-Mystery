const { createClerkClient, verifyToken } = require('@clerk/backend');
const config = require('../config/environment');
let client;
const failure = (statusCode, message, errorCode) => Object.assign(new Error(message), { statusCode, errorCode });

const service = {
  getClient() {
    if (!client) client = createClerkClient({ secretKey: config.clerk.secretKey });
    return client;
  },
  async verifySession(token) {
    if (config.authProvider !== 'clerk') throw failure(404, 'Clerk authentication is not enabled');
    let claims;
    try {
      claims = await verifyToken(token, { secretKey: config.clerk.secretKey, jwtKey: config.clerk.jwtKey,
        issuer: config.clerk.issuer, authorizedParties: config.clerk.authorizedParties, clockSkewInMs: 5000 });
    } catch { throw failure(401, 'Invalid or expired Clerk session'); }
    if (claims.iss !== config.clerk.issuer || !config.clerk.authorizedParties.includes(claims.azp) ||
        !/^user_[A-Za-z0-9]+$/.test(claims.sub || '') || !/^sess_[A-Za-z0-9]+$/.test(claims.sid || '') ||
        claims.sts === 'pending' || claims.act || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) {
      throw failure(401, 'Invalid Clerk session claims');
    }
    // Check authoritative session status so already-revoked JWTs are rejected,
    // rather than continuing to work until the short-lived token expires.
    let session;
    try { session = await service.getClient().sessions.getSession(claims.sid); }
    catch { throw failure(503, 'Identity provider session verification unavailable'); }
    if (session.status !== 'active' || session.userId !== claims.sub || !Number.isFinite(session.expireAt) || session.expireAt <= Date.now()) {
      throw failure(401, 'Clerk session is no longer active');
    }
    return { clerkUserId: claims.sub, sessionId: claims.sid };
  },
  async verifiedEmail(identity) {
    let user;
    try { user = await service.getClient().users.getUser(identity.clerkUserId); }
    catch { throw failure(503, 'Identity provider account verification unavailable'); }
    const email = user.emailAddresses.find(address => address.id === user.primaryEmailAddressId);
    if (user.banned || user.locked || !email || email.verification?.status !== 'verified') {
      throw failure(403, 'A verified primary email and active Clerk account are required');
    }
    return email.emailAddress.trim().toLowerCase();
  },
  async revokeOtherSessions(identity) {
    // Read every page before revoking: list offsets must not shift as sessions change.
    const sessions = [];
    let offset = 0;
    while (true) {
      const page = await service.getClient().sessions.getSessionList({ userId: identity.clerkUserId, status: 'active', limit: 100, offset });
      sessions.push(...page.data);
      offset += page.data.length;
      if (offset >= page.totalCount) break;
      if (!page.data.length) throw failure(503, 'Session list changed; retry revocation');
    }
    let revoked = 0;
    for (const session of sessions) {
      if (session.id === identity.sessionId) continue;
      if (session.userId !== identity.clerkUserId) throw failure(503, 'Session ownership could not be verified');
      const result = await service.getClient().sessions.revokeSession(session.id);
      if (result.status !== 'revoked') throw failure(503, 'Session revocation could not be confirmed');
      revoked++;
    }
    return revoked;
  },
  failure
};
module.exports = service;

const { createClerkClient, verifyToken } = require('@clerk/backend');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const logger = require('../utils/logger');

let client;
const failure = (statusCode, message, errorCode) => Object.assign(new Error(message), { statusCode, errorCode });

function getAllowedIssuers() {
  const list = new Set();
  const configured = config.clerk?.issuer;
  if (configured) {
    const clean = configured.replace(/\/+$/, '');
    list.add(clean);
    list.add(`${clean}/`);

    // If configured issuer is a proxy path (e.g. https://domain.com/__clerk), also derive base origin
    if (clean.includes('/__clerk') || clean.includes('/.__clerk')) {
      const baseOrigin = clean.replace(/\/(\.?__clerk)$/, '');
      list.add(baseOrigin);
      list.add(`${baseOrigin}/`);
      if (baseOrigin.startsWith('https://clerk.')) {
        const apex = baseOrigin.replace('https://clerk.', 'https://');
        list.add(apex);
        list.add(`${apex}/`);
        list.add(`${apex}/__clerk`);
        list.add(`${apex}/__clerk/`);
      }
    } else {
      // If configured issuer is a base domain/origin, also derive its legitimate proxy paths
      list.add(`${clean}/__clerk`);
      list.add(`${clean}/__clerk/`);
      list.add(`${clean}/.__clerk`);
      list.add(`${clean}/.__clerk/`);

      if (clean.startsWith('https://clerk.')) {
        const apex = clean.replace('https://clerk.', 'https://');
        list.add(apex);
        list.add(`${apex}/`);
        list.add(`${apex}/__clerk`);
        list.add(`${apex}/__clerk/`);
      } else if (clean.startsWith('https://')) {
        const sub = clean.replace('https://', 'https://clerk.');
        list.add(sub);
        list.add(`${sub}/`);
      }
    }
  }

  // Canonical production deployment issuers for The Tech Mystery
  const prodBase = 'https://the-tech-mystery.vercel.app';
  list.add(prodBase);
  list.add(`${prodBase}/`);
  list.add(`${prodBase}/__clerk`);
  list.add(`${prodBase}/__clerk/`);
  list.add(`${prodBase}/.__clerk`);
  list.add(`${prodBase}/.__clerk/`);
  list.add('https://clerk.the-tech-mystery.vercel.app');
  list.add('https://clerk.the-tech-mystery.vercel.app/');

  return Array.from(list).filter(Boolean);
}

function getAllowedParties(tokenAzp) {
  const parties = new Set(config.clerk?.authorizedParties || []);
  if (config.cors?.origin) {
    const origins = Array.isArray(config.cors.origin) ? config.cors.origin : [config.cors.origin];
    origins.forEach(o => {
      if (typeof o === 'string' && o.startsWith('http')) parties.add(o.trim());
    });
  }
  parties.add('https://the-tech-mystery.vercel.app');
  parties.add('http://localhost:5173');
  parties.add('http://localhost:5174');
  parties.add('http://localhost:5175');

  if (tokenAzp && typeof tokenAzp === 'string') {
    if (tokenAzp.includes('the-tech-mystery') && tokenAzp.endsWith('.vercel.app')) {
      parties.add(tokenAzp);
    }
  }

  return Array.from(parties).filter(Boolean);
}

const service = {
  getClient() {
    if (!client) client = createClerkClient({ secretKey: config.clerk.secretKey });
    return client;
  },
  async verifySession(token) {
    if (config.authProvider !== 'clerk') throw failure(404, 'Clerk authentication is not enabled');
    if (!token || typeof token !== 'string') throw failure(401, 'Clerk Bearer session token required');

    const unverified = jwt.decode(token, { complete: true }) || {};
    const unverifiedHeader = unverified.header || {};
    const unverifiedPayload = unverified.payload || {};

    const allowedIssuers = getAllowedIssuers();
    const allowedParties = unverifiedPayload?.azp ? getAllowedParties(unverifiedPayload.azp) : undefined;

    let claims;
    try {
      claims = await verifyToken(token, {
        secretKey: config.clerk.secretKey,
        jwtKey: config.clerk.jwtKey,
        issuer: allowedIssuers.length ? allowedIssuers : undefined,
        authorizedParties: allowedParties && allowedParties.length ? allowedParties : undefined,
        clockSkewInMs: 5000
      });
    } catch (error) {
      logger.error('[Clerk Session Verification Failed]:', {
        errorName: error?.name,
        errorMessage: error?.message,
        reason: error?.reason || error?.code || 'verification_failed',
        tokenKid: unverifiedHeader?.kid,
        tokenIssuer: unverifiedPayload?.iss,
        expectedIssuers: allowedIssuers,
        tokenAzp: unverifiedPayload?.azp,
        allowedParties,
        tokenExp: unverifiedPayload?.exp,
        now: Math.floor(Date.now() / 1000),
        isExpired: unverifiedPayload?.exp ? unverifiedPayload.exp * 1000 <= Date.now() : null,
        hasSecretKey: !!config.clerk.secretKey,
        secretKeyType: config.clerk.secretKey ? (config.clerk.secretKey.startsWith('sk_live_') ? 'live' : 'test') : 'none',
        hasJwtKey: !!config.clerk.jwtKey
      });
      throw failure(401, 'Invalid or expired Clerk session');
    }

    if ((allowedIssuers.length > 0 && !allowedIssuers.includes(claims.iss)) ||
        (allowedParties && allowedParties.length > 0 && claims.azp && !allowedParties.includes(claims.azp)) ||
        !/^user_[A-Za-z0-9]+$/.test(claims.sub || '') || !/^sess_[A-Za-z0-9]+$/.test(claims.sid || '') ||
        claims.sts === 'pending' || claims.act || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) {
      logger.error('[Clerk Session Claims Mismatch]:', {
        claimsIss: claims.iss,
        allowedIssuers,
        claimsAzp: claims.azp,
        allowedParties,
        subValid: /^user_[A-Za-z0-9]+$/.test(claims.sub || ''),
        sidValid: /^sess_[A-Za-z0-9]+$/.test(claims.sid || ''),
        sts: claims.sts,
        isExpired: !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()
      });
      throw failure(401, 'Invalid Clerk session claims');
    }

    // Check authoritative session status so already-revoked JWTs are rejected
    let session;
    try {
      session = await service.getClient().sessions.getSession(claims.sid);
    } catch (sessionError) {
      logger.error('[Clerk Authoritative Session Fetch Failed]:', {
        errorMessage: sessionError?.message,
        statusCode: sessionError?.status || sessionError?.statusCode,
        sessionId: claims.sid,
        userId: claims.sub
      });
      throw failure(503, 'Identity provider session verification unavailable');
    }

    if (session.status !== 'active' || session.userId !== claims.sub || !Number.isFinite(session.expireAt) || session.expireAt <= Date.now()) {
      logger.warn('[Clerk Session No Longer Active]:', {
        sessionStatus: session.status,
        expectedUser: claims.sub,
        sessionUser: session.userId,
        expireAt: session.expireAt,
        now: Date.now()
      });
      throw failure(401, 'Clerk session is no longer active');
    }

    return { clerkUserId: claims.sub, sessionId: claims.sid };
  },
  async verifiedEmail(identity) {
    let user;
    try {
      user = await service.getClient().users.getUser(identity.clerkUserId);
    } catch (err) {
      logger.error('[Clerk User Fetch Failed]:', {
        errorMessage: err?.message,
        statusCode: err?.status || err?.statusCode,
        clerkUserId: identity?.clerkUserId
      });
      throw failure(503, 'Identity provider account verification unavailable');
    }
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

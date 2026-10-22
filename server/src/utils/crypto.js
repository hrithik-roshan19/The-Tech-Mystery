const crypto = require('crypto');
const config = require('../config/environment');

/**
 * Cryptographic Utilities
 * Handles flag normalization/hashing and QR checkpoint HMAC token generation.
 */

/**
 * Normalizes CTF flags (strips trailing whitespace, standardizes case if case-insensitive)
 * Standard flag format: HTG{...}
 */
const normalizeFlag = (flag) => {
  if (!flag || typeof flag !== 'string') return '';
  return flag.trim();
};

/**
 * Compares user submission against expected flag using constant-time comparison
 * to prevent timing side-channel attacks.
 */
const safeFlagCompare = (submitted, expected, caseSensitive = true) => {
  let normSub = normalizeFlag(submitted);
  let normExp = normalizeFlag(expected);

  if (!caseSensitive) {
    normSub = normSub.toLowerCase();
    normExp = normExp.toLowerCase();
  }

  if (normSub.length === 0 || normExp.length === 0 || normSub.length !== normExp.length) {
    return false;
  }

  const bufSub = Buffer.from(normSub, 'utf8');
  const bufExp = Buffer.from(normExp, 'utf8');

  return bufSub.length === bufExp.length && crypto.timingSafeEqual(bufSub, bufExp);
};

/**
 * Generate HMAC SHA-256 signature for a checkpoint code
 * Prevents QR code tampering or enumeration attacks.
 */
const generateCheckpointToken = (checkpointCode, levelNumber, options = {}) => {
  const expiresAt = options.expiresAt || Math.floor(Date.now() / 1000) + config.qrTokenTtlSeconds;
  const payloadObj = {
    v: 1,
    code: checkpointCode,
    level: levelNumber,
    team: options.teamId ? String(options.teamId) : '*',
    exp: expiresAt
  };
  if (options.qid) {
    payloadObj.qid = String(options.qid);
  }
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const signature = crypto.createHmac('sha256', config.qrSecretSalt).update(payload).digest('hex');
  return `${payload}.${signature}`;
};

/**
 * Decodes and inspects a checkpoint token without cryptographic validation.
 */
const decodeCheckpointToken = (token) => {
  if (typeof token !== 'string' || token.length > 1024) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  try {
    return JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
};

const verifyCheckpointToken = (checkpointCode, levelNumber, token, options = {}) => {
  if (typeof token !== 'string' || token.length > 1024) return false;
  const parts = token.split('.');
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[a-f0-9]{64}$/.test(parts[1])) return false;
  const expected = crypto.createHmac('sha256', config.qrSecretSalt).update(parts[0]).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(parts[1], 'hex'), Buffer.from(expected, 'hex'))) return false;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const isBasicMatch = payload.v === 1 && payload.code === checkpointCode && payload.level === levelNumber &&
      Number.isSafeInteger(payload.exp) && payload.exp > Math.floor(Date.now() / 1000) &&
      payload.team === (options.teamId ? String(options.teamId) : '*');
    if (!isBasicMatch) return false;
    if (options.qid && payload.qid && payload.qid !== String(options.qid)) return false;
    return true;
  } catch { return false; }
};

module.exports = {
  normalizeFlag,
  safeFlagCompare,
  generateCheckpointToken,
  decodeCheckpointToken,
  verifyCheckpointToken
};

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
const safeFlagCompare = (submitted, expected) => {
  const normSub = normalizeFlag(submitted);
  const normExp = normalizeFlag(expected);

  if (normSub.length !== normExp.length) {
    return false;
  }

  const bufSub = Buffer.from(normSub, 'utf8');
  const bufExp = Buffer.from(normExp, 'utf8');

  return crypto.timingSafeEqual(bufSub, bufExp);
};

/**
 * Generate HMAC SHA-256 signature for a checkpoint code
 * Prevents QR code tampering or enumeration attacks.
 */
const generateCheckpointToken = (checkpointCode, levelNumber) => {
  const payload = `${checkpointCode}:${levelNumber}`;
  return crypto
    .createHmac('sha256', config.qrSecretSalt)
    .update(payload)
    .digest('hex');
};

/**
 * Verifies a checkpoint token against expected code and level
 */
const verifyCheckpointToken = (checkpointCode, levelNumber, token) => {
  const expectedToken = generateCheckpointToken(checkpointCode, levelNumber);
  if (token.length !== expectedToken.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
};

module.exports = {
  normalizeFlag,
  safeFlagCompare,
  generateCheckpointToken,
  verifyCheckpointToken
};

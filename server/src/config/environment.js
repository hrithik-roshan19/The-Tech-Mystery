const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Capture pre-existing process.env to ensure CLI flags and test harnesses are preserved
const originalEnv = { ...process.env };

// Resolve paths: server/.env takes precedence over repository root .env
const serverEnvPath = path.resolve(__dirname, '../../.env');
const rootEnvPath = path.resolve(__dirname, '../../../.env');

// 1. Load server/.env first so server-specific configuration (e.g. Atlas URI) takes priority
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}

// 2. Load root .env as fallback for shared variables not defined in server/.env
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

// 3. Re-apply pre-existing environment variables (CLI flags, CI runners)
for (const [key, value] of Object.entries(originalEnv)) {
  if (value !== undefined) {
    process.env[key] = value;
  }
}

/**
 * Validated Environment Variables Configuration
 * Centralizes all process.env accesses with safe defaults for development.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  authProvider: process.env.AUTH_PROVIDER || 'jwt',
  clerk: {
    secretKey: (process.env.CLERK_SECRET_KEY || process.env.CLERK_API_KEY || '').trim().replace(/^["']|["']$/g, ''),
    jwtKey: process.env.CLERK_JWT_KEY?.replace(/\\n/g, '\n'),
    issuer: (process.env.CLERK_JWT_ISSUER_DOMAIN || '').trim().replace(/^["']|["']$/g, ''),
    authorizedParties: (process.env.CLERK_AUTHORIZED_PARTIES || '')
      .split(',')
      .map(value => value.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  },
  port: parseInt(process.env.PORT, 10) || 5000,
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Proxy Trust Configuration (Single hop for Render / Reverse Proxy)
  trustProxy: process.env.TRUST_PROXY !== undefined
    ? (process.env.TRUST_PROXY === 'true' ? 1 : isNaN(Number(process.env.TRUST_PROXY)) ? process.env.TRUST_PROXY : Number(process.env.TRUST_PROXY))
    : (process.env.NODE_ENV === 'production' ? 1 : false),
  
  // Database
  mongodbUri: (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('example.mongodb.net') && !process.env.MONGODB_URI.includes('<password>'))
    ? process.env.MONGODB_URI
    : 'mongodb://127.0.0.1:27017/hack_the_grid',

  // Authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'hack_the_grid_dev_jwt_secret_change_in_production_32char',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'hack_the_grid_dev_refresh_jwt_secret_change_32char',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // CORS
  cors: {
    origin: (() => {
      const origins = new Set();
      const raw = process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:5173';
      (raw.includes(',') ? raw.split(',') : [raw]).forEach(s => {
        const trimmed = (s || '').trim();
        if (trimmed) {
          origins.add(trimmed);
          origins.add(trimmed.replace(/\/+$/, ''));
        }
      });
      // In non-production environments, permit standard local Vite development ports
      if (process.env.NODE_ENV !== 'production') {
        origins.add('http://localhost:5173');
        origins.add('http://localhost:5174');
        origins.add('http://localhost:5175');
        origins.add('http://localhost:5176');
        origins.add('http://127.0.0.1:5173');
        origins.add('http://127.0.0.1:5174');
        origins.add('http://127.0.0.1:5175');
        origins.add('http://127.0.0.1:5176');
      }
      return Array.from(origins);
    })()
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 150,
    submissionWindowMs: parseInt(process.env.SUBMISSION_RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000,
    submissionMaxRequests: parseInt(process.env.SUBMISSION_RATE_LIMIT_MAX_REQUESTS, 10) || 10
  },

  // QR Token Cryptography & FCFS Claim Lease
  qrTokenTtlSeconds: parseInt(process.env.QR_TOKEN_TTL_SECONDS, 10) || 86400,
  qrSecretSalt: process.env.QR_SECRET_SALT || 'hack_the_grid_qr_hmac_secret_salt_key_default',
  questionClaimTimeoutMinutes: parseInt(process.env.QUESTION_CLAIM_TIMEOUT_MINUTES, 10) || 30,

  // Admin Bootstrap
  adminBootstrap: {
    key: process.env.ADMIN_BOOTSTRAP_KEY || 'codesphere_admin_bootstrap_key_2026',
    email: process.env.ADMIN_EMAIL || 'admin@codesphere.tulas.edu.in',
    defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMeOnFirstDeployment#2026'
  },

  // Event Competition Lifecycle State Override
  eventState: process.env.EVENT_STATE ? process.env.EVENT_STATE.trim().toUpperCase() : null,

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  isProduction: process.env.NODE_ENV === 'production'
};

const { EVENT_STATES } = require('../constants/eventStates');
if (config.eventState && !Object.values(EVENT_STATES).includes(config.eventState)) {
  throw new Error(`Invalid EVENT_STATE '${config.eventState}'. Valid states: ${Object.values(EVENT_STATES).join(', ')}`);
}

if (!['jwt', 'clerk'].includes(config.authProvider)) throw new Error('Unsupported AUTH_PROVIDER');
if (process.env.VITE_AUTH_PROVIDER && config.env !== 'test') {
  const clientProvider = process.env.VITE_AUTH_PROVIDER.trim().toLowerCase();
  if (clientProvider !== config.authProvider) {
    throw new Error(`Authentication provider mismatch: Server is configured for '${config.authProvider}', but VITE_AUTH_PROVIDER is '${clientProvider}'`);
  }
}
if (config.authProvider === 'clerk') {
  if (!/^sk_(test|live)_[A-Za-z0-9]+$/.test(config.clerk.secretKey || '') ||
      /replace|placeholder/i.test(config.clerk.secretKey || '')) throw new Error('Clerk mode requires CLERK_SECRET_KEY');
  let issuer;
  try { issuer = new URL(config.clerk.issuer); } catch { throw new Error('Clerk mode requires the exact HTTPS session issuer URL'); }
  if (issuer.protocol !== 'https:' || issuer.origin !== config.clerk.issuer) throw new Error('Clerk issuer must be an HTTPS origin without a trailing slash');
  if (!config.clerk.authorizedParties.length || config.clerk.authorizedParties.some(origin => {
    try { const url = new URL(origin); return url.origin !== origin || !['http:', 'https:'].includes(url.protocol); } catch { return true; }
  })) throw new Error('Clerk mode requires explicit authorized application origins');
  if (config.isProduction && (!config.clerk.secretKey.startsWith('sk_live_') ||
      config.clerk.authorizedParties.some(origin => !origin.startsWith('https://')))) throw new Error('Production Clerk mode requires live credentials and HTTPS application origins');
}
if (config.isProduction) {
  const validSecret = value => typeof value === 'string' && value.length >= 32 &&
    new Set(value).size >= 12 && !/default|change|secret|example|password|super[_-]/i.test(value);
  if ((config.authProvider === 'jwt' && (![process.env.JWT_SECRET, process.env.JWT_REFRESH_SECRET].every(validSecret) || new Set([config.jwt.secret, config.jwt.refreshSecret, config.qrSecretSalt]).size !== 3)) || !validSecret(process.env.QR_SECRET_SALT)) {
    throw new Error('Production requires distinct, randomly generated JWT and QR signing secrets of at least 32 characters');
  }
  if (!process.env.MONGODB_URI || /example\.mongodb\.net|<password>/.test(process.env.MONGODB_URI)) {
    throw new Error('Production requires an explicit valid MongoDB connection configuration');
  }
}
module.exports = config;

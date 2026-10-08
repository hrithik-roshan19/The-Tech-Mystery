const dotenv = require('dotenv');
dotenv.config();

/**
 * Validated Environment Variables Configuration
 * Centralizes all process.env accesses with safe defaults for development.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hack_the_grid',

  // Authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'hack_the_grid_dev_jwt_secret_change_in_production_32char',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'hack_the_grid_dev_refresh_jwt_secret_change_32char',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // CORS
  cors: {
    origin: process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:5173'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 150,
    submissionWindowMs: parseInt(process.env.SUBMISSION_RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000,
    submissionMaxRequests: parseInt(process.env.SUBMISSION_RATE_LIMIT_MAX_REQUESTS, 10) || 10
  },

  // QR Token Cryptography
  qrSecretSalt: process.env.QR_SECRET_SALT || 'hack_the_grid_qr_hmac_secret_salt_key_default',

  // Admin Bootstrap
  adminBootstrap: {
    key: process.env.ADMIN_BOOTSTRAP_KEY || 'codesphere_admin_bootstrap_key_2026',
    email: process.env.ADMIN_EMAIL || 'admin@codesphere.tulas.edu.in',
    defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMeOnFirstDeployment#2026'
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  isProduction: process.env.NODE_ENV === 'production'
};

module.exports = config;


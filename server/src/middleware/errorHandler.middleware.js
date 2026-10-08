const logger = require('../utils/logger');
const config = require('../config/environment');
const { error } = require('../utils/apiResponse');

/**
 * Global Error Handling Middleware
 * Catches unhandled rejections, Mongoose validation errors, and crashes,
 * preventing stack trace leakage in production.
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`[UnhandledError] ${err.name || 'Error'}: ${err.message}`, {
    stack: config.isProduction ? undefined : err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'resource';
    return res.status(409).json({
      success: false,
      errorCode: 'DUPLICATE_KEY_CONFLICT',
      message: `A record with this ${duplicateField} already exists.`
    });
  }

  // Handle Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      errorCode: 'SCHEMA_VALIDATION_ERROR',
      message: 'Database schema validation failed',
      errors: validationErrors
    });
  }

  // Handle JWT Malformed / Sign errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      errorCode: 'INVALID_TOKEN',
      message: 'Invalid authorization token'
    });
  }

  // Fallback 500 Internal Error
  return error(
    res,
    config.isProduction ? 'An unexpected internal server error occurred' : err.message,
    err.statusCode || 500,
    config.isProduction ? null : err.stack,
    'INTERNAL_SERVER_ERROR'
  );
};

module.exports = errorHandler;


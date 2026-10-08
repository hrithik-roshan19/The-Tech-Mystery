/**
 * Standardized API Response Helpers
 * Ensures uniform JSON structure across all endpoints.
 */

const success = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const responsePayload = {
    success: true,
    message,
    data
  };

  if (meta) {
    responsePayload.meta = meta;
  }

  return res.status(statusCode).json(responsePayload);
};

const created = (res, data = null, message = 'Resource created successfully') => {
  return success(res, data, message, 201);
};

const error = (res, message = 'An error occurred', statusCode = 500, errors = null, errorCode = 'INTERNAL_ERROR') => {
  const responsePayload = {
    success: false,
    message,
    errorCode
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  return res.status(statusCode).json(responsePayload);
};

const badRequest = (res, message = 'Bad request', errors = null) => {
  return error(res, message, 400, errors, 'BAD_REQUEST');
};

const unauthorized = (res, message = 'Authentication required') => {
  return error(res, message, 401, null, 'UNAUTHORIZED');
};

const forbidden = (res, message = 'Access denied') => {
  return error(res, message, 403, null, 'FORBIDDEN');
};

const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404, null, 'NOT_FOUND');
};

const rateLimited = (res, message = 'Too many requests. Please wait before retrying.') => {
  return error(res, message, 429, null, 'RATE_LIMIT_EXCEEDED');
};

module.exports = {
  success,
  created,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  rateLimited
};


const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/apiResponse');

/**
 * Middleware runner that inspects express-validator results
 * Returns clean formatted errors if schema validation fails.
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return badRequest(res, 'Request validation failed', formattedErrors);
  };
};

module.exports = validate;


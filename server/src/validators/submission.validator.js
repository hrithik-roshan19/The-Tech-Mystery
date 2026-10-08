const { body } = require('express-validator');

const submitFlagValidator = [
  body('levelNumber')
    .isInt({ min: 1, max: 20 })
    .withMessage('A valid integer levelNumber is required'),
  body('flag')
    .trim()
    .notEmpty()
    .withMessage('Flag submission string is required')
    .isLength({ max: 200 })
    .withMessage('Flag exceeds maximum allowed length')
];

module.exports = {
  submitFlagValidator
};


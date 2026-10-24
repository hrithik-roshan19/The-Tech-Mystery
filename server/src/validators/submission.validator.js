const { body, oneOf } = require('express-validator');

const submitFlagValidator = [
  body('levelNumber')
    .isInt({ min: 1, max: 20 })
    .withMessage('A valid integer levelNumber is required'),
  oneOf(
    [
      body('flag')
        .exists()
        .trim()
        .notEmpty()
        .withMessage('Flag submission string is required')
        .isLength({ max: 500 })
        .withMessage('Flag exceeds maximum allowed length'),
      body('answer')
        .exists()
        .trim()
        .notEmpty()
        .withMessage('Answer submission string is required')
        .isLength({ max: 500 })
        .withMessage('Answer exceeds maximum allowed length')
    ],
    'Answer or flag submission string is required'
  )
];

module.exports = {
  submitFlagValidator
};

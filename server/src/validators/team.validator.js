const { body } = require('express-validator');

const createTeamValidator = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 40 })
    .withMessage('Team name must be between 3 and 40 characters')
];

const joinTeamValidator = [
  body('joinCode')
    .trim()
    .notEmpty()
    .withMessage('Team join code is required')
];

module.exports = {
  createTeamValidator,
  joinTeamValidator
};

const { body } = require('express-validator');

const createTeamValidator = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 40 })
    .withMessage('Team name must be between 3 and 40 characters'),
  body('college')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('College name must not exceed 100 characters'),
  body('motto')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage('Team motto must not exceed 120 characters'),
  body('members')
    .optional({ nullable: true })
    .isArray({ max: 3 })
    .withMessage('Team can have at most 3 additional members')
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

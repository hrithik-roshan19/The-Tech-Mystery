const express = require('express');
const submissionController = require('../controllers/submission.controller');
const validate = require('../middleware/validate.middleware');
const { submitFlagValidator } = require('../validators/submission.validator');
const { submissionLimiter } = require('../middleware/rateLimiter.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { requireTeamMembership } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(requireTeamMembership);

router.post(
  '/submit',
  submissionLimiter,
  validate(submitFlagValidator),
  submissionController.submitFlag
);

module.exports = router;


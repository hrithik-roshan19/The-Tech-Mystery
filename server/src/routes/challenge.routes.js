const express = require('express');
const challengeController = require('../controllers/challenge.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireTeamMembership } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(requireTeamMembership);

router.get('/mission-map', challengeController.getMissionMap);
router.get('/current', challengeController.getCurrentChallenge);
router.get('/:levelNumber', challengeController.getCurrentChallenge);

module.exports = router;


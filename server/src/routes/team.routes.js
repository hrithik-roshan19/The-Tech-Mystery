const express = require('express');
const teamController = require('../controllers/team.controller');
const validate = require('../middleware/validate.middleware');
const { createTeamValidator, joinTeamValidator } = require('../validators/team.validator');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate); // All team actions require authenticated user

router.post('/', validate(createTeamValidator), teamController.createTeam);
router.post('/create', validate(createTeamValidator), teamController.createTeam);
router.post('/register', validate(createTeamValidator), teamController.createTeam);
router.post('/join', validate(joinTeamValidator), teamController.joinTeam);
router.get('/me', teamController.getMyTeam);
router.get('/my-team', teamController.getMyTeam);
router.post('/:id/join-code/rotate', teamController.rotateJoinCode);
router.get('/:id', teamController.getTeamById);

module.exports = router;


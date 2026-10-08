const express = require('express');
const leaderboardController = require('../controllers/leaderboard.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Live leaderboard can be queried publicly or with auth
router.get('/', optionalAuth, leaderboardController.getLiveLeaderboard);

module.exports = router;


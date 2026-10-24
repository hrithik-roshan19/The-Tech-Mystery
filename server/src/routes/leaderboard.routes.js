const express = require('express');
const leaderboardController = require('../controllers/leaderboard.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Live leaderboard can be queried publicly or with auth
router.get('/', optionalAuth, (req, res, next) => leaderboardController.getLiveLeaderboard(req, res, next));

// Real-time Server-Sent Events (SSE) leaderboard stream
router.get('/stream', optionalAuth, (req, res) => leaderboardController.streamLeaderboard(req, res));

module.exports = router;

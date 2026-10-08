const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const teamRoutes = require('./team.routes');
const challengeRoutes = require('./challenge.routes');
const submissionRoutes = require('./submission.routes');
const checkpointRoutes = require('./checkpoint.routes');
const leaderboardRoutes = require('./leaderboard.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/challenges', challengeRoutes);
router.use('/submissions', submissionRoutes);
router.use('/checkpoints', checkpointRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/admin', adminRoutes);

module.exports = router;


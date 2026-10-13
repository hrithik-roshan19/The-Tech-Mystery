const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard-stats', adminController.getDashboardStats);

// Teams
router.get('/teams', adminController.getAllTeams);
router.patch('/teams/:teamId/disqualify', adminController.disqualifyTeam);

// Challenges & Pool
router.get('/challenges', adminController.getChallenges);
router.post('/challenges', adminController.createChallenge);
router.patch('/challenges/:challengeId', adminController.updateChallenge);
router.get('/questions', adminController.getQuestions);
router.post('/questions', adminController.createQuestion);
router.patch('/questions/:questionId', adminController.updateQuestion);

// Checkpoints
router.get('/checkpoints', adminController.getCheckpoints);
router.post('/checkpoints', adminController.createCheckpoint);
router.patch('/checkpoints/:checkpointId', adminController.updateCheckpoint);

// Audit logs & Submissions Review
router.get('/submissions', adminController.getSubmissionLogs);
router.patch('/submissions/:submissionId/review', adminController.reviewSubmission);

// Event Control
router.patch('/event-config', adminController.updateEventConfig);
router.post('/announcements', adminController.createAnnouncement);

// Security & Audit Logs
router.get('/security-logs', adminController.getSecurityLogs);
router.patch('/security-logs/:logId/review', adminController.reviewSecurityLog);

module.exports = router;


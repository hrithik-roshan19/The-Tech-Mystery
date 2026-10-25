const express = require('express');
const adminController = require('../controllers/admin.controller');
const leaderboardController = require('../controllers/leaderboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard-stats', adminController.getDashboardStats);

// Leaderboard (authoritative admin view)
router.get('/leaderboard', leaderboardController.getAdminLeaderboard);

// Teams
router.get('/teams', adminController.getAllTeams);
router.post('/teams', adminController.createTeam);
router.patch('/teams/:teamId', adminController.updateTeam);
router.post('/teams/:teamId/members', adminController.addTeamMember);
router.delete('/teams/:teamId/members/:userId', adminController.removeTeamMember);
router.delete('/teams/:teamId', adminController.deleteTeam);
router.patch('/teams/:teamId/disqualify', adminController.disqualifyTeam);

// Challenges & Pool
router.get('/challenges', adminController.getChallenges);
router.post('/challenges', adminController.createChallenge);
router.patch('/challenges/:challengeId', adminController.updateChallenge);
router.delete('/challenges/:challengeId', adminController.deleteChallenge);
router.get('/questions', adminController.getQuestions);
router.put('/questions/reorder', adminController.reorderQuestions);
router.post('/questions/reorder', adminController.reorderQuestions);
router.post('/questions', adminController.createQuestion);
router.post('/questions/upload', adminController.uploadQuestions);
router.post('/questions/bulk', adminController.uploadQuestions);
router.get('/questions/:questionId/qr', adminController.getQuestionQr);
router.get('/questions/:questionId/qr/download', adminController.downloadQuestionQr);
router.patch('/questions/:questionId', adminController.updateQuestion);
router.delete('/questions/:questionId', adminController.deleteQuestion);
router.post('/questions/:questionId/release-claim', adminController.releaseQuestionClaim);

// Checkpoints
router.get('/checkpoints', adminController.getCheckpoints);
router.post('/checkpoints', adminController.createCheckpoint);
router.get('/checkpoints/:checkpointId/qr', adminController.getCheckpointQr);
router.get('/checkpoints/:checkpointId/qr/download', adminController.downloadCheckpointQr);
router.patch('/checkpoints/:checkpointId', adminController.updateCheckpoint);
router.get('/checkpoint-locations', adminController.getCheckpointLocations);
router.patch('/checkpoint-locations/:levelNumber', adminController.updateCheckpointLocation);
router.post('/checkpoint-locations', adminController.updateCheckpointLocation);

// Audit logs & Submissions Review
router.get('/submissions', adminController.getSubmissionLogs);
router.patch('/submissions/:submissionId/review', adminController.reviewSubmission);

// Event Control
router.patch('/event-config', adminController.updateEventConfig);
router.post('/announcements', adminController.createAnnouncement);

// Security & Audit Logs
router.get('/security-logs', adminController.getSecurityLogs);
router.patch('/security-logs/:logId/review', adminController.reviewSecurityLog);

// Admin Profile & Account Preferences
router.get('/profile', adminController.getAdminProfile);
router.patch('/profile', adminController.updateAdminProfile);
router.post('/sessions/revoke', adminController.revokeSession);

module.exports = router;


const express = require('express');
const checkpointController = require('../controllers/checkpoint.controller');
const { qrScanLimiter } = require('../middleware/rateLimiter.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { requireTeamMembership } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(requireTeamMembership);

router.post('/scan', qrScanLimiter, checkpointController.scanCheckpoint);

module.exports = router;


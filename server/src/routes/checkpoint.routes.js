const express = require('express');
const checkpointController = require('../controllers/checkpoint.controller');
const { qrScanLimiter } = require('../middleware/rateLimiter.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { requireTeamMembership } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(requireTeamMembership);

router.post('/scan', qrScanLimiter, (req, res, next) => checkpointController.scanCheckpoint(req, res, next));
router.post('/scan/:checkpointId', qrScanLimiter, (req, res, next) => checkpointController.scanCheckpoint(req, res, next));
router.post('/claim', qrScanLimiter, (req, res, next) => checkpointController.scanCheckpoint(req, res, next));
router.post('/claim/:questionId', qrScanLimiter, (req, res, next) => checkpointController.scanCheckpoint(req, res, next));
router.get('/:checkpointId', (req, res, next) => checkpointController.getCheckpointDetails(req, res, next));

module.exports = router;

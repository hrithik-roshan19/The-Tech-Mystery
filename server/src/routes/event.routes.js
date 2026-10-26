const express = require('express');
const eventController = require('../controllers/event.controller');

const router = express.Router();

// Public, unauthenticated endpoint for participants and visitors to query authoritative event state
router.get('/status', (req, res, next) => eventController.getEventStatus(req, res, next));
router.get('/', (req, res, next) => eventController.getEventStatus(req, res, next));

module.exports = router;

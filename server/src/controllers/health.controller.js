const mongoose = require('mongoose');
const { success } = require('../utils/apiResponse');
const config = require('../config/environment');

/**
 * Health check controller
 * Reports server status, database connectivity, and uptime.
 */
const getHealth = async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  let identityIndexPresent = false;
  let event = null;
  if (dbState === 1) {
    try {
      const User = mongoose.model('User');
      const indexes = await User.collection.indexes();
      identityIndexPresent = indexes.some(index =>
        index?.unique &&
        index?.key &&
        Object.keys(index.key).length === 1 &&
        index.key.clerkUserId &&
        Math.abs(Number(index.key.clerkUserId)) === 1
      );
    } catch (_) {}

    try {
      const EventConfig = mongoose.model('EventConfig');
      const cfg = await EventConfig.findOne().select('state maintenanceMode registrationOpen startTime endTime registrationDeadline');
      if (cfg) {
        event = {
          exists: true,
          state: cfg.state,
          maintenanceMode: Boolean(cfg.maintenanceMode),
          registrationOpen: Boolean(cfg.registrationOpen),
          hasStartTime: Boolean(cfg.startTime),
          hasEndTime: Boolean(cfg.endTime),
          hasRegistrationDeadline: Boolean(cfg.registrationDeadline)
        };
      } else {
        event = { exists: false };
      }
    } catch (_) {}
  }

  return success(
    res,
    {
      status: 'ONLINE',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStateMap[dbState] || 'unknown',
      nodeVersion: process.version,
      auth: {
        provider: config.authProvider,
        clerkConfigured: !!config.clerk?.secretKey,
        clerkSecretType: config.clerk?.secretKey
          ? (config.clerk.secretKey.startsWith('sk_live_') ? 'live' : (config.clerk.secretKey.startsWith('sk_test_') ? 'test' : 'other'))
          : 'none',
        clerkIssuer: config.clerk?.issuer || null,
        clerkAuthorizedParties: config.clerk?.authorizedParties || [],
        identityIndexPresent
      },
      event
    },
    'The Tech Mystery Core API is healthy and operational'
  );
};

module.exports = {
  getHealth
};


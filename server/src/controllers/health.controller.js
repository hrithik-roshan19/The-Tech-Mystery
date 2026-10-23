const mongoose = require('mongoose');
const { success } = require('../utils/apiResponse');
const config = require('../config/environment');

/**
 * Health check controller
 * Reports server status, database connectivity, and uptime.
 */
const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

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
        clerkAuthorizedParties: config.clerk?.authorizedParties || []
      }
    },
    'The Tech Mystery Core API is healthy and operational'
  );
};

module.exports = {
  getHealth
};


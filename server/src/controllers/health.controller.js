const mongoose = require('mongoose');
const { success } = require('../utils/apiResponse');

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
      nodeVersion: process.version
    },
    'Hack the Grid Core API is healthy and operational'
  );
};

module.exports = {
  getHealth
};

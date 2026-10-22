const config = require('../config/environment');
// Explicit provider selection prevents fallback/downgrade in Clerk mode.
module.exports = config.authProvider === 'clerk'
  ? require('./clerkAuth.middleware')
  : require('./legacyAuth.middleware');

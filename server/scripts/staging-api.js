// Dedicated bootstrap: never uses the unrestricted live server listener.
async function main() {
  if (process.env.HTG_APPROVED_STAGING_START !== 'yes') throw new Error('Explicit staging approval required');
  require('./staging-config').validateStagingConfig(process.env);
  const mongoose = require('mongoose');
  const connectDB = require('../src/config/db');
  const app = require('../src/server');
  await connectDB();
  const server = app.listen(5100, '127.0.0.1', () => console.log('Isolated staging API listening on loopback port 5100'));
  const shutdown = () => server.close(() => { mongoose.disconnect().finally(() => process.exit(0)); });
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
main().catch(() => { console.error('Staging API refused or failed to start; no live target was selected.'); process.exitCode = 1; });

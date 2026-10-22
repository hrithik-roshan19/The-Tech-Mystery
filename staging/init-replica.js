// PREPARED ONLY. Explicit organizer approval is required before execution.
// Run inside the dedicated staging container, never against an existing mongod.
/* global db, rs, sleep */
const fs = require('fs');
if (process.env.HTG_APPROVED_STAGING_INIT !== 'yes' ||
    process.env.MONGO_INITDB_ROOT_USERNAME !== 'htg_staging_bootstrap' ||
    !['localhost:27027', '127.0.0.1:27027'].includes(db.getMongo().host)) {
  throw new Error('Explicit approval and dedicated local staging container required');
}
const secret = name => fs.readFileSync(`/run/secrets/${name}`, 'utf8').trim();
const admin = db.getSiblingDB('admin');
if (!admin.auth('htg_staging_bootstrap', secret('mongo-root-password'))) throw new Error('Staging authentication failed');
let status;
try { status = rs.status(); } catch (error) {
  if (error.code !== 94) throw new Error('Unexpected staging replica state');
  rs.initiate({ _id: 'htg-staging', members: [{ _id: 0, host: 'localhost:27027' }] });
}
for (let attempt = 0; attempt < 60; attempt++) {
  const hello = admin.runCommand({ hello: 1 });
  if (hello.setName && hello.setName !== 'htg-staging') throw new Error('Refusing non-staging replica set');
  if (hello.isWritablePrimary) break;
  if (attempt === 59) throw new Error('Staging primary election timed out');
  sleep(500);
}
if (status && status.set !== 'htg-staging') throw new Error('Refusing non-staging replica set');
const staging = db.getSiblingDB('hack_the_grid_staging');
if (!staging.getUser('htg_staging_app')) {
  staging.createUser({ user: 'htg_staging_app', pwd: secret('mongo-app-password'),
    roles: [{ role: 'readWrite', db: 'hack_the_grid_staging' }] });
}

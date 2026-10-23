/**
 * Safe Event Configuration Utility for The Tech Mystery.
 * Inspects, reconciles, and transitions competition lifecycle states safely.
 * Reports safe metadata only; NEVER prints secrets, tokens, or credentials.
 */
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const config = require('../src/config/environment');
const { EventConfig } = require('../src/models');
const { EVENT_STATES } = require('../constants/eventStates');

async function main() {
  const args = process.argv.slice(2);
  const mongoUri = config.mongodbUri || process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('example.mongodb.net') || mongoUri.includes('<password>')) {
    throw new Error('Valid MONGODB_URI is required to configure event settings');
  }

  await mongoose.connect(mongoUri);
  const dbName = mongoose.connection.name;

  console.log('='.repeat(60));
  console.log('THE TECH MYSTERY — EVENT LIFECYCLE CONFIGURATION');
  console.log('='.repeat(60));
  console.log(`[✓] Connected to MongoDB database: ${dbName}`);

  let eventConfig = await EventConfig.findOne();
  if (!eventConfig) {
    console.log('[*] EventConfig singleton missing. Initializing baseline document in DRAFT state...');
    eventConfig = await EventConfig.create({});
    console.log('[✓] Baseline EventConfig singleton created.');
  }

  // Parse CLI flags
  let modified = false;

  const stateIndex = args.indexOf('--state');
  if (stateIndex !== -1 && args[stateIndex + 1]) {
    const requestedState = args[stateIndex + 1].toUpperCase();
    if (!Object.values(EVENT_STATES).includes(requestedState)) {
      throw new Error(`Invalid state '${requestedState}'. Valid states: ${Object.values(EVENT_STATES).join(', ')}`);
    }
    eventConfig.state = requestedState;
    modified = true;
    console.log(`[*] Updating event state to: ${requestedState}`);
  }

  if (args.includes('--registration-open')) {
    eventConfig.registrationOpen = true;
    modified = true;
    console.log('[*] Updating registrationOpen to: true');
  }

  if (args.includes('--registration-closed')) {
    eventConfig.registrationOpen = false;
    modified = true;
    console.log('[*] Updating registrationOpen to: false');
  }

  if (args.includes('--maintenance-on')) {
    eventConfig.maintenanceMode = true;
    modified = true;
    console.log('[*] Updating maintenanceMode to: true');
  }

  if (args.includes('--maintenance-off')) {
    eventConfig.maintenanceMode = false;
    modified = true;
    console.log('[*] Updating maintenanceMode to: false');
  }

  if (modified) {
    await eventConfig.save();
    console.log('[✓] Event configuration changes successfully saved to database.');
  }

  // Print current status
  console.log('\n--- CURRENT EVENT STATUS ---');
  console.log(`  Event Name:         ${eventConfig.eventName}`);
  console.log(`  Organizer:          ${eventConfig.organizer}`);
  console.log(`  Lifecycle State:    ${eventConfig.state}`);
  console.log(`  Registration:       ${eventConfig.registrationOpen ? 'OPEN' : 'CLOSED'}`);
  console.log(`  Maintenance Mode:   ${eventConfig.maintenanceMode ? 'ENABLED (PAUSED)' : 'DISABLED (ACTIVE)'}`);
  console.log(`  Start Time:         ${eventConfig.startTime ? new Date(eventConfig.startTime).toISOString() : 'Not Set'}`);
  console.log(`  End Time:           ${eventConfig.endTime ? new Date(eventConfig.endTime).toISOString() : 'Not Set'}`);
  console.log(`  Reg Deadline:       ${eventConfig.registrationDeadline ? new Date(eventConfig.registrationDeadline).toISOString() : 'Not Set'}`);
  console.log(`  Total Levels:       ${eventConfig.totalLevels}`);
  console.log(`  Max Teams:          ${eventConfig.maxTeams}`);
  console.log(`  Team Size:          ${eventConfig.minTeamSize}-${eventConfig.maxTeamSize} members`);
  console.log(`  Leaderboard:        ${eventConfig.isLeaderboardVisible ? 'VISIBLE' : 'HIDDEN'} (${eventConfig.isLeaderboardFrozen ? 'FROZEN' : 'LIVE'})`);
  console.log('='.repeat(60));

  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch(err => {
    console.error(`[✗] Event configuration failed: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { main };

/**
 * Database cleanup script for The Tech Mystery.
 * Safely removes dummy/demo teams, scores, submissions, progress, and seeded participants.
 * Preserves the authoritative admin account (hrx_admin), challenges, questions, checkpoints, and event config.
 */
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hack_the_grid';

async function clean() {
  console.log('='.repeat(60));
  console.log('THE TECH MYSTERY — CLEANING DUMMY/DEMO DATA FROM DATABASE');
  console.log('='.repeat(60));

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const dbName = mongoose.connection.name;
  console.log(`[✓] Connected to MongoDB database: ${dbName}`);

  // 1. Verify authoritative admin exists before doing anything
  const admin = await db.collection('users').findOne({
    role: 'ADMIN',
    username: 'hrx_admin'
  });
  if (!admin) {
    throw new Error("Safety check failed: Authoritative admin 'hrx_admin' not found. Aborting cleanup.");
  }
  console.log(`[✓] Authoritative admin 'hrx_admin' confirmed present (ID: ${admin._id}, Clerk: ${admin.clerkUserId ? 'MAPPED' : 'UNMAPPED'})`);

  // 2. Remove dummy teams
  const teamResult = await db.collection('teams').deleteMany({});
  console.log(`[✓] Deleted ${teamResult.deletedCount} dummy teams`);

  // 3. Remove dummy team scores
  const scoreResult = await db.collection('scores').deleteMany({});
  console.log(`[✓] Deleted ${scoreResult.deletedCount} dummy score records`);

  // 4. Remove dummy submissions
  const subResult = await db.collection('submissions').deleteMany({});
  console.log(`[✓] Deleted ${subResult.deletedCount} dummy submissions`);

  // 5. Remove dummy team challenges progress
  const tcResult = await db.collection('teamchallenges').deleteMany({});
  console.log(`[✓] Deleted ${tcResult.deletedCount} dummy team challenge records`);

  // 6. Remove seeded demo participants (keep only ADMIN accounts)
  const userResult = await db.collection('users').deleteMany({
    role: { $ne: 'ADMIN' }
  });
  console.log(`[✓] Deleted ${userResult.deletedCount} seeded demo participant accounts`);

  // Also remove any test fixture admin accounts created during tests, keeping hrx_admin
  const testAdminResult = await db.collection('users').deleteMany({
    role: 'ADMIN',
    username: { $in: ['inactive_1792396161236', 'testadmin_1792396161236'] }
  });
  if (testAdminResult.deletedCount > 0) {
    console.log(`[✓] Removed ${testAdminResult.deletedCount} automated test fixture admin accounts`);
  }

  // Clear any teamId on remaining admin account
  await db.collection('users').updateOne(
    { _id: admin._id },
    { $set: { teamId: null } }
  );

  // 7. Reset checkpoint scan counters to 0
  const cpResult = await db.collection('checkpoints').updateMany(
    {},
    {
      $set: {
        scanCount: 0,
        lastScanAt: null,
        boundTeamId: null
      },
      $unset: {
        scansCount: '' // remove legacy typo field if present
      }
    }
  );
  console.log(`[✓] Reset scan counts to 0 for ${cpResult.matchedCount} checkpoints`);

  // 8. Clean fake seeded security logs (preserve genuine admin config logs)
  const logResult = await db.collection('securitylogs').deleteMany({
    $or: [
      { eventId: { $in: ['EVT-9F21A', 'EVT-9F219', 'EVT-9F218'] } },
      { actor: { $in: ['team_4821', 'team_1038', 'unknown@192.168.1.84'] } },
      { event: 'Team disqualified' }
    ]
  });
  console.log(`[✓] Deleted ${logResult.deletedCount} dummy/test security audit logs`);

  // 9. Summary verification
  console.log('\n--- POST-CLEANUP DATABASE COUNTS ---');
  const collections = ['teams', 'scores', 'submissions', 'teamchallenges', 'users', 'checkpoints', 'challenges', 'questions', 'eventconfigs', 'securitylogs'];
  for (const c of collections) {
    const count = await db.collection(c).countDocuments();
    console.log(`- ${c}: ${count}`);
  }

  console.log('\n[✓] CLEANUP COMPLETE: Database is in clean zero-team initial event state.');
  console.log('='.repeat(60) + '\n');

  await mongoose.disconnect();
}

clean().catch(err => {
  console.error('\n[✗] Cleanup failed:', err.message);
  process.exit(1);
});


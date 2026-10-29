const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const EXPECTED_USER_ID = new mongoose.Types.ObjectId('6adf4935df002da26e0e91b4');
const EXPECTED_USERNAME = 'hrx_admin';
const EXPECTED_EMAIL = 'admin@codesphere.tulas.edu.in';
const EXPECTED_ROLE = 'ADMIN';
const EXPECTED_STALE_CLERK_ID = 'user_3Ky3EcpRf6X07gWz19VwT3p54lN';
const TARGET_LIVE_CLERK_ID = 'user_3LEI3JAUwrobh68puYmDl2M92mm';
const TARGET_DB = 'test';

async function executeRelink() {
  console.log('='.repeat(65));
  console.log('THE TECH MYSTERY — PRODUCTION ADMIN CLERK RELINK');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Target Database:', TARGET_DB);
  console.log('='.repeat(65));

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment');
  }

  await mongoose.connect(mongoUri, { dbName: TARGET_DB });
  const db = mongoose.connection.db;
  console.log(`[✓] Connected to MongoDB Atlas cluster: ${mongoose.connection.host}`);
  console.log(`[✓] Active Database: ${db.databaseName}`);

  if (db.databaseName !== TARGET_DB) {
    throw new Error(`Database safety abort: Connected to '${db.databaseName}', expected '${TARGET_DB}'`);
  }

  const usersCol = db.collection('users');

  // PRECONDITION 1: Collision check for TARGET_LIVE_CLERK_ID
  console.log('\n[1/5] Checking for collision with target live Clerk ID...');
  const collision = await usersCol.findOne({ clerkUserId: TARGET_LIVE_CLERK_ID });
  if (collision) {
    throw new Error(`Safety abort: Target Clerk ID ${TARGET_LIVE_CLERK_ID} is already linked to user ${collision.username} (${collision._id})`);
  }
  console.log(`[✓] Zero collisions: Target Clerk ID (${TARGET_LIVE_CLERK_ID.slice(0, 10)}...) is not linked to any user.`);

  // PRECONDITION 2: Inspect existing admin record
  console.log('\n[2/5] Inspecting existing admin record in database...');
  const beforeUser = await usersCol.findOne({ _id: EXPECTED_USER_ID });
  if (!beforeUser) {
    throw new Error(`Safety abort: Admin record with _id ${EXPECTED_USER_ID} not found.`);
  }

  console.log('BEFORE Record Status:');
  console.log(' - _id:', String(beforeUser._id));
  console.log(' - username:', beforeUser.username);
  console.log(' - email:', beforeUser.email);
  console.log(' - role:', beforeUser.role);
  console.log(' - isActive:', beforeUser.isActive);
  console.log(' - clerkUserId:', beforeUser.clerkUserId);
  console.log(' - hasPasswordHash:', Boolean(beforeUser.passwordHash));
  console.log(' - tokenVersion:', beforeUser.tokenVersion);

  // Validate all fields match expected invariants
  if (beforeUser.username !== EXPECTED_USERNAME) {
    throw new Error(`Safety abort: Username mismatch (expected '${EXPECTED_USERNAME}', got '${beforeUser.username}')`);
  }
  if (beforeUser.email.toLowerCase() !== EXPECTED_EMAIL.toLowerCase()) {
    throw new Error(`Safety abort: Email mismatch (expected '${EXPECTED_EMAIL}', got '${beforeUser.email}')`);
  }
  if (beforeUser.role !== EXPECTED_ROLE) {
    throw new Error(`Safety abort: Role mismatch (expected '${EXPECTED_ROLE}', got '${beforeUser.role}')`);
  }
  if (!beforeUser.isActive) {
    throw new Error('Safety abort: Admin account is not active');
  }
  if (beforeUser.clerkUserId !== EXPECTED_STALE_CLERK_ID) {
    throw new Error(`Safety abort: clerkUserId mismatch (expected stale ID '${EXPECTED_STALE_CLERK_ID}', got '${beforeUser.clerkUserId}')`);
  }
  console.log('[✓] All preconditions verified successfully.');

  // CONDITIONAL ATOMIC UPDATE
  console.log('\n[3/5] Executing conditional atomic update...');
  const updateFilter = {
    _id: EXPECTED_USER_ID,
    username: EXPECTED_USERNAME,
    email: EXPECTED_EMAIL,
    role: EXPECTED_ROLE,
    isActive: true,
    clerkUserId: EXPECTED_STALE_CLERK_ID
  };

  const updateDoc = {
    $set: {
      clerkUserId: TARGET_LIVE_CLERK_ID,
      clerkLinkedAt: new Date()
    }
  };

  const result = await usersCol.updateOne(updateFilter, updateDoc);
  console.log(`Update Result: matchedCount=${result.matchedCount}, modifiedCount=${result.modifiedCount}`);

  if (result.matchedCount !== 1 || result.modifiedCount !== 1) {
    throw new Error(`Safety abort: Update failed. matchedCount: ${result.matchedCount}, modifiedCount: ${result.modifiedCount}`);
  }
  console.log('[✓] Atomic update completed successfully.');

  // POST-UPDATE VERIFICATION
  console.log('\n[4/5] Verifying post-update record integrity...');
  const afterUser = await usersCol.findOne({ _id: EXPECTED_USER_ID });
  
  console.log('AFTER Record Status:');
  console.log(' - _id:', String(afterUser._id));
  console.log(' - username:', afterUser.username);
  console.log(' - email:', afterUser.email);
  console.log(' - role:', afterUser.role);
  console.log(' - isActive:', afterUser.isActive);
  console.log(' - clerkUserId:', afterUser.clerkUserId);
  console.log(' - clerkLinkedAt:', afterUser.clerkLinkedAt);
  console.log(' - hasPasswordHash:', Boolean(afterUser.passwordHash));
  console.log(' - passwordHashPreserved:', afterUser.passwordHash === beforeUser.passwordHash);
  console.log(' - tokenVersion:', afterUser.tokenVersion);
  console.log(' - tokenVersionPreserved:', afterUser.tokenVersion === beforeUser.tokenVersion);

  if (afterUser.clerkUserId !== TARGET_LIVE_CLERK_ID) {
    throw new Error(`Verification failure: clerkUserId is not ${TARGET_LIVE_CLERK_ID}`);
  }
  if (String(afterUser._id) !== String(beforeUser._id)) {
    throw new Error('Verification failure: _id was altered');
  }
  if (afterUser.username !== beforeUser.username) {
    throw new Error('Verification failure: username was altered');
  }
  if (afterUser.email !== beforeUser.email) {
    throw new Error('Verification failure: email was altered');
  }
  if (afterUser.role !== beforeUser.role) {
    throw new Error('Verification failure: role was altered');
  }
  if (afterUser.passwordHash !== beforeUser.passwordHash) {
    throw new Error('Verification failure: passwordHash was altered');
  }
  if (afterUser.tokenVersion !== beforeUser.tokenVersion) {
    throw new Error('Verification failure: tokenVersion was altered');
  }

  // TOTAL COLLECTION INVARIANT CHECK
  console.log('\n[5/5] Checking collection invariants...');
  const totalUsers = await usersCol.countDocuments();
  console.log(`Total users in '${TARGET_DB}':`, totalUsers);
  if (totalUsers !== 1) {
    throw new Error(`Safety warning: Unexpected user count in database: ${totalUsers}`);
  }

  const questionCount = await db.collection('questions').countDocuments();
  console.log(`Total questions in '${TARGET_DB}':`, questionCount);
  if (questionCount !== 731) {
    throw new Error(`Safety failure: Questions collection altered! Count: ${questionCount}`);
  }

  const checkpointCount = await db.collection('checkpoints').countDocuments();
  console.log(`Total checkpoints in '${TARGET_DB}':`, checkpointCount);
  if (checkpointCount !== 10) {
    throw new Error(`Safety failure: Checkpoints collection altered! Count: ${checkpointCount}`);
  }

  console.log('\n' + '='.repeat(65));
  console.log('RELINK OPERATION SUCCESSFUL AND FULLY VERIFIED');
  console.log('='.repeat(65));

  await mongoose.disconnect();
}

executeRelink().catch(err => {
  console.error('\n[FATAL ERROR]', err.message);
  process.exit(1);
});


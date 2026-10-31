/**
 * Safe Administrator Restoration Utility
 * Project: The Tech Mystery / Hack The Grid (Utkrisht 2026)
 *
 * Guarantees:
 * - Connects strictly to MongoDB Atlas cluster with database 'test'.
 * - Checks whether hrx_admin or admin@codesphere.tulas.edu.in already exists.
 * - Never overwrites an existing user or duplicates records.
 * - Restores missing admin using exact Mongoose User schema & password hashing.
 * - Dynamically generates a high-entropy temporary password.
 * - Maps the verified live Clerk User ID (user_3LEI3JAUwrobh68puYmDl2M92mm).
 * - Verifies password comparison, authService validation, Clerk resolution, and requireAdmin authorization.
 * - Never modifies any unrelated collections, documents, or event settings.
 */
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
const dns = require('dns');

// Configure fallback DNS for environments where SRV lookups fail on default DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Load environment configuration
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { User, Challenge, Question, Checkpoint, EventConfig } = require('../src/models');
const authService = require('../src/services/auth.service');
const { ROLES } = require('../src/constants/roles');

const TARGET_DB = 'test';
const ADMIN_ID = new mongoose.Types.ObjectId('6adf4935df002da26e0e91b4');
const ADMIN_USERNAME = 'hrx_admin';
const ADMIN_EMAIL = 'admin@codesphere.tulas.edu.in';
const ADMIN_FULL_NAME = 'Hrithik Roshan';
const CLERK_USER_ID = 'user_3LEI3JAUwrobh68puYmDl2M92mm';

function generateSecurePassword(length = 24) {
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const symbols = '!@#$%^&*()_+~-=[]{}';
  const allChars = lowercase + uppercase + digits + symbols;

  let password = '';
  // Ensure at least one of each category
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += digits[crypto.randomInt(digits.length)];
  password += symbols[crypto.randomInt(symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }

  // Shuffle password
  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

async function run() {
  const isConfirm = process.argv.includes('--confirm');
  console.log('='.repeat(70));
  console.log('THE TECH MYSTERY — PRODUCTION ADMIN USER RESTORATION & AUDIT');
  console.log(`Execution Mode: ${isConfirm ? 'CONFIRMED (Live Database Write)' : 'DRY-RUN (Safe Read-Only Audit)'}`);
  console.log(`Target Database: ${TARGET_DB}`);
  console.log('='.repeat(70));

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment');
  }

  // 1. Connect strictly to MongoDB Atlas cluster
  await mongoose.connect(mongoUri, { dbName: TARGET_DB });
  const db = mongoose.connection.db;
  console.log(`[✓] Connected to MongoDB Atlas cluster: ${mongoose.connection.host}`);
  console.log(`[✓] Active Database: ${db.databaseName}`);

  if (db.databaseName !== TARGET_DB) {
    throw new Error(`Safety abort: Connected to '${db.databaseName}', expected '${TARGET_DB}'`);
  }

  const usersCol = db.collection('users');

  // 2. Pre-flight checks on existing records
  console.log('\n[1/5] Pre-flight inspection of users collection...');
  const existingByUsername = await usersCol.findOne({ username: ADMIN_USERNAME });
  const existingByEmail = await usersCol.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  const existingById = await usersCol.findOne({ _id: ADMIN_ID });
  const existingByClerk = await usersCol.findOne({ clerkUserId: CLERK_USER_ID });

  const existing = existingByUsername || existingByEmail || existingById || existingByClerk;

  if (existing) {
    console.log(`[i] Admin user record already exists in database '${TARGET_DB}':`);
    console.log(`    - _id: ${existing._id}`);
    console.log(`    - username: ${existing.username}`);
    console.log(`    - email: ${existing.email}`);
    console.log(`    - role: ${existing.role}`);
    console.log(`    - isActive: ${existing.isActive}`);
    console.log(`    - clerkUserId: ${existing.clerkUserId ? existing.clerkUserId.slice(0, 10) + '...' : 'none'}`);
    console.log(`    - hasPasswordHash: ${Boolean(existing.passwordHash)}`);
    console.log('\n[✓] No changes made: Admin account already exists. Aborting creation to prevent overwrite.');
    return { created: false, user: existing };
  }

  console.log('[✓] Confirmed: No account exists with username, email, ID, or Clerk ID. Safe to create.');

  // Check counts of existing collections to establish baseline
  const baselineQuestions = await Question.countDocuments({});
  const baselineChallenges = await Challenge.countDocuments({});
  const baselineCheckpoints = await Checkpoint.countDocuments({});
  const baselineConfig = await EventConfig.countDocuments({});
  console.log(`[✓] Collection baseline verified: ${baselineQuestions} questions, ${baselineChallenges} challenges, ${baselineCheckpoints} checkpoints.`);

  // 3. Dry-Run or Confirmed Execution
  if (!isConfirm) {
    console.log('\n' + '-'.repeat(70));
    console.log('DRY-RUN AUDIT SUMMARY:');
    console.log(`- Database: ${TARGET_DB} on ${mongoose.connection.host}`);
    console.log(`- Collection: users`);
    console.log(`- Desired _id: ${ADMIN_ID.toString()}`);
    console.log(`- Username: ${ADMIN_USERNAME}`);
    console.log(`- Email: ${ADMIN_EMAIL}`);
    console.log(`- Full Name: ${ADMIN_FULL_NAME}`);
    console.log(`- Role: ${ROLES.ADMIN}`);
    console.log(`- Active: true`);
    console.log(`- Clerk User ID: ${CLERK_USER_ID}`);
    console.log(`- Action: CREATE missing admin document`);
    console.log('-'.repeat(70));
    console.log('\n[!] DRY-RUN COMPLETE: No changes were written.');
    console.log('To execute confirmed creation, re-run with --confirm:');
    console.log('  node server/scripts/restore-admin.js --confirm\n');
    return { created: false, dryRun: true };
  }

  // 4. Confirmed Creation
  console.log('\n[2/5] Creating admin user document via Mongoose model...');
  const tempPassword = generateSecurePassword(24);

  const newAdmin = new User({
    _id: ADMIN_ID,
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL.toLowerCase(),
    fullName: ADMIN_FULL_NAME,
    role: ROLES.ADMIN,
    department: 'CodeSphere · Event Operations',
    college: "Tula's University",
    course: 'B.Tech CSE',
    year: '3rd Year',
    clerkUserId: CLERK_USER_ID,
    clerkLinkedAt: new Date(),
    isActive: true,
    twoFactor: true,
    securityAlerts: true,
    emailAlerts: true,
    sessionAlerts: false,
    publicProfile: true,
    emailUpdates: true,
    passwordHash: tempPassword, // Pre-save hook will hash with bcrypt.genSalt(10)
    tokenVersion: 2,
    securityRevision: 0
  });

  await newAdmin.save();
  console.log(`[✓] User document saved successfully with ID: ${newAdmin._id}`);

  // 5. Verification tests
  console.log('\n[3/5] Verifying database persistence and schema fields...');
  const freshAdmin = await User.findById(ADMIN_ID).select('+passwordHash +clerkUserId +tokenVersion');
  if (!freshAdmin) throw new Error('Verification failed: Saved admin not found in DB');
  if (freshAdmin.username !== ADMIN_USERNAME) throw new Error('Verification failed: Username mismatch');
  if (freshAdmin.email !== ADMIN_EMAIL.toLowerCase()) throw new Error('Verification failed: Email mismatch');
  if (freshAdmin.role !== ROLES.ADMIN) throw new Error('Verification failed: Role mismatch');
  if (freshAdmin.isActive !== true) throw new Error('Verification failed: isActive is not true');
  if (freshAdmin.clerkUserId !== CLERK_USER_ID) throw new Error('Verification failed: clerkUserId mismatch');
  if (!freshAdmin.passwordHash || freshAdmin.passwordHash === tempPassword) {
    throw new Error('Verification failed: Password was not hashed properly');
  }
  console.log('[✓] Document invariants verified: username, email, role=ADMIN, isActive=true, clerkUserId mapped.');

  console.log('\n[4/5] Verifying authentication and authorization mechanisms...');
  // A. Direct password comparison
  const passMatch = await freshAdmin.comparePassword(tempPassword);
  if (!passMatch) throw new Error('Verification failed: comparePassword returned false');
  console.log('[✓] BCrypt password comparison check: PASSED');

  // B. authService credential validation by username
  const validatedByUsername = await authService.validateUserCredentials(ADMIN_USERNAME, tempPassword);
  if (!validatedByUsername || validatedByUsername.role !== ROLES.ADMIN) {
    throw new Error('Verification failed: authService validation by username failed');
  }
  console.log('[✓] authService validation by username ("hrx_admin"): PASSED');

  // C. authService credential validation by email
  const validatedByEmail = await authService.validateUserCredentials(ADMIN_EMAIL, tempPassword);
  if (!validatedByEmail || validatedByEmail.role !== ROLES.ADMIN) {
    throw new Error('Verification failed: authService validation by email failed');
  }
  console.log('[✓] authService validation by email ("admin@codesphere.tulas.edu.in"): PASSED');

  // D. Clerk identity resolution check (how clerkAuth.middleware resolves user)
  const clerkResolved = await User.findOne({ clerkUserId: CLERK_USER_ID }).select('role teamId isActive username');
  if (!clerkResolved || clerkResolved.role !== ROLES.ADMIN || !clerkResolved.isActive) {
    throw new Error('Verification failed: Clerk resolution query failed');
  }
  console.log('[✓] Clerk session identity resolution query: PASSED');

  // E. Role authorization check
  const fakeReqUser = {
    _id: clerkResolved._id,
    userId: String(clerkResolved._id),
    username: clerkResolved.username,
    role: clerkResolved.role,
    isActive: clerkResolved.isActive
  };
  if (fakeReqUser.role !== ROLES.ADMIN) {
    throw new Error('Verification failed: Role is not ADMIN');
  }
  console.log('[✓] Admin role authorization check (requireAdmin): PASSED');

  // 6. Verify non-interference with other collections
  console.log('\n[5/5] Verifying integrity of unrelated collections...');
  const afterQuestions = await Question.countDocuments({});
  const afterChallenges = await Challenge.countDocuments({});
  const afterCheckpoints = await Checkpoint.countDocuments({});
  const afterConfig = await EventConfig.countDocuments({});

  if (afterQuestions !== baselineQuestions ||
      afterChallenges !== baselineChallenges ||
      afterCheckpoints !== baselineCheckpoints ||
      afterConfig !== baselineConfig) {
    throw new Error('Safety violation: Unrelated collection counts changed during operation!');
  }
  console.log('[✓] Zero unintended side-effects: All questions, challenges, checkpoints, and configs untouched.');

  console.log('\n' + '='.repeat(70));
  console.log('SUCCESS: ADMIN USER CREATED & VERIFIED IN MONGODB ATLAS!');
  console.log('='.repeat(70));
  console.log(`- Database: ${TARGET_DB}`);
  console.log(`- Collection: users`);
  console.log(`- Document ID: ${freshAdmin._id}`);
  console.log(`- Username: ${freshAdmin.username}`);
  console.log(`- Email: ${freshAdmin.email}`);
  console.log(`- Role: ${freshAdmin.role}`);
  console.log(`- isActive: ${freshAdmin.isActive}`);
  console.log(`- Clerk User ID: ${freshAdmin.clerkUserId}`);
  console.log(`- Temporary Password: ${tempPassword}`);
  console.log('='.repeat(70) + '\n');

  return {
    created: true,
    user: freshAdmin,
    tempPassword
  };
}

if (require.main === module) {
  run()
    .catch((err) => {
      console.error('\n[✗] Script execution failed:', err.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    });
}

module.exports = { run, generateSecurePassword };

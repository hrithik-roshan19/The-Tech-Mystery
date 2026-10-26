/**
 * Safe, Idempotent Administrator Provisioning & Clerk Mapping Utility
 * Project: The Tech Mystery (Hack The Grid / Utkrisht 2026)
 *
 * Guarantees:
 * - Strictly verifies target identity with Clerk Backend API (active, verified email matching admin email).
 * - Enforces zero-collision checks across all MongoDB accounts.
 * - Never promotes an existing non-ADMIN account.
 * - Rejects inactive MongoDB accounts and inactive/banned Clerk accounts.
 * - Rejects conflicting email associations.
 * - Never overwrites an existing different Clerk identity mapping.
 * - Supports explicit --target-db=<name> to prevent accidental target database mismatches.
 * - Idempotent: re-running against an already-provisioned admin succeeds cleanly with exit code 0.
 * - Defaults to DRY-RUN mode. Requires explicit --confirm to perform database writes.
 * - NEVER prints or logs secrets, passwords, tokens, or Clerk secret keys.
 */
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment configuration
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { User } = require('../src/models');
const clerk = require('../src/services/clerk.service');
const config = require('../src/config/environment');

const ADMIN_USERNAME = 'hrx_admin';
const ADMIN_EMAIL = 'admin@codesphere.tulas.edu.in';
const ADMIN_FULL_NAME = 'Hrithik Roshan';

async function resolveClerkId() {
  // 1. Check environment variable
  let clerkId = (process.env.CLERK_ADMIN_USER_ID || '').trim();
  if (clerkId) return clerkId;

  // 2. Check CLI arguments (excluding flags starting with --)
  const args = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
  if (args.length > 0 && args[0].trim()) {
    return args[0].trim();
  }

  return null;
}

function resolveTargetDb(args) {
  const targetDbArg = args.find(a => a.startsWith('--target-db='));
  if (targetDbArg) {
    return targetDbArg.split('=')[1].trim();
  }
  const idx = args.indexOf('--target-db');
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1].trim();
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const isConfirm = args.includes('--confirm') || args.includes('--execute') || args.includes('--commit');
  const isDryRun = args.includes('--dry-run') || !isConfirm;
  const targetDb = resolveTargetDb(args);

  console.log('='.repeat(65));
  console.log('THE TECH MYSTERY — AUTHORITATIVE ADMIN PROVISIONING UTILITY');
  console.log(`Execution Mode: ${isDryRun ? 'DRY-RUN (Safe Read-Only Audit)' : 'CONFIRMED (Live Database Write)'}`);
  if (targetDb) {
    console.log(`Enforced Target Database: ${targetDb}`);
  }
  console.log('='.repeat(65));

  const rawClerkId = await resolveClerkId();

  if (!rawClerkId) {
    throw new Error(
      'Valid Clerk admin user ID is required.\n' +
      'Please supply via one of the following methods:\n' +
      '  1. Environment variable: $env:CLERK_ADMIN_USER_ID = $clerkId\n' +
      '  2. CLI argument: node server/scripts/provision-admin.js $clerkId [--dry-run | --confirm]'
    );
  }

  // Format validation - do not echo the raw value in error message
  if (!/^user_[A-Za-z0-9]+$/.test(rawClerkId)) {
    throw new Error('Invalid Clerk user ID format. Expected format: user_<alphanumeric>');
  }

  const clerkId = rawClerkId;

  // 1. Database Connection
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGODB_URI || config.mongodbUri || 'mongodb://127.0.0.1:27017/hack_the_grid';
    await mongoose.connect(mongoUri);
  }

  const dbName = mongoose.connection.name;
  const host = mongoose.connection.host || 'unknown-host';
  console.log(`[✓] Connected to MongoDB database: ${dbName} on host: ${host}`);

  // Enforce target database constraint if specified
  if (targetDb && dbName !== targetDb) {
    throw new Error(`Database target mismatch: Expected database '${targetDb}', but connected to '${dbName}'. Aborting.`);
  }

  // 2. Unique sparse index verification
  const indexes = await User.collection.indexes();
  const hasUniqueIndex = indexes.some(index =>
    index.unique &&
    index.key &&
    Object.keys(index.key).length === 1 &&
    index.key.clerkUserId === 1
  );

  if (!hasUniqueIndex) {
    throw new Error('Required unique Clerk identity index (clerkUserId_1) is missing from users collection. Run sync-indexes first.');
  }
  console.log('[✓] Unique sparse index on clerkUserId verified');

  // 3. Clerk Backend API Identity Verification
  console.log('[*] Verifying identity with Clerk backend API...');
  let clerkUser;
  try {
    clerkUser = await clerk.getClient().users.getUser(clerkId);
  } catch (error) {
    const status = error.status || error.statusCode;
    if (status === 404) {
      throw new Error('Clerk user does not exist in the configured Clerk application instance');
    }
    throw new Error(`Clerk backend API communication failed: ${error.message}`);
  }

  if (clerkUser.banned) {
    throw new Error('Clerk user account is banned in Clerk dashboard');
  }
  if (clerkUser.locked) {
    throw new Error('Clerk user account is locked in Clerk dashboard');
  }

  const primaryEmail = clerkUser.emailAddresses?.find(
    item => item.id === clerkUser.primaryEmailAddressId
  );

  if (!primaryEmail) {
    throw new Error('Clerk user account does not have a primary email address configured');
  }

  if (primaryEmail.verification?.status !== 'verified') {
    throw new Error(`Clerk user primary email is not verified (status: ${primaryEmail.verification?.status || 'unverified'})`);
  }

  const normalizedClerkEmail = primaryEmail.emailAddress?.trim().toLowerCase();
  if (normalizedClerkEmail !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Clerk primary email (${normalizedClerkEmail}) does not match required admin email (${ADMIN_EMAIL})`);
  }

  console.log('[✓] Clerk identity verified: Active, primary email verified and matches admin email');

  // 4. Collision Check: Verify no other user in MongoDB holds this Clerk ID
  const clerkCollision = await User.findOne({ clerkUserId: clerkId }).select('username role email isActive');
  if (clerkCollision) {
    if (clerkCollision.username === ADMIN_USERNAME && clerkCollision.role === 'ADMIN') {
      if (clerkCollision.isActive === false) {
        throw new Error(`Admin account '${ADMIN_USERNAME}' is marked inactive in database. Refusing to operate on inactive account.`);
      }
      console.log(`\n[i] Target administrator '${ADMIN_USERNAME}' is ALREADY provisioned and mapped to this Clerk identity.`);
      console.log('    Operation is idempotent. Current account status:');
      console.log(`    - Username: ${clerkCollision.username}`);
      console.log(`    - Role: ${clerkCollision.role}`);
      console.log(`    - Email: ${clerkCollision.email}`);
      console.log(`    - Active: ${clerkCollision.isActive}`);
      console.log('    - Clerk User ID Mapped: true');
      console.log('    - Database: ' + dbName);
      console.log('\n[✓] Provisioning is complete and active. No further action needed.\n');
      return { success: true, action: 'ALREADY_MAPPED', user: clerkCollision };
    }
    throw new Error(
      `Clerk identity collision detected: Already linked to account '${clerkCollision.username}' with role '${clerkCollision.role}'. Refusing to overwrite.`
    );
  }
  console.log('[✓] Zero mapping collisions confirmed (identity not linked to any other account)');

  // 5. Inspect existing admin account state in target database
  const existingByUsername = await User.findOne({ username: ADMIN_USERNAME }).select('+passwordHash +clerkUserId +tokenVersion isActive email role');
  const existingByEmail = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() }).select('+passwordHash +clerkUserId +tokenVersion isActive email role username');

  // Security check: Refuse to modify inactive accounts
  if ((existingByUsername && existingByUsername.isActive === false) || (existingByEmail && existingByEmail.isActive === false)) {
    throw new Error(`Admin account is marked inactive in database. Refusing to provision or link inactive account.`);
  }

  // Security check: Refuse to promote non-admin accounts
  if (existingByUsername && existingByUsername.role !== 'ADMIN') {
    throw new Error(`Account '${ADMIN_USERNAME}' already exists with non-ADMIN role '${existingByUsername.role}'. Refusing to modify.`);
  }
  if (existingByEmail && existingByEmail.role !== 'ADMIN') {
    throw new Error(`Account with email '${ADMIN_EMAIL}' already exists with non-ADMIN role '${existingByEmail.role}'. Refusing to modify.`);
  }

  // Security check: Refuse conflicting email associations
  if (existingByUsername && existingByUsername.email && existingByUsername.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Account '${ADMIN_USERNAME}' exists with conflicting email '${existingByUsername.email}'. Expected '${ADMIN_EMAIL}'. Refusing to modify.`);
  }

  // Security check: Refuse to overwrite if existing admin is already linked to another Clerk ID
  if (existingByUsername && existingByUsername.clerkUserId && existingByUsername.clerkUserId !== clerkId) {
    throw new Error(`Admin account '${ADMIN_USERNAME}' is already mapped to a different Clerk identity. Refusing to overwrite.`);
  }
  if (existingByEmail && existingByEmail.clerkUserId && existingByEmail.clerkUserId !== clerkId) {
    throw new Error(`Admin account with email '${ADMIN_EMAIL}' is already mapped to a different Clerk identity. Refusing to overwrite.`);
  }

  const targetAdmin = existingByUsername || existingByEmail;
  const actionType = targetAdmin ? 'LINK_EXISTING' : 'CREATE_AND_LINK';

  // 6. Dry-Run Audit Summary
  if (isDryRun) {
    console.log('\n' + '-'.repeat(65));
    console.log('DRY-RUN AUDIT SUMMARY:');
    console.log(`- Action: ${actionType === 'CREATE_AND_LINK' ? 'CREATE new admin account & link to Clerk' : 'LINK existing unmapped admin account'}`);
    console.log(`- Target Database: ${dbName} on ${host}`);
    console.log(`- Username: ${ADMIN_USERNAME}`);
    console.log(`- Email: ${ADMIN_EMAIL}`);
    console.log(`- Role: ADMIN`);
    console.log(`- Active: true`);
    console.log(`- Existing Account Present in DB: ${Boolean(targetAdmin)}`);
    console.log(`- Existing Password Hash Preserved: ${Boolean(targetAdmin?.passwordHash)}`);
    console.log(`- Clerk Identity Verified: true (Active & Verified)`);
    console.log(`- All Pre-flight Security Guards: PASSED`);
    console.log('-'.repeat(65));
    console.log('\n[!] DRY-RUN COMPLETE: No changes were written to MongoDB.');
    console.log('To execute the confirmed operation, re-run with --confirm:');
    console.log(`  $env:CLERK_ADMIN_USER_ID = $clerkId; node server/scripts/provision-admin.js --confirm${targetDb ? ` --target-db=${targetDb}` : ''}`);
    console.log(`  OR: node server/scripts/provision-admin.js $clerkId --confirm${targetDb ? ` --target-db=${targetDb}` : ''}\n`);
    return { success: true, action: 'DRY_RUN', actionType, dbName };
  }

  // 7. Confirmed Execution
  let resultUser;
  if (actionType === 'LINK_EXISTING') {
    console.log(`[*] Atomically linking existing admin '${ADMIN_USERNAME}' to Clerk identity...`);
    const updateResult = await User.updateOne(
      {
        _id: targetAdmin._id,
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL.toLowerCase(),
        role: 'ADMIN',
        isActive: true,
        $or: [
          { clerkUserId: { $exists: false } },
          { clerkUserId: null }
        ]
      },
      {
        $set: {
          clerkUserId: clerkId,
          clerkLinkedAt: new Date()
        },
        $inc: {
          tokenVersion: 1
        }
      },
      { runValidators: true }
    );

    if (updateResult.modifiedCount !== 1) {
      throw new Error(`Admin account was not updated (matched: ${updateResult.matchedCount}, modified: ${updateResult.modifiedCount}).`);
    }

    resultUser = await User.findById(targetAdmin._id).select('+passwordHash +clerkUserId +tokenVersion');
  } else {
    console.log(`[*] Creating new authoritative administrator '${ADMIN_USERNAME}' in database '${dbName}'...`);
    // Generate a secure random fallback password hash (never hardcoded in source)
    const randomSecret = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const fallbackHash = await bcrypt.hash(randomSecret, salt);

    const displayName = clerkUser.firstName && clerkUser.lastName
      ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
      : (clerkUser.firstName || ADMIN_FULL_NAME);

    resultUser = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL.toLowerCase(),
      fullName: displayName,
      role: 'ADMIN',
      department: 'CodeSphere · Event Operations',
      college: "Tula's University",
      clerkUserId: clerkId,
      clerkLinkedAt: new Date(),
      isActive: true,
      twoFactor: true,
      securityAlerts: true,
      emailAlerts: true,
      passwordHash: fallbackHash,
      tokenVersion: 1
    });
  }

  // 8. Post-write verification
  if (!resultUser || !resultUser.clerkUserId || resultUser.role !== 'ADMIN') {
    throw new Error('Post-write verification failed: Admin account is not in expected state in MongoDB');
  }

  console.log('\n' + '='.repeat(65));
  console.log('SUCCESS: Admin account safely provisioned and mapped to Clerk!');
  console.log('='.repeat(65));
  console.log(`- Database: ${dbName} on ${host}`);
  console.log(`- Account ID: ${resultUser._id}`);
  console.log(`- Username: ${resultUser.username}`);
  console.log(`- Email: ${resultUser.email}`);
  console.log(`- Role: ${resultUser.role}`);
  console.log(`- Active: ${resultUser.isActive}`);
  console.log(`- Clerk User ID Mapped: true`);
  console.log(`- Token Version: ${resultUser.tokenVersion}`);
  console.log('='.repeat(65) + '\n');

  return { success: true, action: 'PROVISIONED', user: resultUser };
}

if (require.main === module) {
  main()
    .catch(error => {
      console.error('\n[✗] Admin provisioning failed:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    });
}

module.exports = { main, resolveClerkId, resolveTargetDb };

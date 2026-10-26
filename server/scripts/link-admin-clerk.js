const path = require('path');
const dotenv = require('dotenv');

// Load environment from server/.env and root .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const readline = require('readline');
const { User } = require('../src/models');
const clerk = require('../src/services/clerk.service');
const config = require('../src/config/environment');

const ADMIN_USERNAME = 'hrx_admin';
const ADMIN_EMAIL = 'admin@codesphere.tulas.edu.in';

async function promptForClerkId() {
  if (!process.stdin.isTTY) {
    return null;
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question('Enter Clerk Admin User ID (format user_...): ', answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function resolveClerkId() {
  // 1. Check environment variable
  let clerkId = (process.env.CLERK_ADMIN_USER_ID || '').trim();
  if (clerkId) return clerkId;

  // 2. Check CLI arguments (excluding flags starting with --)
  const args = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
  if (args.length > 0 && args[0].trim()) {
    return args[0].trim();
  }

  // 3. Check interactive prompt if available
  const prompted = await promptForClerkId();
  if (prompted) return prompted;

  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const isConfirm = args.includes('--confirm') || args.includes('--execute') || args.includes('--commit');
  const isDryRun = args.includes('--dry-run') || !isConfirm;

  console.log('='.repeat(60));
  console.log('THE TECH MYSTERY \u2014 ADMIN CLERK MAPPING UTILITY');
  console.log(`Mode: ${isDryRun ? 'DRY-RUN (Safe Read-Only Audit)' : 'CONFIRMED (Live Write)'}`);
  console.log('='.repeat(60));

  const rawClerkId = await resolveClerkId();

  if (!rawClerkId) {
    throw new Error(
      'Valid Clerk admin user ID is required.\n' +
      'Please supply via one of the following methods:\n' +
      '  1. Environment variable: $env:CLERK_ADMIN_USER_ID = $clerkId\n' +
      '  2. CLI argument: node server/scripts/link-admin-clerk.js $clerkId [--dry-run | --confirm]'
    );
  }

  // Format validation - do not echo the raw value in case of format failure
  if (!/^user_[A-Za-z0-9]+$/.test(rawClerkId)) {
    throw new Error('Invalid Clerk user ID format. Expected format: user_<alphanumeric>');
  }

  const clerkId = rawClerkId;

  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGODB_URI || config.mongodbUri || 'mongodb://127.0.0.1:27017/hack_the_grid';
    await mongoose.connect(mongoUri);
  }

  const dbName = mongoose.connection.name;
  console.log(`[\u2713] Connected to MongoDB database: ${dbName}`);

  // 1. Verify unique sparse index on clerkUserId exists
  const indexes = await User.collection.indexes();
  const hasUniqueIndex = indexes.some(index =>
    index.unique &&
    index.key &&
    Object.keys(index.key).length === 1 &&
    index.key.clerkUserId === 1
  );

  if (!hasUniqueIndex) {
    throw new Error('Required unique Clerk identity index (clerkUserId_1) is missing from users collection');
  }
  console.log('[\u2713] Unique sparse index on clerkUserId verified');

  // 2. Verify Clerk user directly with Clerk's backend API
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
    throw new Error('Clerk user account is banned');
  }
  if (clerkUser.locked) {
    throw new Error('Clerk user account is locked');
  }

  const primaryEmail = clerkUser.emailAddresses?.find(
    item => item.id === clerkUser.primaryEmailAddressId
  );

  if (!primaryEmail) {
    throw new Error('Clerk user account does not have a primary email address');
  }

  if (primaryEmail.verification?.status !== 'verified') {
    throw new Error(`Clerk user primary email is not verified (status: ${primaryEmail.verification?.status || 'unverified'})`);
  }

  const normalizedClerkEmail = primaryEmail.emailAddress?.trim().toLowerCase();
  if (normalizedClerkEmail !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Clerk primary email (${normalizedClerkEmail}) does not match required admin email (${ADMIN_EMAIL})`);
  }

  console.log('[\u2713] Clerk user verified: Active, verified email matches admin email');

  // 3. Collision Check: Verify no other user in MongoDB is linked to this Clerk ID
  const collision = await User.findOne({ clerkUserId: clerkId }).select('username role email');
  if (collision) {
    if (collision.username === ADMIN_USERNAME) {
      console.log(`[i] Target account '${ADMIN_USERNAME}' is ALREADY mapped to this Clerk identity.`);
      console.log('    Operation is idempotent. Safe account status:');
      console.log(`    - Username: ${collision.username}`);
      console.log(`    - Role: ${collision.role}`);
      console.log(`    - Email: ${collision.email}`);
      console.log('    - Clerk User ID Mapped: true');
      return;
    }
    throw new Error(
      `Clerk identity collision detected: Already linked to another account (username: ${collision.username}, role: ${collision.role}). Refusing to overwrite.`
    );
  }
  console.log('[\u2713] Zero mapping collisions confirmed (identity not linked to any account)');

  // 4. Target Admin Record Verification
  const adminUser = await User.findOne({ username: ADMIN_USERNAME }).select('+passwordHash +clerkUserId +tokenVersion');
  if (!adminUser) {
    throw new Error(`Target admin account '${ADMIN_USERNAME}' was not found in database '${dbName}'. To provision a new admin account, use: node server/scripts/provision-admin.js <clerkId> [--dry-run | --confirm]`);
  }

  if (adminUser.role !== 'ADMIN') {
    throw new Error(`Target account '${ADMIN_USERNAME}' does not possess role 'ADMIN' (current role: ${adminUser.role})`);
  }

  if (!adminUser.isActive) {
    throw new Error(`Target account '${ADMIN_USERNAME}' is not active (isActive: false)`);
  }

  if (adminUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Target account '${ADMIN_USERNAME}' email (${adminUser.email}) does not match expected (${ADMIN_EMAIL})`);
  }

  const hasPasswordHash = Boolean(adminUser.passwordHash);
  if (!hasPasswordHash) {
    console.warn(`[!] Warning: Target account '${ADMIN_USERNAME}' currently has no password hash.`);
  } else {
    console.log('[\u2713] Existing password hash present and will be preserved');
  }

  if (adminUser.clerkUserId) {
    if (adminUser.clerkUserId === clerkId) {
      console.log(`[i] Admin account '${ADMIN_USERNAME}' is already mapped to this Clerk user ID.`);
      return;
    }
    throw new Error(`Admin account '${ADMIN_USERNAME}' already has a different Clerk ID mapped. Refusing to overwrite.`);
  }

  console.log(`[\u2713] Target admin account '${ADMIN_USERNAME}' verified and eligible for mapping`);

  // 5. Execution or Dry-Run Report
  if (isDryRun) {
    console.log('\n' + '-'.repeat(60));
    console.log('DRY-RUN AUDIT SUMMARY:');
    console.log(`- Target Database: ${dbName}`);
    console.log(`- Target Account: ${adminUser.username} (${adminUser._id})`);
    console.log(`- Email: ${adminUser.email}`);
    console.log(`- Role: ${adminUser.role}`);
    console.log(`- Active: ${adminUser.isActive}`);
    console.log(`- Password Hash Preserved: ${hasPasswordHash}`);
    console.log(`- Current clerkUserId: null (unmapped)`);
    console.log(`- Clerk Identity Status: Verified & Eligible`);
    console.log(`- All Pre-flight Guards: PASSED`);
    console.log('-'.repeat(60));
    console.log('\n[!] DRY-RUN COMPLETE: No changes were written to MongoDB.');
    console.log('To execute the confirmed atomic mapping, re-run with --confirm:');
    console.log('  $env:CLERK_ADMIN_USER_ID = $clerkId; node server/scripts/link-admin-clerk.js --confirm');
    console.log('  OR: node server/scripts/link-admin-clerk.js $clerkId --confirm\n');
    return;
  }

  // 6. Confirmed Atomic Mapping
  console.log(`[*] Executing atomic mapping for '${ADMIN_USERNAME}'...`);
  const updateResult = await User.updateOne(
    {
      _id: adminUser._id,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
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
    {
      runValidators: true
    }
  );

  if (updateResult.modifiedCount !== 1) {
    throw new Error(
      `Admin account was not updated (matched: ${updateResult.matchedCount}, modified: ${updateResult.modifiedCount}). Check account state.`
    );
  }

  // 7. Verify safe fields post-update
  const verifiedUser = await User.findById(adminUser._id).select('+passwordHash +clerkUserId +tokenVersion');
  if (!verifiedUser || !verifiedUser.clerkUserId) {
    throw new Error('Post-update verification failed: clerkUserId could not be confirmed in database');
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUCCESS: Admin Clerk mapping completed successfully!');
  console.log('='.repeat(60));
  console.log(`- Username: ${verifiedUser.username}`);
  console.log(`- Role: ${verifiedUser.role}`);
  console.log(`- Active: ${verifiedUser.isActive}`);
  console.log(`- Clerk User ID Mapped: ${Boolean(verifiedUser.clerkUserId)}`);
  console.log(`- Password Hash Preserved: ${Boolean(verifiedUser.passwordHash)}`);
  console.log(`- Token Version: ${verifiedUser.tokenVersion}`);
  console.log(`- Account ID: ${verifiedUser._id}`);
  console.log('='.repeat(60) + '\n');
}

if (require.main === module) {
  main()
    .catch(error => {
      console.error('\n[\u2717] Admin mapping failed:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    });
}

module.exports = { main, resolveClerkId };

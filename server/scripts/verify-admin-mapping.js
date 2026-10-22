/**
 * Safe Read-Only Verification Script for The Tech Mystery Admin Identity Mapping.
 * Inspects MongoDB state and reports safe fields only.
 * NEVER prints Clerk IDs, passwords, hashes, tokens, or secret keys.
 */
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { User } = require('../src/models');
const config = require('../src/config/environment');

const ADMIN_USERNAME = 'hrx_admin';
const ADMIN_EMAIL = 'admin@codesphere.tulas.edu.in';

async function verify() {
  console.log('='.repeat(60));
  console.log('THE TECH MYSTERY \u2014 ADMIN IDENTITY STATUS AUDIT');
  console.log('='.repeat(60));

  const mongoUri = config.mongodbUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hack_the_grid';
  await mongoose.connect(mongoUri);

  const dbName = mongoose.connection.name;
  console.log(`[✓] Connected to MongoDB: ${dbName}`);

  // 1. Check unique sparse index on clerkUserId
  const indexes = await User.collection.indexes();
  const hasUniqueIndex = indexes.some(index =>
    index.unique &&
    index.key &&
    Object.keys(index.key).length === 1 &&
    index.key.clerkUserId === 1
  );
  console.log(`[✓] Unique sparse index (clerkUserId_1): ${hasUniqueIndex ? 'PRESENT' : 'MISSING'}`);

  // 2. Count total accounts and mapped accounts
  const totalUsers = await User.countDocuments();
  const mappedUsers = await User.countDocuments({
    clerkUserId: { $exists: true, $ne: null }
  });
  console.log(`[✓] Total accounts in database: ${totalUsers}`);
  console.log(`[✓] Total accounts mapped to Clerk: ${mappedUsers}`);

  // 3. Inspect target admin account
  const admin = await User.findOne({ username: ADMIN_USERNAME }).select('+passwordHash +clerkUserId +tokenVersion');
  if (!admin) {
    console.error(`[✗] Target admin user '${ADMIN_USERNAME}' NOT FOUND in database '${dbName}'`);
    return;
  }

  console.log('\n--- TARGET ADMIN RECORD ---');
  console.log(`- Username: ${admin.username}`);
  console.log(`- Full Name: ${admin.fullName}`);
  console.log(`- Email: ${admin.email}`);
  console.log(`- Role: ${admin.role}`);
  console.log(`- Active: ${admin.isActive}`);
  console.log(`- Has Password Hash: ${Boolean(admin.passwordHash)}`);
  console.log(`- Clerk User ID Mapped: ${Boolean(admin.clerkUserId)}`);
  console.log(`- Token Version: ${admin.tokenVersion || 0}`);
  console.log(`- Account ID: ${admin._id}`);

  // 4. Check whether mapping is complete
  if (Boolean(admin.clerkUserId) && admin.role === 'ADMIN' && admin.isActive) {
    console.log('\n[\u2713] STATUS: Administrator account is safely and authoritatively mapped to Clerk.');
  } else if (!admin.clerkUserId) {
    console.log('\n[!] STATUS: Administrator account is UNMAPPED (ready for link-admin-clerk.js).');
  } else {
    console.log('\n[✗] STATUS: Administrator account has unexpected state.');
  }
  console.log('='.repeat(60) + '\n');
}

verify()
  .catch(err => {
    console.error('Audit failed:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });


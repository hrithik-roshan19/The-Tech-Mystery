/**
 * Safe Database Index Synchronization Utility for The Tech Mystery.
 * Reconciles, creates, and verifies critical unique schema indexes on MongoDB.
 * Reports safe metadata only; NEVER prints secrets, tokens, or credentials.
 */
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const config = require('../src/config/environment');
const { User } = require('../src/models');

function isApprovedIdentityIndex(index) {
  if (!index || !index.unique || !index.key) return false;
  const keys = Object.keys(index.key);
  if (keys.length !== 1) return false;
  return keys[0] === 'clerkUserId' && Math.abs(Number(index.key.clerkUserId)) === 1;
}

async function main() {
  console.log('='.repeat(60));
  console.log('THE TECH MYSTERY \u2014 IDENTITY INDEX SYNCHRONIZATION');
  console.log('='.repeat(60));

  const mongoUri = config.mongodbUri || process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.includes('example.mongodb.net') || mongoUri.includes('<password>')) {
    throw new Error('Valid MONGODB_URI is required to synchronize database indexes');
  }

  await mongoose.connect(mongoUri);
  const dbName = mongoose.connection.name;
  console.log(`[\u2713] Connected to MongoDB database: ${dbName}`);

  // 1. Audit for duplicate clerkUserId records before indexing
  console.log('[*] Auditing existing records for identity conflicts...');
  const duplicates = await User.aggregate([
    { $match: { clerkUserId: { $exists: true, $ne: null } } },
    { $group: { _id: '$clerkUserId', count: { $sum: 1 }, usernames: { $push: '$username' } } },
    { $match: { count: { $gt: 1 } } }
  ]);

  if (duplicates.length > 0) {
    console.error(`[\u2717] CANNOT BUILD UNIQUE INDEX: Found ${duplicates.length} duplicate clerkUserId group(s)!`);
    duplicates.forEach((dup, i) => {
      console.error(`  Group ${i + 1}: ${dup.count} accounts share an identity (usernames: ${dup.usernames.join(', ')})`);
    });
    console.error('Safe reconciliation required before index can be created. Aborting.');
    process.exit(1);
  }
  console.log('[\u2713] Zero duplicate clerkUserId records found. Integrity verified.');

  // 2. Inspect existing indexes
  const beforeIndexes = await User.collection.indexes();
  const existingApproved = beforeIndexes.find(isApprovedIdentityIndex);

  if (existingApproved) {
    console.log(`[\u2713] Approved unique identity index already exists: '${existingApproved.name}'`);
    console.log(`    Key: ${JSON.stringify(existingApproved.key)}, unique: ${existingApproved.unique}, sparse: ${!!existingApproved.sparse}`);
  } else {
    console.log('[*] Unique identity index (clerkUserId_1) is missing. Creating index via User.createIndexes()...');
    await User.createIndexes();
    const afterIndexes = await User.collection.indexes();
    const verified = afterIndexes.find(isApprovedIdentityIndex);
    if (!verified) {
      throw new Error('Index creation completed but approved unique identity index was not found');
    }
    console.log(`[\u2713] Successfully created and verified unique sparse identity index: '${verified.name}'`);
  }

  const totalUsers = await User.countDocuments();
  const mappedUsers = await User.countDocuments({ clerkUserId: { $exists: true, $ne: null } });
  console.log(`[\u2713] Total accounts in database: ${totalUsers}`);
  console.log(`[\u2713] Total accounts mapped to Clerk: ${mappedUsers}`);
  console.log('='.repeat(60));
  console.log('DATABASE INDEX SYNCHRONIZATION COMPLETE \u2014 READY FOR AUTHENTICATION');
  console.log('='.repeat(60));

  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch(err => {
    console.error(`[\u2717] Index synchronization failed: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { isApprovedIdentityIndex, main };

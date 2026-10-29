const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { Challenge, Checkpoint, Question } = require('../src/models');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');

  const connectionString = uri.includes('?') 
    ? uri.replace(/\/[^/?]+(\?)/, '/test$1')
    : uri.replace(/\/[^/]*$/, '/test');

  await mongoose.connect(connectionString);
  console.log('Connected to Atlas DB:', mongoose.connection.name);

  // Inspect Challenge for Level 8
  const challenge8 = await Challenge.findOne({ levelNumber: 8 }).lean();
  console.log('\nLevel 8 Challenge Entity in DB:');
  console.log(JSON.stringify(challenge8, null, 2));

  // Inspect Checkpoint for Level 8 (if any)
  const checkpoint8 = await Checkpoint.findOne({ levelNumber: 8 }).lean();
  console.log('\nLevel 8 Checkpoint in DB:');
  console.log(JSON.stringify(checkpoint8, null, 2));

  // Inspect physical checkpoints HTG-CP01..03
  const physicalCPs = await Checkpoint.find().lean();
  console.log(`\nCheckpoints in DB: ${physicalCPs.length}`);
  physicalCPs.forEach(cp => console.log(`Level ${cp.levelNumber}: ${cp.checkpointCode} (Token: ${cp.qrToken ? 'Present' : 'Missing'}, URL: ${cp.qrScanUrl || cp.qrCodeUrl ? 'Present' : 'Missing'})`));

  // Inspect Level 8 questions
  const l8Questions = await Question.find({ levelNumber: 8 }).lean();
  console.log(`\nExisting questions for Level 8: ${l8Questions.length}`);
  l8Questions.forEach(q => console.log(` - ID: ${q.metadata?.seedId || q.stableId || q._id}, Order: ${q.order}, Title: "${q.title}", Active: ${q.isActive}, Status: ${q.status}`));

  // Active question counts for all levels 1..10
  console.log('\nQuestion counts across levels:');
  for (let l = 1; l <= 10; l++) {
    const active = await Question.countDocuments({ levelNumber: l, status: 'Published', isActive: true });
    const total = await Question.countDocuments({ levelNumber: l });
    console.log(`Level ${l}: ${active} active / ${total} total`);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


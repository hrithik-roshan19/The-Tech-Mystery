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

  // Inspect Challenge for Level 7
  const challenge7 = await Challenge.findOne({ levelNumber: 7 }).lean();
  console.log('\nLevel 7 Challenge Entity:');
  console.log(JSON.stringify(challenge7, null, 2));

  // Inspect all Challenges 1..10
  const allChallenges = await Challenge.find().sort({ levelNumber: 1 }).select('levelNumber title category difficulty status isActive').lean();
  console.log('\nAll Challenges:');
  allChallenges.forEach(c => console.log(`Level ${c.levelNumber}: "${c.title}" [${c.category}] (${c.difficulty}) - Status: ${c.status}, Active: ${c.isActive}`));

  // Inspect Checkpoints
  const checkpoints = await Checkpoint.find().lean();
  console.log(`\nCheckpoints in DB: ${checkpoints.length}`);
  checkpoints.forEach(cp => console.log(`Level ${cp.levelNumber}: ${cp.checkpointCode} (Token: ${cp.qrToken ? 'Present' : 'Missing'}, URL: ${cp.qrScanUrl || cp.qrCodeUrl ? 'Present' : 'Missing'})`));

  // Inspect Level 7 questions
  const l7Questions = await Question.find({ levelNumber: 7 }).lean();
  console.log(`\nExisting questions for Level 7: ${l7Questions.length}`);
  l7Questions.forEach(q => console.log(` - ID: ${q.metadata?.seedId || q.stableId || q._id}, Order: ${q.order}, Title: "${q.title}", Active: ${q.isActive}, Status: ${q.status}`));

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


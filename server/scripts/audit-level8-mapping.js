const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');

  const connectionString = uri.includes('?') 
    ? uri.replace(/\/[^/?]+(\?)/, '/test$1')
    : uri.replace(/\/[^/]*$/, '/test');

  await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected to Atlas DB:', mongoose.connection.name);

  const Challenge = mongoose.model('Challenge', new mongoose.Schema({}, { strict: false }));
  const Checkpoint = mongoose.model('Checkpoint', new mongoose.Schema({}, { strict: false }));
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

  console.log('\n=== 1. Level 8 Challenge Document ===');
  const ch8 = await Challenge.findOne({ levelNumber: 8 }).lean();
  console.log(JSON.stringify(ch8, null, 2));

  console.log('\n=== 2. Challenge by ID 6adf9dc15e756eb30cb117ad ===');
  const chById = await Challenge.findById('6adf9dc15e756eb30cb117ad').lean();
  console.log(JSON.stringify(chById, null, 2));

  console.log('\n=== 3. All Challenges (Levels 1 to 10) ===');
  const allChs = await Challenge.find({}).sort({ levelNumber: 1 }).lean();
  allChs.forEach(ch => {
    console.log(`Level ${ch.levelNumber}: _id=${ch._id}, title="${ch.title}", category="${ch.category}", difficulty="${ch.difficulty}", status="${ch.status}", checkpointId=${ch.checkpointId}`);
  });

  console.log('\n=== 4. Checkpoints in Database ===');
  const allCps = await Checkpoint.find({}).sort({ levelNumber: 1 }).lean();
  allCps.forEach(cp => {
    console.log(`Level ${cp.levelNumber}: code="${cp.checkpointCode}", name="${cp.name}", qrToken=${cp.qrToken ? 'YES' : 'NO'}, status="${cp.status}"`);
  });

  console.log('\n=== 5. Active Question Counts By Level ===');
  for (let l = 1; l <= 10; l++) {
    const total = await Question.countDocuments({ levelNumber: l });
    const active = await Question.countDocuments({ levelNumber: l, status: 'Published', isActive: true });
    const mm = await Question.countDocuments({ levelNumber: l, 'metadata.pool': 'mission-map-70', status: 'Published', isActive: true });
    console.log(`Level ${l}: total=${total}, active=${active}, mission-map-70=${mm}`);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


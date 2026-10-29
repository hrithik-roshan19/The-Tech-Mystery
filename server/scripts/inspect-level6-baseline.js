const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });
const Checkpoint = require('../src/models/Checkpoint');
const Challenge = require('../src/models/Challenge');
const Question = require('../src/models/Question');

async function inspectLevel6() {
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: false });
  console.log('Connected DB:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);

  const l6Challenge = await Challenge.findOne({ levelNumber: 6 }).lean();
  console.log('\n--- Challenge Level 6 ---');
  console.log(l6Challenge ? {
    id: l6Challenge._id,
    title: l6Challenge.title,
    levelNumber: l6Challenge.levelNumber,
    category: l6Challenge.category,
    difficulty: l6Challenge.difficulty,
    status: l6Challenge.status,
    isActive: l6Challenge.isActive
  } : 'NOT FOUND');

  const l6Checkpoint = await Checkpoint.findOne({ levelNumber: 6 }).lean();
  console.log('\n--- Checkpoint Level 6 ---');
  console.log(l6Checkpoint ? {
    id: l6Checkpoint._id,
    checkpointCode: l6Checkpoint.checkpointCode,
    levelNumber: l6Checkpoint.levelNumber,
    hasQrToken: Boolean(l6Checkpoint.qrToken),
    hasQrScanUrl: Boolean(l6Checkpoint.qrScanUrl || l6Checkpoint.qrCodeUrl),
    hasQrCodeData: Boolean(l6Checkpoint.qrCodeDataUrl || l6Checkpoint.qrCodeData),
    status: l6Checkpoint.status
  } : 'NO CHECKPOINT FOR LEVEL 6 (Pure Digital Level)');

  const l6Questions = await Question.find({ levelNumber: 6 }).select('+flag').lean();
  console.log('\n--- Questions Level 6 ---');
  console.log('Total Level 6 questions in DB:', l6Questions.length);
  const activeL6 = l6Questions.filter(q => q.status === 'Published' && q.isActive);
  const archivedL6 = l6Questions.filter(q => q.status === 'Archived' || !q.isActive);
  console.log('Active published:', activeL6.length);
  console.log('Archived/inactive:', archivedL6.length);

  console.log('\n--- Preservation Check (Levels 1-5) ---');
  for (let l = 1; l <= 5; l++) {
    const count = await Question.countDocuments({ levelNumber: l, status: 'Published', isActive: true });
    console.log(`Level ${l} active published questions: ${count}`);
  }

  const cpCount = await Checkpoint.countDocuments({});
  console.log('\nTotal physical checkpoints in DB:', cpCount);

  await mongoose.disconnect();
}

inspectLevel6().catch(console.error);


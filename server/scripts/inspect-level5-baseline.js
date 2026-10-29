const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });
const Checkpoint = require('../src/models/Checkpoint');
const Challenge = require('../src/models/Challenge');
const Question = require('../src/models/Question');

async function inspectLevel5() {
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: false });
  console.log('Connected DB:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);

  const l5Challenge = await Challenge.findOne({ levelNumber: 5 }).lean();
  console.log('\n--- Challenge Level 5 ---');
  console.log(l5Challenge ? {
    id: l5Challenge._id,
    title: l5Challenge.title,
    levelNumber: l5Challenge.levelNumber,
    category: l5Challenge.category,
    difficulty: l5Challenge.difficulty,
    status: l5Challenge.status,
    isActive: l5Challenge.isActive
  } : 'NOT FOUND');

  const l5Checkpoint = await Checkpoint.findOne({ levelNumber: 5 }).lean();
  console.log('\n--- Checkpoint Level 5 ---');
  console.log(l5Checkpoint ? {
    id: l5Checkpoint._id,
    checkpointCode: l5Checkpoint.checkpointCode,
    levelNumber: l5Checkpoint.levelNumber,
    hasQrToken: Boolean(l5Checkpoint.qrToken),
    hasQrScanUrl: Boolean(l5Checkpoint.qrScanUrl || l5Checkpoint.qrCodeUrl),
    hasQrCodeData: Boolean(l5Checkpoint.qrCodeDataUrl || l5Checkpoint.qrCodeData),
    status: l5Checkpoint.status
  } : 'NO CHECKPOINT FOR LEVEL 5 (Pure Digital Level)');

  const l5Questions = await Question.find({ levelNumber: 5 }).select('+flag').lean();
  console.log('\n--- Questions Level 5 ---');
  console.log('Total Level 5 questions in DB:', l5Questions.length);
  const activeL5 = l5Questions.filter(q => q.status === 'Published' && q.isActive);
  const archivedL5 = l5Questions.filter(q => q.status === 'Archived' || !q.isActive);
  console.log('Active published:', activeL5.length);
  console.log('Archived/inactive:', archivedL5.length);

  console.log('\n--- Preservation Check (Levels 1-4) ---');
  for (let l = 1; l <= 4; l++) {
    const count = await Question.countDocuments({ levelNumber: l, status: 'Published', isActive: true });
    console.log(`Level ${l} active published questions: ${count}`);
  }

  const cpCount = await Checkpoint.countDocuments({});
  console.log('\nTotal physical checkpoints in DB:', cpCount);

  await mongoose.disconnect();
}

inspectLevel5().catch(console.error);


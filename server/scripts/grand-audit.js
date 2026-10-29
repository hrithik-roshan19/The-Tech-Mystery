const path = require('path');
const dns = require('dns');
const dotenv = require('dotenv');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { Question, Challenge, Checkpoint } = require('../src/models');

async function audit() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  const connectedDb = mongoose.connection.name;
  const host = mongoose.connection.host;
  console.log(`Connected to Database: "${connectedDb}" on host: "${host}"\n`);

  if (connectedDb !== 'test') {
    throw new Error(`SAFETY ABORT: connectedDb "${connectedDb}" !== "test"`);
  }

  const challenges = await Challenge.find({}).sort({ levelNumber: 1 }).lean();
  console.log('========================================================================================');
  console.log('                          CHALLENGES & QUESTION AUDIT (LEVELS 1-10)                     ');
  console.log('========================================================================================');

  let cumulativeActive = 0;
  let cumulativeMM = 0;
  let cumulativeLegacy = 0;
  let cumulativeTotal = 0;

  for (const c of challenges) {
    const allQuestions = await Question.find({ challengeId: c._id }).lean();
    const activeQuestions = allQuestions.filter(q => q.status === 'Published' && q.isActive);
    const mmQuestions = activeQuestions.filter(
      q => q.metadata?.pool === 'mission-map-70' || (q.metadata?.seedId && /^HTG-L(0[1-9]|10)-OE\d{2}$/.test(q.metadata.seedId))
    );
    const legacyQuestions = activeQuestions.filter(
      q => !(q.metadata?.pool === 'mission-map-70' || (q.metadata?.seedId && /^HTG-L(0[1-9]|10)-OE\d{2}$/.test(q.metadata.seedId)))
    );

    cumulativeTotal += allQuestions.length;
    cumulativeActive += activeQuestions.length;
    cumulativeMM += mmQuestions.length;
    cumulativeLegacy += legacyQuestions.length;

    console.log(
      `Level ${c.levelNumber.toString().padStart(2, ' ')} | ID: ${c._id} | Diff: ${c.difficulty.padEnd(6, ' ')} | Category: ${c.category.padEnd(9, ' ')} | Active: ${activeQuestions.length.toString().padStart(2, ' ')} (MM: ${mmQuestions.length.toString().padStart(2, ' ')}, Legacy: ${legacyQuestions.length.toString().padStart(2, ' ')}) | Total: ${allQuestions.length.toString().padStart(2, ' ')} | Title: "${c.title}"`
    );
  }

  console.log('========================================================================================');
  console.log(`CUMULATIVE: Total: ${cumulativeTotal} | Active: ${cumulativeActive} | MM-70: ${cumulativeMM} | Legacy: ${cumulativeLegacy}`);
  console.log('========================================================================================\n');

  console.log('--- PHYSICAL CHECKPOINTS VERIFICATION ---');
  const checkpoints = await Checkpoint.find({}).sort({ levelNumber: 1 }).lean();
  for (const cp of checkpoints) {
    const hasToken = Boolean(cp.qrToken);
    const hasScanUrl = Boolean(cp.qrScanUrl);
    const hasQrData = Boolean(cp.qrCodeDataUrl);
    console.log(
      `Checkpoint: ${cp.checkpointCode} | Level: ${cp.levelNumber} | Name: "${cp.name}" | Status: ${cp.status} | Active: ${cp.isActive} | Token: ${hasToken} | ScanURL: ${hasScanUrl} | QRData: ${hasQrData}`
    );
  }

  console.log('\n--- OVERALL QUESTION POOL INTEGRITY ---');
  const mcqs = await Question.countDocuments({ status: 'Published', isActive: true, 'options.0': { $exists: true } });
  const openEnded = await Question.countDocuments({ status: 'Published', isActive: true, $or: [{ options: { $size: 0 } }, { options: { $exists: false } }] });
  console.log(`Active Published Open-Ended Questions:  ${openEnded}`);
  console.log(`Active Published Multiple-Choice (MCQ): ${mcqs} (Legacy MCQs in early levels: ${mcqs})`);
  
  const mmMCQs = await Question.countDocuments({
    status: 'Published',
    isActive: true,
    'metadata.pool': 'mission-map-70',
    'options.0': { $exists: true }
  });
  console.log(`Mission Map MCQs detected:               ${mmMCQs} (MUST BE 0)`);

  await mongoose.disconnect();
}

audit().catch(console.error);


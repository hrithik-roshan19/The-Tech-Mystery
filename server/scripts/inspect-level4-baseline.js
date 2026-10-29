const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]); } catch(e){}
const mongoose = require('mongoose');
const { Challenge, Checkpoint, Question } = require('../src/models');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function inspectLevel4() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB:', mongoose.connection.name, 'on host:', mongoose.connection.host);
  
  // 1. Challenge Level 4
  const ch = await Challenge.findOne({ levelNumber: 4 }).lean();
  console.log('\n--- Challenge Level 4 ---');
  if (ch) {
    console.log('  ID:', ch._id);
    console.log('  Title:', ch.title);
    console.log('  Difficulty:', ch.difficulty);
    console.log('  Category:', ch.category);
    console.log('  Status:', ch.status);
    console.log('  Active:', ch.isActive);
  } else {
    console.log('  NOT FOUND!');
  }

  // 2. Checkpoint Level 4
  const cp = await Checkpoint.findOne({ levelNumber: 4 }).lean();
  console.log('\n--- Checkpoint Level 4 ---');
  if (cp) {
    console.log('  Code:', cp.checkpointCode);
    console.log('  ID:', cp._id);
    console.log('  hasQrToken:', Boolean(cp.qrToken));
    console.log('  hasQrScanUrl:', Boolean(cp.qrScanUrl || cp.qrCodeUrl));
    console.log('  hasQrCodeData:', Boolean(cp.qrCodeDataUrl || cp.qrCodeData));
    console.log('  Status:', cp.status);
    console.log('  qrToken type/len:', cp.qrToken ? typeof cp.qrToken + ' / ' + cp.qrToken.length : 'none');
  } else {
    console.log('  NOT FOUND by levelNumber: 4, searching by code HTG-CP04...');
    const cpByCode = await Checkpoint.findOne({ checkpointCode: 'HTG-CP04' }).lean();
    if (cpByCode) {
      console.log('  Found by code! Code:', cpByCode.checkpointCode, 'levelNumber:', cpByCode.levelNumber, 'ID:', cpByCode._id);
    } else {
      console.log('  Checkpoint HTG-CP04 not found by code either!');
    }
  }

  // Also list all checkpoints in DB to see what exists
  console.log('\n--- All Checkpoints in DB ---');
  const allCps = await Checkpoint.find({}).lean();
  allCps.forEach(c => {
    console.log('  Code:', c.checkpointCode, '| Level:', c.levelNumber, '| Status:', c.status, '| hasQrToken:', Boolean(c.qrToken));
  });

  // 3. Existing Level 4 questions
  const allLevel4Questions = await Question.find({ levelNumber: 4 }).select('+flag').sort({ order: 1 }).lean();
  console.log('\n--- Questions in Level 4 ---');
  console.log('  Total count:', allLevel4Questions.length);
  const activeQuestions = allLevel4Questions.filter(q => q.status === 'Published' && q.isActive);
  const archivedQuestions = allLevel4Questions.filter(q => q.status !== 'Published' || !q.isActive);
  console.log('  Active/Published count:', activeQuestions.length);
  console.log('  Archived/Inactive count:', archivedQuestions.length);
  allLevel4Questions.forEach(q => {
    console.log('  Order ' + q.order + ' | ID: ' + q._id + ' | Type: ' + q.type + ' | Status: ' + q.status + ' | Title: ' + q.title + ' | Flag: ' + q.flag);
  });

  // 4. Inspect progression service for question count or level 4 handling
  console.log('\n--- Question Progression Service Inspection ---');
  try {
    const progressionService = require('../src/services/questionProgression.service');
    console.log('  Progression service exports:', Object.keys(progressionService));
  } catch(e) {
    console.log('  Could not load questionProgression.service:', e.message);
  }

  await mongoose.disconnect();
}
inspectLevel4();


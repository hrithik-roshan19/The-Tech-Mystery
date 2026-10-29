const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const path = require('path');
const env = require('dotenv').parse(require('fs').readFileSync(path.resolve(__dirname, '../.env')));

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  const { Question, Challenge } = require('../src/models');

  const challenges = await Challenge.find({}).sort({ levelNumber: 1 }).lean();
  console.log(`--- Existing Challenges (${challenges.length}) ---`);
  challenges.forEach(c => {
    console.log(`Level ${c.levelNumber}: "${c.title}" (${c.category}, ${c.difficulty}, ${c.points} pts, ID: ${c._id})`);
  });

  const questions = await Question.find({}).select('levelNumber order title type category difficulty status isActive flag').lean();
  console.log(`\n--- Existing Questions in Database (${questions.length} total) ---`);
  
  const byLevel = {};
  questions.forEach(q => {
    if (!byLevel[q.levelNumber]) byLevel[q.levelNumber] = [];
    byLevel[q.levelNumber].push(q);
  });

  for (let lvl = 1; lvl <= 10; lvl++) {
    const list = byLevel[lvl] || [];
    const activePublished = list.filter(q => q.status === 'Published' && q.isActive);
    const archived = list.filter(q => q.status === 'Archived' || !q.isActive);
    console.log(`Level ${lvl}: Total = ${list.length} (Active/Published: ${activePublished.length}, Archived/Inactive: ${archived.length})`);
    if (activePublished.length > 0) {
      console.log(`   Sample orders: [${activePublished.map(q => q.order).join(', ')}]`);
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);

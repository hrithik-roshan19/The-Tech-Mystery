const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const { Question } = require('../src/models');
const level8Data = require('../src/data/mission-map/level8');

async function main() {
  const dummyChallengeId = new mongoose.Types.ObjectId('6adf9dc15e756eb30cb117ad');
  
  let validCount = 0;
  for (const q of level8Data.questions) {
    const doc = new Question({
      challengeId: dummyChallengeId,
      checkpointId: null,
      levelNumber: q.levelNumber,
      order: q.order,
      title: q.title,
      prompt: q.prompt,
      category: q.category,
      difficulty: q.difficulty,
      type: q.type,
      options: [],
      points: q.points || 100,
      attempts: q.attempts || 5,
      required: true,
      status: 'Published',
      isActive: true,
      isCaseSensitive: Boolean(q.isCaseSensitive),
      flag: q.flag,
      hints: q.hints || [],
      metadata: {
        ...(q.metadata || {}),
        seedId: q.stableId,
        stableId: q.stableId,
        pool: 'mission-map-70',
        seededAt: new Date()
      }
    });

    const err = doc.validateSync();
    if (err) {
      console.error(`Validation failed for ${q.stableId}:`, err);
      process.exit(1);
    }
    validCount++;
  }

  console.log(`Mongoose Schema Validation PASSED for all ${validCount} / ${level8Data.questions.length} questions!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


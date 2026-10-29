const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch (e) {}

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { Question } = require('../src/models');
const { safeContent, privateAnswers } = require('../src/utils/participantData');
const level6Data = require('../src/data/mission-map/level6');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');

  const connectionString = uri.includes('?') 
    ? uri.replace(/\/[^/?]+(\?)/, '/test$1')
    : uri.replace(/\/[^/]*$/, '/test');

  await mongoose.connect(connectionString);
  console.log('Connected to Atlas DB:', mongoose.connection.name);

  const keys = await privateAnswers();
  console.log('Live answer keys loaded from DB:', keys.length);

  let withheldCount = 0;
  for (const q of level6Data.questions) {
    const combinedKeys = [...keys, q.flag];
    for (const k of combinedKeys) {
      if (safeContent(q.prompt, [k]).includes('withheld')) {
        console.error(`[WITHHELD] ${q.stableId}: Prompt matched key: "${k}"`);
        withheldCount++;
        break;
      }
    }
  }

  console.log(`Withholding test complete. Withheld: ${withheldCount} / ${level6Data.questions.length}`);
  await mongoose.disconnect();

  if (withheldCount > 0) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

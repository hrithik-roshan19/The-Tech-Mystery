const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function linkAndAudit() {
  const isDryRun = !process.argv.includes('--confirm');
  console.log(`=== CHECKPOINT-CHALLENGE LINKAGE & AUDIT (${isDryRun ? 'DRY RUN' : 'CONFIRMED UPDATE'}) ===\n`);

  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || 'test' });
  console.log('Connected to DB:', mongoose.connection.name);

  const Checkpoint = mongoose.model('Checkpoint', new mongoose.Schema({}, { strict: false }));
  const Challenge = mongoose.model('Challenge', new mongoose.Schema({}, { strict: false }));

  const checkpoints = await Checkpoint.find({}).sort({ levelNumber: 1 });
  const challenges = await Challenge.find({ isActive: true, status: 'Published' }).sort({ levelNumber: 1 });

  console.log(`Found ${checkpoints.length} checkpoints and ${challenges.length} active published challenges.\n`);

  const auditReport = [];

  for (const cp of checkpoints) {
    const lvl = cp.levelNumber;
    const targetChallenge = challenges.find(ch => ch.levelNumber === lvl);

    const cpIdStr = cp._id.toString();
    const currentAssocIdStr = cp.associatedChallengeId ? cp.associatedChallengeId.toString() : null;
    const targetChallengeIdStr = targetChallenge ? targetChallenge._id.toString() : null;

    let actionNeeded = false;
    let actionReason = 'OK';

    if (!targetChallenge) {
      actionReason = 'NO_PUBLISHED_CHALLENGE_FOUND_FOR_LEVEL';
    } else if (!currentAssocIdStr) {
      actionNeeded = true;
      actionReason = 'ASSOCIATED_CHALLENGE_ID_MISSING';
    } else if (currentAssocIdStr !== targetChallengeIdStr) {
      actionNeeded = true;
      actionReason = 'ASSOCIATED_CHALLENGE_ID_MISMATCH';
    }

    if (actionNeeded && !isDryRun) {
      await Checkpoint.updateOne({ _id: cp._id }, { $set: { associatedChallengeId: targetChallenge._id } });
      console.log(`[UPDATED] Checkpoint ${cp.checkpointCode} (Level ${lvl}) linked to Challenge "${targetChallenge.title}" (${targetChallenge._id})`);
    }

    auditReport.push({
      checkpointCode: cp.checkpointCode,
      levelNumber: lvl,
      checkpointId: cpIdStr,
      associatedChallengeId: targetChallengeIdStr,
      challengeTitle: targetChallenge?.title || 'NONE',
      isActive: cp.isActive && targetChallenge?.isActive,
      status: cp.status,
      actionNeeded,
      actionReason
    });
  }

  console.log('\n=== AUDIT SUMMARY ===');
  console.table(auditReport);

  await mongoose.disconnect();
  console.log('\nDatabase connection closed.');
}

linkAndAudit().catch(console.error);

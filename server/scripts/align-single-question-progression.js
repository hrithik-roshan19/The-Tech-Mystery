/**
 * Migration & Alignment Script: Single Question Per Level Progression
 *
 * Checks all active squads in MongoDB Atlas. For any squad that has solved their
 * assigned Level 1 question (e.g. Squad Ydvhrk), ensures their progression is
 * aligned with the 1-question-per-level rule:
 * - team.currentLevel = 2
 * - teamChallenge (level 1).status = 'SOLVED'
 * - team.totalScore is preserved exactly (no score change)
 * - all submission history is preserved intact
 *
 * Usage:
 *   node server/scripts/align-single-question-progression.js          # Dry run
 *   node server/scripts/align-single-question-progression.js --confirm # Live write
 */

require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');

async function main() {
  const isConfirm = process.argv.includes('--confirm');
  console.log('====================================================');
  console.log('  ALIGN SINGLE QUESTION PER LEVEL PROGRESSION');
  console.log(`  Mode: ${isConfirm ? 'CONFIRMED (Live Database Write)' : 'DRY RUN (Read-Only)'}`);
  console.log('====================================================');

  if (!process.env.MONGODB_URI) {
    console.error('[ERROR] MONGODB_URI is not defined in environment');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('[CONNECTED] Connected to MongoDB Atlas:', mongoose.connection.name);

  const teamsCol = mongoose.connection.collection('teams');
  const tcCol = mongoose.connection.collection('teamchallenges');
  const subsCol = mongoose.connection.collection('submissions');
  const cpCol = mongoose.connection.collection('checkpoints');

  // Find all active teams
  const teams = await teamsCol.find({ isActive: { $ne: false }, isDisqualified: { $ne: true } }).toArray();
  console.log(`[INFO] Found ${teams.length} active teams to inspect`);

  for (const team of teams) {
    console.log(`\n--- Inspecting Team "${team.name}" (ID: ${team._id}) ---`);
    console.log(`  Current Level: ${team.currentLevel} | Score: ${team.totalScore}`);

    // Check Level 1 team challenge
    const tc1 = await tcCol.findOne({ teamId: team._id, levelNumber: 1 });
    // Check Level 1 correct submissions
    const correctSub = await subsCol.findOne({ teamId: team._id, levelNumber: 1, isCorrect: true });

    if (!tc1) {
      console.log('  No Level 1 challenge record found; skipping.');
      continue;
    }

    const hasSolvedSubmission = Boolean(correctSub);
    const hasSolvedQuestionIds = Array.isArray(tc1.solvedQuestionIds) && tc1.solvedQuestionIds.length > 0;
    const isLevel1Solved = hasSolvedSubmission || hasSolvedQuestionIds || tc1.status === 'SOLVED';

    console.log(`  Level 1 Status: ${tc1.status} | Has Solved Sub: ${hasSolvedSubmission} | Solved Questions: ${tc1.solvedQuestionIds?.length || 0}`);

    if (isLevel1Solved && team.currentLevel === 1) {
      console.log(`  [ALIGNMENT NEEDED] Team has solved Level 1 under single-question rule.`);
      console.log(`  Target updates:`);
      console.log(`    - team.currentLevel: 1 -> 2`);
      console.log(`    - teamChallenge (level 1).status: ${tc1.status} -> SOLVED`);
      console.log(`    - totalScore: PRESERVED at ${team.totalScore}`);

      if (isConfirm) {
        await teamsCol.updateOne(
          { _id: team._id, currentLevel: 1 },
          { $set: { currentLevel: 2, updatedAt: new Date() } }
        );
        await tcCol.updateOne(
          { _id: tc1._id },
          {
            $set: {
              status: 'SOLVED',
              solvedAt: tc1.solvedAt || tc1.updatedAt || new Date(),
              updatedAt: new Date()
            }
          }
        );
        console.log(`  [UPDATED] Team "${team.name}" successfully advanced to Level 2!`);
      } else {
        console.log(`  [DRY RUN] No database writes executed. Pass --confirm to apply.`);
      }
    } else {
      console.log(`  [ALIGNED] Team already on Level ${team.currentLevel} (Status: ${tc1.status}). No changes needed.`);
    }

    // Inspect Level 2 Checkpoint for verification
    const cp2 = await cpCol.findOne({ levelNumber: 2 });
    if (cp2) {
      console.log(`  Level 2 Checkpoint:`);
      console.log(`    Code: ${cp2.checkpointCode || 'HTG-CP02'}`);
      console.log(`    Name: ${cp2.name}`);
      console.log(`    Location: ${cp2.locationDescription || 'Location not configured'}`);
      console.log(`    Mode: ${cp2.mode}`);
      console.log(`    Active: ${cp2.isActive}`);
    }
  }

  await mongoose.disconnect();
  console.log('\n[DONE] Database connection closed.');
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});

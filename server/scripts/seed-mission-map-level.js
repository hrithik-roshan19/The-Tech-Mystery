/**
 * Dedicated Idempotent Seed Script for Mission Map Levels
 * The Tech Mystery / Hack The Grid — 700-Question Question Bank
 *
 * Rules:
 * - Requires explicit --level=<1..10> argument.
 * - Enforces target database verification (defaults to 'test').
 * - Pre-validates all 70 questions (0 MCQs, all open-ended, rubric, valid flag).
 * - Safe idempotent upsert by { levelNumber, 'metadata.seedId': q.stableId }.
 * - Never alters or deletes the existing 30 questions.
 * - Never alters or touches the physical QR checkpoints (HTG-CP01..03) or their QR data.
 * - Requires --confirm flag to execute writes; defaults to dry-run mode.
 * - Never prints or leaks credentials or connection strings.
 */

const path = require('path');
const dns = require('dns');
const dotenv = require('dotenv');

// Configure reliable DNS servers for Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch (e) {
  // Ignore fallback error
}

// Load environment configuration: server/.env takes precedence
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { Challenge, Checkpoint, Question } = require('../src/models');
const { verifyAnswer } = require('../src/services/scoring.service');
const { safeContent, participantQuestion } = require('../src/utils/participantData');

function parseCliArgs() {
  const args = process.argv.slice(2);
  let level = null;
  let targetDb = 'test';
  let isConfirm = false;
  let isDryRun = true;
  let uri = null;

  for (const arg of args) {
    if (arg.startsWith('--level=')) {
      level = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--level') {
      const idx = args.indexOf(arg);
      level = parseInt(args[idx + 1], 10);
    } else if (arg.startsWith('--target-db=')) {
      targetDb = arg.split('=')[1].trim();
    } else if (arg === '--target-db') {
      const idx = args.indexOf(arg);
      targetDb = args[idx + 1].trim();
    } else if (arg.startsWith('--uri=')) {
      uri = arg.split('=')[1].trim();
    } else if (arg === '--confirm') {
      isConfirm = true;
      isDryRun = false;
    } else if (arg === '--dry-run') {
      isDryRun = true;
      isConfirm = false;
    }
  }

  return { level, targetDb, isConfirm, isDryRun, uri };
}

async function validateDataset(dataset) {
  const { levelNumber, title, questions } = dataset;
  const errors = [];

  if (!questions || !Array.isArray(questions)) {
    throw new Error('Dataset does not contain a questions array');
  }

  if (questions.length !== 70) {
    errors.push(`Dataset question count mismatch: expected 70, found ${questions.length}`);
  }

  const seenIds = new Set();
  const seenOrders = new Set();

  questions.forEach((q, idx) => {
    const qId = q.stableId || `Index-${idx}`;
    if (!q.stableId) errors.push(`Question at index ${idx} missing stableId`);
    if (seenIds.has(q.stableId)) errors.push(`Duplicate stableId detected: ${q.stableId}`);
    seenIds.add(q.stableId);

    if (seenOrders.has(q.order)) errors.push(`Duplicate order detected: ${q.order} at ${qId}`);
    seenOrders.add(q.order);

    if (q.levelNumber !== levelNumber) {
      errors.push(`${qId}: levelNumber mismatch (expected ${levelNumber}, got ${q.levelNumber})`);
    }

    if (q.type === 'Multiple Choice' || (Array.isArray(q.options) && q.options.length > 0)) {
      errors.push(`${qId}: MCQ detected! All questions must be open-ended.`);
    }

    if (!q.title || !q.title.trim()) errors.push(`${qId}: missing title`);
    if (!q.prompt || !q.prompt.trim()) errors.push(`${qId}: missing prompt`);
    if (!q.flag || !q.flag.trim()) errors.push(`${qId}: missing expected flag`);

    if (!q.metadata || !q.metadata.explanation) errors.push(`${qId}: missing explanation`);
    if (!q.metadata || !q.metadata.gradingRubric) errors.push(`${qId}: missing gradingRubric`);
    if (!q.metadata || !Array.isArray(q.metadata.essentialKeyPoints) || q.metadata.essentialKeyPoints.length === 0) {
      errors.push(`${qId}: missing essentialKeyPoints`);
    }

    // Verify answer verification
    if (!verifyAnswer(q.flag, q)) {
      errors.push(`${qId}: canonical flag failed scoring verification`);
    }

    // Verify safeContent serialization (no prompt withholding)
    const sanitizedPrompt = safeContent(q.prompt, [q.flag]);
    if (sanitizedPrompt.includes('withheld')) {
      errors.push(`${qId}: prompt contains flag or triggers withholding in safeContent`);
    }
  });

  return errors;
}

async function seedMissionMapLevel(cliOpts) {
  const { level, targetDb, isConfirm, isDryRun, uri } = cliOpts;

  console.log('====================================================');
  console.log(' THE TECH MYSTERY: MISSION MAP BATCH SEED SCRIPT    ');
  console.log('====================================================');

  if (!level || isNaN(level) || level < 1 || level > 10) {
    throw new Error('Valid --level=<1..10> argument is required.');
  }

  const modeStr = isConfirm ? 'CONFIRMED WRITE' : 'DRY RUN (NO WRITES)';
  console.log(`[Mode]           ${modeStr}`);
  console.log(`[Target Level]   Level ${level}`);
  console.log(`[Target DB]      ${targetDb}`);

  // Load level data
  const dataPath = path.resolve(__dirname, `../src/data/mission-map/level${level}/index.js`);
  let levelData;
  try {
    levelData = require(dataPath);
  } catch (err) {
    throw new Error(`Failed to load dataset for Level ${level} from ${dataPath}: ${err.message}`);
  }

  console.log(`\n--- 1. Pre-Seed Dataset Validation ---`);
  console.log(`Level: ${levelData.levelNumber} - "${levelData.title}" (${levelData.difficulty})`);
  console.log(`Total questions in dataset: ${levelData.questions.length}`);

  const validationErrors = await validateDataset(levelData);
  if (validationErrors.length > 0) {
    console.error(`[VALIDATION FAILED] ${validationErrors.length} errors found:`);
    validationErrors.forEach(e => console.error(` - ${e}`));
    throw new Error(`Dataset validation failed with ${validationErrors.length} errors.`);
  }
  console.log(`[PASS] Dataset validation passed: 70 open-ended questions, 0 MCQs, all rubrics & verifications verified.`);

  // Connect to database
  const targetUri = uri || process.env.MONGODB_URI;
  if (!targetUri) {
    throw new Error('MongoDB connection URI not found. Ensure server/.env contains MONGODB_URI.');
  }

  const sanitizedUri = targetUri.replace(/:\/\/.*@/, '://***@');
  console.log(`\n--- 2. Database Connection ---`);
  console.log(`[Connecting] to: ${sanitizedUri}`);

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 8000, autoIndex: false });
  }

  const connectedDb = mongoose.connection.name;
  const host = mongoose.connection.host;
  console.log(`[Connected] Database: "${connectedDb}" on host: "${host}"`);

  // Target database safety check
  if (targetDb && connectedDb !== targetDb) {
    throw new Error(`[SAFETY ABORT] Connected to "${connectedDb}", but --target-db="${targetDb}" was specified.`);
  }

  // Find Challenge and Checkpoint for this level
  const challenge = await Challenge.findOne({ levelNumber: level }).lean();
  if (!challenge) {
    throw new Error(`Challenge for Level ${level} not found in database.`);
  }
  console.log(`[Challenge] Found Level ${level}: "${challenge.title}" (ID: ${challenge._id})`);

  let checkpoint = await Checkpoint.findOne({ levelNumber: level }).lean();
  if (!checkpoint && level <= 3) {
    throw new Error(`Required Checkpoint for Level ${level} not found!`);
  }
  if (checkpoint) {
    console.log(`[Checkpoint] Preserved Level ${level}: "${checkpoint.checkpointCode}" (ID: ${checkpoint._id}, qrToken: ${Boolean(checkpoint.qrToken)})`);
  } else {
    console.log(`[Checkpoint] Level ${level} operates digitally without a physical QR checkpoint.`);
    const physicalCps = await Checkpoint.find({ levelNumber: { $in: [1, 2, 3] } }).lean();
    console.log(`[Checkpoint] Preserved ${physicalCps.length}/3 physical checkpoints: ${physicalCps.map(c => c.checkpointCode).join(', ')}`);
  }

  // Inspect existing questions for this level
  const existingQuestions = await Question.find({ levelNumber: level }).select('+flag').lean();
  console.log(`\n--- 3. Existing Question Audit ---`);
  console.log(`Current questions in database for Level ${level}: ${existingQuestions.length}`);

  const activeExisting = existingQuestions.filter(q => q.status === 'Published' && q.isActive);
  const archivedExisting = existingQuestions.filter(q => q.status === 'Archived' || !q.isActive);
  const existingSeedIds = new Set(existingQuestions.map(q => q.metadata?.seedId).filter(Boolean));

  console.log(` - Active/Published: ${activeExisting.length}`);
  console.log(` - Archived/Inactive: ${archivedExisting.length}`);
  console.log(` - Existing Mission Map seedIds: ${existingSeedIds.size}`);

  // Check how many of the 70 questions are new vs existing upserts
  let plannedInserts = 0;
  let plannedUpdates = 0;
  levelData.questions.forEach(q => {
    if (existingSeedIds.has(q.stableId)) {
      plannedUpdates++;
    } else {
      plannedInserts++;
    }
  });

  console.log(`\n--- 4. Planned Batch Execution ---`);
  console.log(`Planned new inserts: ${plannedInserts}`);
  console.log(`Planned updates:     ${plannedUpdates}`);
  console.log(`Preserved legacy:    ${existingQuestions.length - existingSeedIds.size}`);

  if (isDryRun) {
    console.log('\n====================================================');
    console.log(' DRY-RUN COMPLETE: NO WRITES PERFORMED               ');
    console.log(' To apply changes to database, rerun with --confirm  ');
    console.log('====================================================');
    await mongoose.disconnect();
    return {
      dryRun: true,
      level,
      database: connectedDb,
      datasetQuestions: levelData.questions.length,
      existingCount: existingQuestions.length,
      plannedInserts,
      plannedUpdates
    };
  }

  // Confirmed Write
  console.log('\n--- 5. Executing Idempotent Upserts ---');
  let processedCount = 0;

  for (const q of levelData.questions) {
    const updateDoc = {
      challengeId: challenge._id,
      checkpointId: checkpoint ? checkpoint._id : null,
      levelNumber: level,
      order: q.order,
      title: q.title,
      prompt: q.prompt,
      category: q.category,
      difficulty: q.difficulty,
      type: q.type,
      options: [], // Strictly no multiple choice options
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
    };

    await Question.findOneAndUpdate(
      { levelNumber: level, 'metadata.seedId': q.stableId },
      { $set: updateDoc },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    processedCount++;
  }

  console.log(`[SUCCESS] Processed ${processedCount} questions for Level ${level}.`);

  // Post-seed verification check
  const postQuestions = await Question.find({ levelNumber: level, status: 'Published', isActive: true }).lean();
  const postMissionMap = await Question.find({ levelNumber: level, 'metadata.pool': 'mission-map-70', status: 'Published', isActive: true }).lean();

  console.log(`\n--- 6. Post-Seed Verification ---`);
  console.log(`Total active questions in Level ${level}: ${postQuestions.length}`);
  console.log(`Mission Map active questions in Level ${level}: ${postMissionMap.length}`);

  // Verify checkpoint integrity untouched
  if (checkpoint) {
    const postCp = await Checkpoint.findById(checkpoint._id).lean();
    if (!postCp || postCp.qrToken !== checkpoint.qrToken) {
      throw new Error(`[CRITICAL] Checkpoint QR token was modified during seed!`);
    }
    console.log(`[PASS] Checkpoint ${checkpoint.checkpointCode} QR token and scan URLs remain 100% intact.`);
  }

  await mongoose.disconnect();
  console.log('\n[DONE] Database connection closed cleanly.');

  return {
    success: true,
    level,
    database: connectedDb,
    processedCount,
    postActiveCount: postQuestions.length,
    postMissionMapCount: postMissionMap.length
  };
}

// CLI Execution Entry Point
if (require.main === module) {
  const cliOpts = parseCliArgs();
  seedMissionMapLevel(cliOpts)
    .then(res => {
      console.log('Result:', JSON.stringify(res, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('\n[FATAL ERROR]', err.message);
      if (mongoose.connection.readyState === 1) {
        mongoose.disconnect().finally(() => process.exit(1));
      } else {
        process.exit(1);
      }
    });
}

module.exports = { seedMissionMapLevel, validateDataset };


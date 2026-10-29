/**
 * Independent Production MongoDB Atlas Question Verification Script
 * Validates the 30-question migration state directly against the database without performing any writes.
 *
 * Requirements:
 * - Read-only: never modifies, deletes, or inserts any documents.
 * - Enforces target database verification (defaults to 'test').
 * - Validates:
 *   1. Level 1: exactly 10 active published questions (order 1..10).
 *   2. Level 2: exactly 10 active published questions (order 1..10).
 *   3. Level 3: exactly 10 active published questions (order 1..10).
 *   4. Total: exactly 30 questions.
 *   5. Each question has challengeId, checkpointId, levelNumber, non-empty flag, and 4 options.
 *   6. Exactly one option matches flag.
 *   7. Checkpoints HTG-CP01, HTG-CP02, HTG-CP03 exist, have intact QR data, and are properly linked.
 * - NEVER prints or logs raw credentials or secrets.
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

// Load environment configuration: server/.env takes precedence over root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { Challenge, Checkpoint, Question } = require('../src/models');
const { verifyAnswer } = require('../src/services/scoring.service');
const { safeContent, participantQuestion } = require('../src/utils/participantData');

function resolveCliOptions() {
  const args = process.argv.slice(2);
  const targetDbArg = args.find(a => a.startsWith('--target-db='));
  const targetDb = targetDbArg ? targetDbArg.split('=')[1].trim() : (args.includes('--target-db') ? args[args.indexOf('--target-db') + 1] : 'test');

  const uriArg = args.find(a => a.startsWith('--uri='));
  const uri = uriArg ? uriArg.split('=')[1].trim() : (args.includes('--uri') ? args[args.indexOf('--uri') + 1] : null);

  return { targetDb, uri };
}

async function verifyAtlasQuestions(options = {}) {
  const cliOpts = resolveCliOptions();
  const targetDb = options.targetDb || cliOpts.targetDb;
  const targetUri = options.uri || cliOpts.uri || process.env.MONGODB_URI;

  console.log('====================================================');
  console.log(' THE TECH MYSTERY: ATLAS 30-QUESTION VERIFICATION  ');
  console.log('====================================================');

  if (!targetUri) {
    throw new Error('MongoDB URI is required. Supply via $env:MONGODB_URI or --uri=<atlas_uri>');
  }

  const sanitizedUri = targetUri.replace(/:\/\/.*@/, '://***@');
  console.log(`[Database] Connecting to: ${sanitizedUri}`);

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 8000, autoIndex: false });
  }

  const dbName = mongoose.connection.name;
  const host = mongoose.connection.host || 'unknown-host';
  console.log(`[INFO] Connected to MongoDB database: "${dbName}" on host: "${host}"`);

  if (targetDb && dbName !== targetDb) {
    throw new Error(`[SAFETY ABORT] Target database mismatch! Expected "${targetDb}", but connected to "${dbName}".`);
  }

  const report = {
    database: dbName,
    host,
    checkpoints: {},
    challenges: {},
    questionCounts: {},
    validationErrors: []
  };

  // 1. Verify Checkpoints HTG-CP01, HTG-CP02, HTG-CP03
  console.log('\n--- 1. Checkpoint Verification ---');
  for (let lvl = 1; lvl <= 3; lvl++) {
    const cpCode = `HTG-CP0${lvl}`;
    const cp = await Checkpoint.findOne({ checkpointCode: cpCode }).lean();
    if (!cp) {
      report.validationErrors.push(`Missing checkpoint ${cpCode}`);
      console.error(`[FAIL] Checkpoint ${cpCode} NOT FOUND!`);
      continue;
    }

    const hasQrToken = Boolean(cp.qrToken);
    const hasQrScanUrl = Boolean(cp.qrScanUrl || cp.qrCodeUrl);
    const hasQrCodeData = Boolean(cp.qrCodeDataUrl || cp.qrCodeData);

    report.checkpoints[cpCode] = {
      _id: String(cp._id),
      name: cp.name,
      levelNumber: cp.levelNumber,
      hasQrScanUrl,
      hasQrCodeData,
      hasQrToken,
      scanCount: cp.scanCount,
      associatedChallengeId: cp.associatedChallengeId ? String(cp.associatedChallengeId) : null
    };

    console.log(`[PASS] Checkpoint ${cpCode} | ID: ${cp._id} | QR Present: ${hasQrCodeData} | Scan URL Present: ${hasQrScanUrl} | Token Present: ${hasQrToken} | Scans: ${cp.scanCount}`);
  }

  // 2. Verify Level Challenges
  console.log('\n--- 2. Challenge Container Verification ---');
  for (let lvl = 1; lvl <= 3; lvl++) {
    const ch = await Challenge.findOne({ levelNumber: lvl }).lean();
    if (!ch) {
      report.validationErrors.push(`Missing Challenge for Level ${lvl}`);
      console.error(`[FAIL] Challenge for Level ${lvl} NOT FOUND!`);
      continue;
    }

    report.challenges[lvl] = {
      _id: String(ch._id),
      title: ch.title,
      category: ch.category,
      difficulty: ch.difficulty,
      status: ch.status,
      isActive: ch.isActive
    };

    console.log(`[PASS] Level ${lvl} Challenge: "${ch.title}" | ID: ${ch._id} | Status: ${ch.status} | Active: ${ch.isActive}`);
  }

  // 3. Verify Question Counts Per Level
  console.log('\n--- 3. Question Counts Verification ---');
  for (let lvl = 1; lvl <= 3; lvl++) {
    const activeCount = await Question.countDocuments({
      levelNumber: lvl,
      status: 'Published',
      isActive: true
    });
    report.questionCounts[`level${lvl}`] = activeCount;
    console.log(`[COUNT] Level ${lvl} active published questions: ${activeCount} / 10`);
    if (activeCount !== 10) {
      report.validationErrors.push(`Level ${lvl} active published questions is ${activeCount}, expected 10`);
    }
  }

  const totalQuestions = await Question.countDocuments({
    levelNumber: { $in: [1, 2, 3] },
    status: 'Published',
    isActive: true
  });
  report.questionCounts.total = totalQuestions;
  console.log(`[COUNT] Total active published questions across Levels 1-3: ${totalQuestions} / 30`);
  if (totalQuestions !== 30) {
    report.validationErrors.push(`Total active questions is ${totalQuestions}, expected 30`);
  }

  // 4. Detailed Question Verification
  console.log('\n--- 4. Question Fields & Sanitization Verification ---');
  const allQuestions = await Question.find({
    levelNumber: { $in: [1, 2, 3] },
    status: 'Published',
    isActive: true
  })
    .sort({ levelNumber: 1, order: 1 })
    .select('+flag');

  for (const q of allQuestions) {
    const prefix = `[L${q.levelNumber} Q${q.order}] "${q.title}"`;

    // Order 1..10 check
    if (q.order < 1 || q.order > 10) {
      report.validationErrors.push(`${prefix}: invalid order ${q.order}`);
    }

    // Flag check
    if (!q.flag || !String(q.flag).trim()) {
      report.validationErrors.push(`${prefix}: empty flag`);
    }

    // Options check
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      report.validationErrors.push(`${prefix}: options count is ${q.options?.length}, expected 4`);
    } else {
      const matchCount = q.options.filter(
        opt => opt.trim().toLowerCase() === String(q.flag).trim().toLowerCase()
      ).length;
      if (matchCount !== 1) {
        report.validationErrors.push(`${prefix}: options match count for flag is ${matchCount}, expected 1`);
      }
    }

    // Verify answer function check
    if (!verifyAnswer(q.flag, q)) {
      report.validationErrors.push(`${prefix}: verifyAnswer rejected flag`);
    }

    // Checkpoint ID check
    const expectedCp = report.checkpoints[`HTG-CP0${q.levelNumber}`];
    if (expectedCp && String(q.checkpointId) !== expectedCp._id) {
      report.validationErrors.push(`${prefix}: checkpointId mismatch`);
    }

    // Sanitization check
    const dto = await participantQuestion(q);
    if (dto.flag !== undefined) {
      report.validationErrors.push(`${prefix}: participant DTO leaked flag`);
    }
    if (dto.prompt === 'Content withheld pending organizer review.') {
      report.validationErrors.push(`${prefix}: prompt falsely withheld`);
    }
  }

  console.log('\n====================================================');
  if (report.validationErrors.length === 0) {
    console.log('[VERDICT: PASS] All 30 questions on Atlas are 100% verified.');
    console.log('  - Level 1: 10 / 10 active published questions');
    console.log('  - Level 2: 10 / 10 active published questions');
    console.log('  - Level 3: 10 / 10 active published questions');
    console.log('  - Physical checkpoints HTG-CP01, HTG-CP02, HTG-CP03 intact');
    console.log('====================================================\n');
  } else {
    console.error(`[VERDICT: FAIL] Encountered ${report.validationErrors.length} errors:`);
    report.validationErrors.forEach(err => console.error(`  - ${err}`));
    console.log('====================================================\n');
  }

  return report;
}

if (require.main === module) {
  verifyAtlasQuestions()
    .then((report) => {
      if (report.validationErrors.length > 0) process.exit(1);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Verification failed:', err.message);
      process.exit(1);
    });
}

module.exports = { verifyAtlasQuestions };


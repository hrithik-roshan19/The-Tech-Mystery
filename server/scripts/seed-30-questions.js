/**
 * Production Question Migration & Seed Script
 * Provisions 10 sequential questions for Level 1, Level 2, and Level 3 (30 questions total).
 *
 * Requirements:
 * - Preserves existing checkpoints (HTG-CP01, HTG-CP02, HTG-CP03) and their QR codes.
 * - Resolves or links Challenge containers for Level 1, Level 2, Level 3.
 * - Idempotent upsert by { levelNumber, order }: safe against multiple runs with zero duplicates.
 * - Multiple Choice questions with 4 options and exactly one match for the flag.
 * - Case-insensitive matching enabled (isCaseSensitive: false).
 * - Verified against Question pre-validate and participant data sanitization.
 */

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const { Challenge, Checkpoint, Question } = require('../src/models');
const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../src/constants/challengeTypes');
const { verifyAnswer } = require('../src/services/scoring.service');
const { safeContent, participantQuestion } = require('../src/utils/participantData');
const logger = require('../src/utils/logger');

const QUESTIONS_DATA = [
  // ==========================================
  // LEVEL 1: Orientation & Signal Breaker
  // Checkpoint: HTG-CP01 | 100 pts | EASY
  // ==========================================
  {
    levelNumber: 1,
    order: 1,
    title: 'Level 1 - Question 1: Number Sequence',
    prompt: 'What comes next: 2, 4, 8, 16, __?',
    flag: '32',
    options: ['24', '30', '32', '64'],
    category: CHALLENGE_TYPES.LOGICAL_REASONING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 2,
    title: 'Level 1 - Question 2: Web Protocols',
    prompt: 'What does HTTP stand for?',
    flag: 'Hypertext Transfer Protocol',
    options: [
      'Hypertext Transfer Protocol',
      'High Transmission Text Protocol',
      'Hyperlink Tracking & Transfer Procedure',
      'Hypertext Transport Package'
    ],
    category: CHALLENGE_TYPES.NETWORKING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 3,
    title: 'Level 1 - Question 3: Linux Navigation',
    prompt: 'Which Linux command displays the current directory?',
    flag: 'pwd',
    options: ['cd', 'pwd', 'dir', 'whereami'],
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 4,
    title: 'Level 1 - Question 4: Internet Fundamentals',
    prompt: 'What does IP stand for?',
    flag: 'Internet Protocol',
    options: ['Internal Port', 'Internet Protocol', 'Interface Process', 'Interconnected Packet'],
    category: CHALLENGE_TYPES.NETWORKING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 5,
    title: 'Level 1 - Question 5: Binary Representation',
    prompt: 'What is decimal 5 in binary?',
    flag: '101',
    options: ['011', '100', '101', '110'],
    category: CHALLENGE_TYPES.BINARY_ASCII,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 6,
    title: 'Level 1 - Question 6: Secure Web Communications',
    prompt: 'Which protocol is commonly used for secure websites?',
    flag: 'HTTPS',
    options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'],
    category: CHALLENGE_TYPES.WEB_SECURITY,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 7,
    title: 'Level 1 - Question 7: Linux File Operations',
    prompt: 'Which command lists files in Linux?',
    flag: 'ls',
    options: ['cat', 'list', 'ls', 'show'],
    category: CHALLENGE_TYPES.RECON,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 8,
    title: 'Level 1 - Question 8: Domain Name System',
    prompt: 'What does DNS translate domain names into?',
    flag: 'IP addresses',
    options: ['Binary machine code', 'Hardware MAC addresses', 'IP addresses', 'SSL certificates'],
    category: CHALLENGE_TYPES.NETWORKING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 9,
    title: 'Level 1 - Question 9: Network Diagnostics',
    prompt: 'Which tool is commonly used to test network reachability?',
    flag: 'ping',
    options: ['grep', 'netcat', 'ping', 'ssh'],
    category: CHALLENGE_TYPES.NETWORKING,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 1,
    order: 10,
    title: 'Level 1 - Question 10: Open Source Intelligence',
    prompt: 'What is the primary purpose of OSINT?',
    flag: 'Gather publicly available information',
    options: [
      'Bypass hardware firewalls',
      'Crack symmetric encryption keys',
      'Decompile closed-source binaries',
      'Gather publicly available information'
    ],
    category: CHALLENGE_TYPES.OSINT,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },

  // ==========================================
  // LEVEL 2: Web Inspection & Hidden Clues
  // Checkpoint: HTG-CP02 | 100 pts | EASY
  // ==========================================
  {
    levelNumber: 2,
    order: 1,
    title: 'Level 2 - Question 1: Hyperlink Destinations',
    prompt: "Which HTML attribute specifies a hyperlink's destination?",
    flag: 'href',
    options: ['href', 'link', 'src', 'target'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 2,
    title: 'Level 2 - Question 2: Anchor Elements',
    prompt: 'Which HTML tag creates a hyperlink?',
    flag: '<a>',
    options: ['<a>', '<href>', '<link>', '<url>'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 3,
    title: 'Level 2 - Question 3: Browser DOM Inspection',
    prompt: 'Which browser feature helps inspect HTML and CSS?',
    flag: 'Developer Tools',
    options: ['Bookmarks Bar', 'Cookie Storage Manager', 'Developer Tools', 'History Panel'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 4,
    title: 'Level 2 - Question 4: Image Accessibility',
    prompt: 'Which HTML attribute provides alternative text for an image?',
    flag: 'alt',
    options: ['alt', 'desc', 'label', 'title'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 5,
    title: 'Level 2 - Question 5: DOM Element Selection',
    prompt: 'Which JavaScript method selects an element by ID?',
    flag: 'getElementById',
    options: ['findId', 'getElementById', 'selectId', 'queryId'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 6,
    title: 'Level 2 - Question 6: Document Heading Hierarchy',
    prompt: 'Which HTML tag is used for the largest heading?',
    flag: '<h1>',
    options: ['<h0>', '<h1>', '<h6>', '<head>'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 7,
    title: 'Level 2 - Question 7: Web Page Presentation',
    prompt: 'Which language primarily styles web pages?',
    flag: 'CSS',
    options: ['CSS', 'HTML', 'JSON', 'SQL'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 8,
    title: 'Level 2 - Question 8: Unique Element Identifiers',
    prompt: 'Which HTML attribute assigns a unique identifier to an element?',
    flag: 'id',
    options: ['class', 'id', 'key', 'name'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 9,
    title: 'Level 2 - Question 9: Selector Querying',
    prompt: 'Which JavaScript method selects an element using a CSS selector?',
    flag: 'querySelector',
    options: ['extractSelector', 'getElementByCss', 'locate', 'querySelector'],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 2,
    order: 10,
    title: 'Level 2 - Question 10: Client-Side Source Inspection',
    prompt: "Where can you inspect a webpage's client-side source and DOM?",
    flag: 'Browser Developer Tools',
    options: [
      'Browser Developer Tools',
      'DNS Lookup Records',
      'Operating System Task Manager',
      'Web Server Terminal Logs'
    ],
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },

  // ==========================================
  // LEVEL 3: Cryptography & Cipher Puzzles
  // Checkpoint: HTG-CP03 | 100 pts | MEDIUM
  // ==========================================
  {
    levelNumber: 3,
    order: 1,
    title: 'Level 3 - Question 1: Caesar Shift Forward',
    prompt: 'A Caesar cipher shifts each letter 3 places forward. Encode CAT.',
    flag: 'FDW',
    options: ['DBU', 'ECV', 'FDW', 'GEX'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 2,
    title: 'Level 3 - Question 2: Caesar Shift Backward',
    prompt: 'Decode KHOOR by shifting each letter 3 places backward.',
    flag: 'HELLO',
    options: ['HELLO', 'IFMMP', 'JGNNQ', 'WORLD'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 3,
    title: 'Level 3 - Question 3: Alphabet Index Mapping',
    prompt: 'Using A=0, B=1, … Z=25, which letter represents 2?',
    flag: 'C',
    options: ['B', 'C', 'D', 'E'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 4,
    title: 'Level 3 - Question 4: Cryptographic Inversion',
    prompt: 'What is the reverse of encryption called?',
    flag: 'Decryption',
    options: ['Authentication', 'Decryption', 'Dehashing', 'Obfuscation'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 5,
    title: 'Level 3 - Question 5: ROT13 Inversion',
    prompt: 'Decode URYYB using ROT13.',
    flag: 'HELLO',
    options: ['ARRAY', 'CIPHER', 'HELLO', 'SECRET'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 6,
    title: 'Level 3 - Question 6: Shift Cipher Encoding',
    prompt: 'Encode DOG using a Caesar shift of 1 forward.',
    flag: 'EPH',
    options: ['CNF', 'EOF', 'EPH', 'FQJ'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 7,
    title: 'Level 3 - Question 7: Substitution Cipher Mechanics',
    prompt: 'Which cipher replaces each letter with another letter according to a fixed shift?',
    flag: 'Caesar cipher',
    options: ['AES block cipher', 'Caesar cipher', 'Diffie-Hellman', 'RSA public key'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 8,
    title: 'Level 3 - Question 8: Shift Cipher Decryption',
    prompt: 'Decode DWWDFN using a Caesar shift of 3 backward.',
    flag: 'ATTACK',
    options: ['ATTACK', 'DEFEND', 'ESCAPE', 'SECURE'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 9,
    title: 'Level 3 - Question 9: XOR Bitwise Operation',
    prompt: 'What is the result of XOR when both input bits are 1?',
    flag: '0',
    options: ['0', '1', '2', 'Undefined'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  },
  {
    levelNumber: 3,
    order: 10,
    title: 'Level 3 - Question 10: Cryptographic Hash Functions',
    prompt: 'Which of these is a cryptographic hash function?',
    flag: 'SHA-256',
    options: ['AES-128', 'Base64', 'RSA-2048', 'SHA-256'],
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    type: 'Multiple Choice',
    points: 100,
    attempts: 3,
    isCaseSensitive: false
  }
];

const LEVEL_CHALLENGES = {
  1: {
    levelNumber: 1,
    title: 'Orientation & Signal Breaker',
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    description: 'Observe the starting transmission, identify patterns, and conquer the initial grid defense nodes.',
    points: 100,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    requiresCheckpointScan: false,
    status: 'Published',
    isActive: true
  },
  2: {
    levelNumber: 2,
    title: 'Web Inspection & Hidden Clues',
    category: CHALLENGE_TYPES.WEB_INSPECTION,
    description: 'Inspect front-end structures, browser developer tools, and DOM elements to extract concealed keys.',
    points: 100,
    difficulty: CHALLENGE_DIFFICULTY.EASY,
    requiresCheckpointScan: true,
    status: 'Published',
    isActive: true
  },
  3: {
    levelNumber: 3,
    title: 'Cryptography & Cipher Puzzles',
    category: CHALLENGE_TYPES.CRYPTOGRAPHY,
    description: 'Analyze intercepted ciphers, frequency shifts, substitution algorithms, and cryptographic primitives.',
    points: 100,
    difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
    requiresCheckpointScan: true,
    status: 'Published',
    isActive: true
  }
};

async function seed30Questions() {
  console.log('====================================================');
  console.log('  THE TECH MYSTERY: 30 QUESTIONS DATABASE MIGRATION ');
  console.log('====================================================');

  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  const dbName = mongoose.connection.name;
  console.log(`[INFO] Connected to MongoDB database: "${dbName}"`);

  // 1. Resolve or Create Challenges for Levels 1, 2, 3
  const challengeMap = new Map();
  for (let lvl = 1; lvl <= 3; lvl++) {
    const cpCode = `HTG-CP0${lvl}`;
    const cp = await Checkpoint.findOne({ checkpointCode: cpCode });

    let ch = await Challenge.findOne({ levelNumber: lvl });
    if (!ch && cp?.associatedChallengeId) {
      ch = await Challenge.findById(cp.associatedChallengeId);
    }

    if (!ch) {
      ch = await Challenge.create(LEVEL_CHALLENGES[lvl]);
      console.log(`[CREATED] Challenge for Level ${lvl}: "${ch.title}" (ID: ${ch._id})`);
    } else {
      // Keep challenge active and published
      ch.status = 'Published';
      ch.isActive = true;
      await ch.save();
      console.log(`[RESOLVED] Existing Challenge for Level ${lvl}: "${ch.title}" (ID: ${ch._id})`);
    }
    challengeMap.set(lvl, ch);

    // Ensure Checkpoint exists and points to Challenge
    if (cp) {
      if (String(cp.associatedChallengeId) !== String(ch._id)) {
        cp.associatedChallengeId = ch._id;
        await cp.save();
        console.log(`[LINKED] Checkpoint ${cpCode} associatedChallengeId updated to ${ch._id}`);
      }
    } else {
      console.warn(`[WARN] Checkpoint ${cpCode} not found in database!`);
    }
  }

  // 2. Upsert Questions Idempotently
  console.log('\n--- Upserting 30 Questions (10 per Level) ---');
  let upsertedCount = 0;
  const processedQuestions = [];

  for (const qDef of QUESTIONS_DATA) {
    const ch = challengeMap.get(qDef.levelNumber);
    if (!ch) {
      throw new Error(`Missing Challenge container for Level ${qDef.levelNumber}`);
    }

    const cpCode = `HTG-CP0${qDef.levelNumber}`;
    const cp = await Checkpoint.findOne({ checkpointCode: cpCode });

    const filter = {
      levelNumber: qDef.levelNumber,
      order: qDef.order
    };

    const updateDoc = {
      challengeId: ch._id,
      levelNumber: qDef.levelNumber,
      order: qDef.order,
      checkpointId: cp ? cp._id : null,
      checkpointCode: cp ? cp.checkpointCode : cpCode,
      title: qDef.title,
      prompt: qDef.prompt,
      category: qDef.category,
      difficulty: qDef.difficulty,
      type: qDef.type,
      options: qDef.options,
      points: qDef.points,
      status: 'Published',
      attempts: qDef.attempts,
      required: true,
      flag: qDef.flag,
      isCaseSensitive: qDef.isCaseSensitive,
      isActive: true
    };

    // Use findOne and save/create to trigger Mongoose pre-validate hook and verify integrity
    let questionDoc = await Question.findOne(filter).select('+flag');
    if (!questionDoc) {
      questionDoc = new Question(updateDoc);
      await questionDoc.save();
      upsertedCount++;
      console.log(`[INSERTED] L${qDef.levelNumber} Q${qDef.order}: "${qDef.title}" -> Answer: "${qDef.flag}"`);
    } else {
      Object.assign(questionDoc, updateDoc);
      await questionDoc.save();
      upsertedCount++;
      console.log(`[UPDATED]  L${qDef.levelNumber} Q${qDef.order}: "${qDef.title}" -> Answer: "${qDef.flag}"`);
    }
    processedQuestions.push(questionDoc);
  }

  // 3. Comprehensive Verification
  console.log('\n--- Running Post-Seed Integrity Verification ---');

  for (let lvl = 1; lvl <= 3; lvl++) {
    const ch = challengeMap.get(lvl);
    const count = await Question.countDocuments({
      levelNumber: lvl,
      challengeId: ch._id,
      status: 'Published',
      isActive: true
    });
    console.log(`[VERIFY] Level ${lvl} active published questions count: ${count} / 10`);
    if (count !== 10) {
      throw new Error(`Integrity check failed: Level ${lvl} has ${count} questions, expected 10!`);
    }
  }

  const allQuestions = await Question.find({ levelNumber: { $in: [1, 2, 3] } })
    .sort({ levelNumber: 1, order: 1 })
    .select('+flag');

  console.log(`[VERIFY] Total questions in Levels 1-3: ${allQuestions.length} / 30`);
  if (allQuestions.length !== 30) {
    throw new Error(`Total questions count is ${allQuestions.length}, expected 30!`);
  }

  // Validate answer match and safeContent non-redaction
  let verifyErrors = 0;
  for (const q of allQuestions) {
    // 1. Verify flag is non-empty
    if (!q.flag || !String(q.flag).trim()) {
      console.error(`[ERROR] Question ${q.title} has empty flag!`);
      verifyErrors++;
    }

    // 2. Verify options has 4 items
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      console.error(`[ERROR] Question ${q.title} does not have exactly 4 options! Count: ${q.options?.length}`);
      verifyErrors++;
    }

    // 3. Verify exactly one option matches flag
    const matchCount = (q.options || []).filter(
      opt => opt.trim().toLowerCase() === String(q.flag).trim().toLowerCase()
    ).length;
    if (matchCount !== 1) {
      console.error(`[ERROR] Question ${q.title} options match count for flag "${q.flag}" is ${matchCount} (expected 1)!`);
      verifyErrors++;
    }

    // 4. Verify scoring service verifyAnswer accepts the flag
    const directValid = verifyAnswer(q.flag, q);
    if (!directValid) {
      console.error(`[ERROR] verifyAnswer rejected valid flag "${q.flag}" for ${q.title}!`);
      verifyErrors++;
    }

    // 5. Verify sanitized participant DTO does not leak flag or get withheld
    const dto = await participantQuestion(q);
    if (dto.prompt === 'Content withheld pending organizer review.') {
      console.error(`[ERROR] Prompt was falsely withheld for ${q.title}! Prompt: "${q.prompt}"`);
      verifyErrors++;
    }
    if (dto.title === 'Content withheld pending organizer review.') {
      console.error(`[ERROR] Title was falsely withheld for ${q.title}! Title: "${q.title}"`);
      verifyErrors++;
    }
    if (dto.flag !== undefined) {
      console.error(`[ERROR] Participant DTO leaked flag for ${q.title}!`);
      verifyErrors++;
    }
  }

  if (verifyErrors > 0) {
    throw new Error(`Post-seed integrity check encountered ${verifyErrors} errors!`);
  }

  console.log('[SUCCESS] All 30 questions verified with 100% integrity.');
  console.log('====================================================\n');
}

if (require.main === module) {
  seed30Questions()
    .then(() => {
      console.log('Seed completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}

module.exports = { seed30Questions, QUESTIONS_DATA };

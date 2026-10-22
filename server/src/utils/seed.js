const connectDB = require('../config/db');
const {
  User,
  Team,
  Challenge,
  Question,
  Checkpoint,
  Score,
  EventConfig,
  SecurityLog
} = require('../models');
const { ROLES } = require('../constants/roles');
const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../constants/challengeTypes');
const { EVENT_STATES } = require('../constants/eventStates');
const logger = require('./logger');

async function seedDatabase() {
  if (process.env.NODE_ENV === 'production') throw new Error('Demo seeding is disabled in production');
  if (!process.argv.includes('--force-dev-demo-seed') && process.env.ALLOW_DEMO_SEEDING !== 'true') {
    throw new Error('Demo seeding is guarded to prevent accidental injection into event databases. To run explicitly in development, pass --force-dev-demo-seed or set ALLOW_DEMO_SEEDING=true.');
  }
  logger.info('====================================================');
  logger.info('  STARTING THE TECH MYSTERY DATABASE SEEDING PROCESS  ');
  logger.info('====================================================');

  await connectDB();

  // 1. EVENT CONFIGURATION
  let eventConfig = await EventConfig.findOne();
  if (!eventConfig) {
    eventConfig = await EventConfig.create({
      eventName: 'The Tech Mystery',
      organizer: "CodeSphere Coding Club, Tula's University",
      subtitle: 'CodeSphere × UTKRISHT 2026',
      state: EVENT_STATES.LIVE,
      startTime: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
      endTime: new Date(Date.now() + 3600 * 1000 * 6), // 6 hours ahead
      totalLevels: 10,
      isLeaderboardFrozen: false,
      maxTeamSize: 4,
      minTeamSize: 2,
      maxTeams: 50,
      registrationOpen: true,
      qrCheckpoints: true,
      hintsEnabled: true,
      maintenanceMode: false,
      announcementsEnabled: true,
      location: "Tula's University, Dehradun",
      announcements: [
        {
          title: 'Event is LIVE!',
          content: 'The Tech Mystery 2026 has officially commenced. Scan checkpoints and conquer levels!',
          priority: 'HIGH',
          createdAt: new Date(Date.now() - 3600 * 1000 * 2)
        },
        {
          title: 'Checkpoint 04 Activated',
          content: 'Library reading room beacon is online and accepting eligible scans.',
          priority: 'MEDIUM',
          createdAt: new Date(Date.now() - 3600 * 1000)
        }
      ]
    });
    logger.info('[Seed] Initialized EventConfig');
  } else {
    logger.info('[Seed] Existing EventConfig found');
  }

  // 2. DEFAULT ADMIN ACCOUNT
  let adminUser = await User.findOne({ email: 'admin@codesphere.tulas.edu.in' });
  if (!adminUser) {
    adminUser = await User.create({
      username: 'hrx_admin',
      email: 'admin@codesphere.tulas.edu.in',
      passwordHash: '12345',
      fullName: 'Hrithik Roshan',
      role: ROLES.ADMIN,
      department: 'CodeSphere · Event Operations',
      college: "Tula's University",
      isActive: true,
      twoFactor: true,
      securityAlerts: true,
      emailAlerts: true
    });
    logger.info('[Seed] Created development administrator');
  } else {
    logger.info('[Seed] Existing Admin found: ' + adminUser.email);
  }

  // 3. 10 CHALLENGE DEFINITIONS
  const challengeDefinitions = [
    {
      levelNumber: 1,
      title: 'Orientation & Signal Breaker',
      subtitle: 'The Starting Point',
      category: CHALLENGE_TYPES.CRYPTOGRAPHY,
      description: 'Observe the starting transmission and decode the initial grid frequency.',
      objectives: ['Decode the base cipher', 'Verify flag format HTG{...}', 'Submit to unlock Level 2'],
      points: 100,
      difficulty: CHALLENGE_DIFFICULTY.EASY,
      requiresCheckpointScan: false,
      status: 'Published'
    },
    {
      levelNumber: 2,
      title: 'Hidden in Plain Sight',
      subtitle: 'DOM & Client Secrets',
      category: CHALLENGE_TYPES.WEB_INSPECTION,
      description: 'Inspect the front-end structure and discover hidden elements left by former operators.',
      objectives: ['Scan Checkpoint 02', 'Inspect page sources and DOM', 'Extract hidden attribute flag'],
      points: 150,
      difficulty: CHALLENGE_DIFFICULTY.EASY,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 3,
      title: 'Lost Transmission',
      subtitle: 'Cryptographic Transposition',
      category: CHALLENGE_TYPES.CRYPTOGRAPHY,
      description: 'An intercepted campus transmission was scrambled using classical cipher mechanisms.',
      objectives: ['Scan Checkpoint 03', 'Analyze frequency and transposition', 'Recover plaintext flag'],
      points: 200,
      difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 4,
      title: 'Digital Footprint',
      subtitle: 'OSINT & Repository Forensics',
      category: CHALLENGE_TYPES.OSINT,
      description: 'Connect public records and discover traces left in open campus repositories.',
      objectives: ['Scan Checkpoint 04', 'Investigate repository history', 'Retrieve hidden metadata'],
      points: 250,
      difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 5,
      title: 'Binary Echo',
      subtitle: 'Assembly & Bytecode Logic',
      category: CHALLENGE_TYPES.DEBUGGING,
      description: 'Analyze an executable sample and reverse the algorithmic key comparison.',
      objectives: ['Scan Checkpoint 05', 'Reverse bytecode XOR routine', 'Derive valid registration key'],
      points: 300,
      difficulty: CHALLENGE_DIFFICULTY.MEDIUM,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 6,
      title: 'Memory Artifacts',
      subtitle: 'Forensic System Artifacts',
      category: CHALLENGE_TYPES.FORENSICS,
      description: 'Examine raw evidence files and locate hidden volatile system traces.',
      objectives: ['Scan Checkpoint 06', 'Inspect process memory artifacts', 'Recover decrypted flag segment'],
      points: 350,
      difficulty: CHALLENGE_DIFFICULTY.HARD,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 7,
      title: 'Buffer Vulnerability Exploitation',
      subtitle: 'Binary Exploitation Sandpit',
      category: CHALLENGE_TYPES.PWN,
      description: 'Analyze memory boundary checks in a sandboxed binary and redirect execution flow.',
      objectives: ['Scan Checkpoint 07', 'Calculate memory displacement', 'Trigger winning function target'],
      points: 400,
      difficulty: CHALLENGE_DIFFICULTY.HARD,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 8,
      title: 'Packet Highway',
      subtitle: 'Network Protocol Forensics',
      category: CHALLENGE_TYPES.NETWORKING,
      description: 'A covert communication session was logged in a raw campus network packet capture.',
      objectives: ['Scan Checkpoint 08', 'Reassemble TCP transport stream', 'Reconstruct transmitted artifact'],
      points: 450,
      difficulty: CHALLENGE_DIFFICULTY.HARD,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 9,
      title: 'Polyalphabetic Steganography',
      subtitle: 'Hidden Media Channels',
      category: CHALLENGE_TYPES.STEGANOGRAPHY,
      description: 'A high-resolution image hides encrypted data within its least significant bits.',
      objectives: ['Scan Checkpoint 09', 'Extract bitmap bit planes', 'Solve polyalphabetic cipher key'],
      points: 500,
      difficulty: CHALLENGE_DIFFICULTY.EXPERT,
      requiresCheckpointScan: true,
      status: 'Published'
    },
    {
      levelNumber: 10,
      title: 'The Master Flag Citadel',
      subtitle: 'The Final Breach',
      category: CHALLENGE_TYPES.MASTER_FLAG,
      description: 'The final barrier guarding the central grid. Synthesize all security keys into the ultimate flag.',
      objectives: ['Scan Checkpoint 10', 'Assemble cryptographic sub-keys', 'Capture the Master Flag'],
      points: 600,
      difficulty: CHALLENGE_DIFFICULTY.EXPERT,
      requiresCheckpointScan: true,
      status: 'Published'
    }
  ];

  const challengeMap = new Map();
  for (const def of challengeDefinitions) {
    let challenge = await Challenge.findOne({ levelNumber: def.levelNumber });
    if (!challenge) {
      challenge = await Challenge.create(def);
      logger.info(`[Seed] Created Challenge Level ${def.levelNumber}: ${def.title}`);
    } else {
      challenge.title = def.title;
      challenge.category = def.category;
      challenge.points = def.points;
      challenge.difficulty = def.difficulty;
      challenge.requiresCheckpointScan = def.requiresCheckpointScan;
      await challenge.save();
    }
    challengeMap.set(def.levelNumber, challenge);
  }

  // 4. CHECKPOINT DEFINITIONS (CP-01 to CP-10)
  const checkpointLocations = [
    { code: 'HTG-CP01', name: 'Welcome Signal Beacon', loc: 'Main Auditorium Entrance', level: 1, mode: 'Public QR' },
    { code: 'HTG-CP02', name: 'Hidden in Plain Sight Station', loc: 'Computer Centre — Lab 5', level: 2, mode: 'Public QR' },
    { code: 'HTG-CP03', name: 'Lost Transmission Relay', loc: 'Innovation Lab', level: 3, mode: 'Team-bound QR' },
    { code: 'HTG-CP04', name: 'Digital Footprint Archive', loc: 'Central Library — Reading Room', level: 4, mode: 'Team-bound QR' },
    { code: 'HTG-CP05', name: 'Binary Echo Terminal', loc: 'Engineering Block B — Room 204', level: 5, mode: 'Team-bound QR' },
    { code: 'HTG-CP06', name: 'Forensics Recovery Node', loc: 'Robotics & IoT Lab', level: 6, mode: 'Team-bound QR' },
    { code: 'HTG-CP07', name: 'Exploitation Sandpit', loc: 'Server Room — Alpha Rack Foyer', level: 7, mode: 'Team-bound QR' },
    { code: 'HTG-CP08', name: 'Packet Highway Gateway', loc: 'Cyber Cafe & Student Lounge', level: 8, mode: 'Team-bound QR' },
    { code: 'HTG-CP09', name: 'Stego Chamber Node', loc: 'Dean Academic Office Foyer', level: 9, mode: 'Team-bound QR' },
    { code: 'HTG-CP10', name: 'Master Flag Citadel Gate', loc: 'Utkrisht Main Arena Stage', level: 10, mode: 'Team-bound QR' }
  ];

  for (const cpDef of checkpointLocations) {
    const ch = challengeMap.get(cpDef.level);
    let checkpoint = await Checkpoint.findOne({ checkpointCode: cpDef.code });
    if (!checkpoint) {
      checkpoint = await Checkpoint.create({
        levelNumber: cpDef.level,
        name: cpDef.name,
        locationDescription: cpDef.loc,
        checkpointCode: cpDef.code,
        associatedChallengeId: ch?._id,
        mode: cpDef.mode,
        status: 'Active',
        isActive: true,
        scanCount: 15
      });
      logger.info(`[Seed] Created Checkpoint ${cpDef.code} (Level ${cpDef.level}) at ${cpDef.loc}`);
    } else {
      checkpoint.associatedChallengeId = ch?._id;
      checkpoint.locationDescription = cpDef.loc;
      checkpoint.name = cpDef.name;
      checkpoint.levelNumber = cpDef.level;
      await checkpoint.save();
    }

    // Link challenge back to checkpoint
    if (ch && !ch.checkpointId) {
      ch.checkpointId = checkpoint._id;
      await ch.save();
    }
  }

  // 5. QUESTION POOLS (2-3 VARIATIONS PER LEVEL FOR TEAM ROTATION)
  const questionPool = [
    // Level 1
    {
      levelNumber: 1,
      title: 'Base64 Welcome Beacon',
      prompt: 'Welcome to The Tech Mystery! Decode the following broadcast transmission to capture your first flag:\n\n```\nSFRHe3dlbGNvbWVfdG9fdGhlX2dyaWRfMjAyNn0=\n```',
      category: CHALLENGE_TYPES.CRYPTOGRAPHY,
      type: 'Flag',
      points: 100,
      flag: 'HTG{welcome_to_the_grid_2026}',
      hints: [{ hintIndex: 1, content: 'Notice the trailing = padding character. It indicates standard Base64 encoding.', penaltyPoints: 20 }]
    },
    {
      levelNumber: 1,
      title: 'Caesar Rotation Beacon',
      prompt: 'An encoded signal has been emitted from the arena beacon:\n\n```\nUGF7ebg13_fvtany_qrpbrq_2026}\n```\n\nDecode using ROT13 cipher.',
      category: CHALLENGE_TYPES.CRYPTOGRAPHY,
      type: 'Flag',
      points: 100,
      flag: 'HTG{rot13_signal_decoded_2026}',
      hints: [{ hintIndex: 1, content: 'Shift each English letter forward by 13 positions.', penaltyPoints: 20 }]
    },
    {
      levelNumber: 1,
      title: 'Binary Stream Transmission',
      prompt: 'Binary stream received at the welcome gate:\n\n```\n01001000 01010100 01000111 01111011 01100010 01101001 01101110 01100001 01110010 01111001 01011111 01100010 01100101 01100001 01100011 01101111 01101110 01111101\n```',
      category: CHALLENGE_TYPES.CRYPTOGRAPHY,
      type: 'Flag',
      points: 100,
      flag: 'HTG{binary_beacon}',
      hints: [{ hintIndex: 1, content: 'Convert each 8-bit byte into ASCII characters.', penaltyPoints: 20 }]
    },

    // Level 2
    {
      levelNumber: 2,
      title: 'DOM Comment Clue',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.WEB_INSPECTION,
      type: 'Flag',
      points: 150,
      flag: 'HTG{hidden_in_dom_comment}',
      hints: [{ hintIndex: 1, content: 'Inspect elements or view source in developer tools.', penaltyPoints: 25 }]
    },
    {
      levelNumber: 2,
      title: 'Custom HTTP Header',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.WEB_INSPECTION,
      type: 'Flag',
      points: 150,
      flag: 'HTG{header_secret_revealed}',
      hints: [{ hintIndex: 1, content: 'Check the Network tab response headers on the gateway.', penaltyPoints: 25 }]
    },
    {
      levelNumber: 2,
      title: 'Hidden Form Attribute',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.WEB_INSPECTION,
      type: 'Flag',
      points: 150,
      flag: 'HTG{hidden_form_input_val}',
      hints: [{ hintIndex: 1, content: 'Look for type="hidden" form tags.', penaltyPoints: 25 }]
    },

    // Level 3
    {
      levelNumber: 3,
      title: 'Vigenere Grid Cipher',
      prompt: 'Decipher the intercepted message using key `GRID`:\n\n`NZX{z_zvxmfc_dvkkroy_2026}`',
      category: CHALLENGE_TYPES.CRYPTOGRAPHY,
      type: 'Flag',
      points: 200,
      flag: 'HTG{a_secret_message_2026}',
      hints: [{ hintIndex: 1, content: 'Vigenere cipher decrypts using repeating key GRID.', penaltyPoints: 30 }]
    },
    {
      levelNumber: 3,
      title: 'Atbash Substitution',
      prompt: 'The operative left a message encrypted using the classical Atbash reciprocal cipher:\n\n`SGT{zgyzhs_xrkzvi_yivzxsvw}`',
      category: CHALLENGE_TYPES.CRYPTOGRAPHY,
      type: 'Flag',
      points: 200,
      flag: 'HTG{atbash_cipher_breached}',
      hints: [{ hintIndex: 1, content: 'Map A to Z, B to Y, etc.', penaltyPoints: 30 }]
    },

    // Level 4
    {
      levelNumber: 4,
      title: 'Git Commit Forensics',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.OSINT,
      type: 'Flag',
      points: 250,
      flag: 'HTG{git_commit_forensics}',
      hints: [{ hintIndex: 1, content: 'Check `git log -p` or commit diff history.', penaltyPoints: 35 }]
    },
    {
      levelNumber: 4,
      title: 'DNS TXT Record Discovery',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.OSINT,
      type: 'Flag',
      points: 250,
      flag: 'HTG{dns_txt_record_found}',
      hints: [{ hintIndex: 1, content: 'Use nslookup or dig TXT queries.', penaltyPoints: 35 }]
    },

    // Level 5
    {
      levelNumber: 5,
      title: 'XOR Byte Manipulation',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.DEBUGGING,
      type: 'Flag',
      points: 300,
      flag: 'HTG{xor_disassembly_master}',
      hints: [{ hintIndex: 1, content: 'XOR with the same key restores original bytes.', penaltyPoints: 40 }]
    },
    {
      levelNumber: 5,
      title: 'Instruction Patch Bypass',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.DEBUGGING,
      type: 'Flag',
      points: 300,
      flag: 'HTG{patched_jump_bypass}',
      hints: [{ hintIndex: 1, content: 'Invert JNZ (0x75) to JZ (0x74) opcode.', penaltyPoints: 40 }]
    },

    // Level 6
    {
      levelNumber: 6,
      title: 'Volatility Process Memory Dump',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.FORENSICS,
      type: 'Flag',
      points: 350,
      flag: 'HTG{volatility_mem_extracted}',
      hints: [{ hintIndex: 1, content: 'Extract strings from memory space of PID 1337.', penaltyPoints: 50 }]
    },

    // Level 7
    {
      levelNumber: 7,
      title: 'Ret2win Stack Control',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.PWN,
      type: 'Flag',
      points: 400,
      flag: 'HTG{ret2win_stack_control}',
      hints: [{ hintIndex: 1, content: 'Overwrite 64-bit saved return pointer.', penaltyPoints: 50 }]
    },

    // Level 8
    {
      levelNumber: 8,
      title: 'Reassembled TCP Stream',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.NETWORKING,
      type: 'Flag',
      points: 450,
      flag: 'HTG{tcp_stream_reassembled}',
      hints: [{ hintIndex: 1, content: 'Filter tcp.port == 8080 and Follow TCP Stream.', penaltyPoints: 60 }]
    },

    // Level 9
    {
      levelNumber: 9,
      title: 'Least Significant Bit Extraction',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.STEGANOGRAPHY,
      type: 'Flag',
      points: 500,
      flag: 'HTG{lsb_plane_extraction}',
      hints: [{ hintIndex: 1, content: 'Inspect LSB planes using zsteg or stegsolve.', penaltyPoints: 70 }]
    },

    // Level 10
    {
      levelNumber: 10,
      title: 'Citadel Master Flag Protocol',
      prompt: 'Analyze the organizer-provided challenge artifact and submit the recovered answer. Artifact publication requires organizer review.',
      category: CHALLENGE_TYPES.MASTER_FLAG,
      type: 'Flag',
      points: 600,
      flag: 'HTG{MASTER_FLAG_GRID_BREACHED_2026}',
      hints: [{ hintIndex: 1, content: 'Combine the primary grid tokens collected from previous sectors.', penaltyPoints: 100 }]
    }
  ];

  for (const qDef of questionPool) {
    const ch = challengeMap.get(qDef.levelNumber);
    if (!ch) continue;

    let existingQ = await Question.findOne({
      challengeId: ch._id,
      title: qDef.title
    }).select('+flag');

    if (!existingQ) {
      await Question.create({
        challengeId: ch._id,
        levelNumber: qDef.levelNumber,
        title: qDef.title,
        prompt: require('./participantData').safeContent(qDef.prompt, [qDef.flag]),
        category: qDef.category,
        type: qDef.type,
        points: qDef.points,
        flag: qDef.flag,
        hints: qDef.hints,
        status: 'Published',
        isActive: true
      });
      logger.info(`[Seed] Created Question: ${qDef.title} (Level ${qDef.levelNumber})`);
    } else {
      existingQ.flag = qDef.flag;
      existingQ.prompt = require('./participantData').safeContent(qDef.prompt, [qDef.flag]);
      existingQ.points = qDef.points;
      await existingQ.save();
    }
  }

  // 6. SEED PARTICIPANT USERS & TEAMS
  const seedTeamsData = [
    {
      name: 'Null Pointers',
      joinCode: 'HTG-7A9B1C',
      currentLevel: 8,
      totalScore: 1840,
      leader: { username: 'null_lead', email: 'lead@nullpointers.org', fullName: 'Aarav Sharma' },
      members: [
        { username: 'null_m1', email: 'm1@nullpointers.org', fullName: 'Kabir Verma' },
        { username: 'null_m2', email: 'm2@nullpointers.org', fullName: 'Ananya Sen' },
        { username: 'null_m3', email: 'm3@nullpointers.org', fullName: 'Riya Gupta' }
      ]
    },
    {
      name: 'Byte Bandits',
      joinCode: 'HTG-2C4D6E',
      currentLevel: 7,
      totalScore: 1690,
      leader: { username: 'byte_lead', email: 'lead@bytebandits.org', fullName: 'Rohan Mehra' },
      members: [
        { username: 'byte_m1', email: 'm1@bytebandits.org', fullName: 'Pooja Nair' },
        { username: 'byte_m2', email: 'm2@bytebandits.org', fullName: 'Aryan Joshi' }
      ]
    },
    {
      name: 'Stack Smashers',
      joinCode: 'HTG-3E5F7A',
      currentLevel: 7,
      totalScore: 1510,
      leader: { username: 'stack_lead', email: 'lead@stacksmashers.org', fullName: 'Vikram Singh' },
      members: [
        { username: 'stack_m1', email: 'm1@stacksmashers.org', fullName: 'Neha Patel' }
      ]
    },
    {
      name: 'Cyber Wolves',
      joinCode: 'HTG-8B0D2F',
      currentLevel: 6,
      totalScore: 1320,
      leader: { username: 'wolf_lead', email: 'lead@cyberwolves.org', fullName: 'Ishaan Bhatia' },
      members: [
        { username: 'wolf_m1', email: 'm1@cyberwolves.org', fullName: 'Tanvi Kapoor' }
      ]
    },
    {
      name: 'PacketRiders',
      joinCode: 'HTG-1038',
      currentLevel: 6,
      totalScore: 1280,
      leader: { username: 'hrx_runner', email: 'hrithik@example.com', fullName: 'Hrithik Roshan' },
      members: [
        { username: 'rider_m1', email: 'm1@packetriders.org', fullName: 'Aman Rawat' },
        { username: 'rider_m2', email: 'm2@packetriders.org', fullName: 'Simran Kaur' }
      ]
    }
  ];

  for (const teamDef of seedTeamsData) {
    let leader = await User.findOne({ email: teamDef.leader.email });
    if (!leader) {
      leader = await User.create({
        username: teamDef.leader.username,
        email: teamDef.leader.email,
        passwordHash: '12345',
        fullName: teamDef.leader.fullName,
        role: ROLES.TEAM_LEADER,
        college: "Tula's University",
        isActive: true
      });
      logger.info(`[Seed] Created User: ${leader.username} (${leader.email})`);
    }

    const memberIds = [leader._id];
    for (const memDef of teamDef.members) {
      let member = await User.findOne({ email: memDef.email });
      if (!member) {
        member = await User.create({
          username: memDef.username,
          email: memDef.email,
          passwordHash: '12345',
          fullName: memDef.fullName,
          role: ROLES.TEAM_MEMBER,
          college: "Tula's University",
          isActive: true
        });
        logger.info(`[Seed] Created User: ${member.username} (${member.email})`);
      }
      memberIds.push(member._id);
    }

    let team = await Team.findOne({ name: teamDef.name });
    if (!team) {
      team = await Team.create({
        name: teamDef.name,
        joinCode: teamDef.joinCode,
        leaderId: leader._id,
        members: memberIds,
        currentLevel: teamDef.currentLevel,
        totalScore: teamDef.totalScore,
        lastSolveTimestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000))
      });
      logger.info('[Seed] Created development team');
    } else {
      team.currentLevel = teamDef.currentLevel;
      team.totalScore = teamDef.totalScore;
      team.members = memberIds;
      await team.save();
    }

    // Assign team to users
    await User.updateMany({ _id: { $in: memberIds } }, { teamId: team._id });

    // Ensure Score record exists
    await Score.findOneAndUpdate(
      { teamId: team._id },
      {
        teamId: team._id,
        currentScore: team.totalScore,
        solvedLevelsCount: team.currentLevel - 1,
        lastSolveTimestamp: team.lastSolveTimestamp
      },
      { upsert: true }
    );
  }

  // 7. SECURITY AUDIT LOG SEEDING (SAMPLE AUDIT ENTRIES)
  const existingLogCount = await SecurityLog.countDocuments();
  if (existingLogCount === 0) {
    await SecurityLog.create([
      {
        eventId: 'EVT-9F21A',
        severity: 'CRITICAL',
        category: 'AUTHENTICATION',
        event: 'Repeated failed admin login attempts',
        actor: 'unknown@192.168.1.84',
        target: 'Admin portal',
        source: '192.168.1.84',
        detail: 'Six failed sign-in attempts detected within 3 minutes.',
        status: 'FLAGGED'
      },
      {
        eventId: 'EVT-9F219',
        severity: 'WARNING',
        category: 'RATE LIMIT',
        event: 'Submission rate limit triggered',
        actor: 'team_4821',
        target: 'POST /api/v1/submissions/submit',
        source: '10.0.4.28',
        detail: 'Request rate exceeded 10 attempts per minute threshold.',
        status: 'REVIEW'
      },
      {
        eventId: 'EVT-9F218',
        severity: 'INFO',
        category: 'CHECKPOINT',
        event: 'Checkpoint token validated',
        actor: 'team_1038',
        target: 'QR checkpoint 04',
        source: '10.0.2.17',
        detail: 'Eligible team passed checkpoint access validation.',
        status: 'REVIEWED'
      }
    ]);
    logger.info('[Seed] Populated sample Security Logs');
  }

  logger.info('====================================================');
  logger.info('  DATABASE SEEDING COMPLETED SUCCESSFULLY!          ');
  logger.info('====================================================');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((_err) => {
      logger.error('Database seeding failed; inspect configuration without logging private data');
      process.exit(1);
    });
}

module.exports = seedDatabase;

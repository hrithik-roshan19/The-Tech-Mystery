const { it, before, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

if (!process.env.MONGOMS_SYSTEM_BINARY && process.platform === 'win32') {
  const fs = require('node:fs');
  const root = path.join(process.env.ProgramFiles || 'C:/Program Files', 'MongoDB', 'Server');
  if (fs.existsSync(root)) {
    for (const version of fs.readdirSync(root).sort().reverse()) {
      const binary = path.join(root, version, 'bin', 'mongod.exe');
      if (fs.existsSync(binary)) { process.env.MONGOMS_SYSTEM_BINARY = binary; break; }
    }
  }
}
if (process.env.MONGOMS_SYSTEM_BINARY) process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK = 'false';

const {
  User,
  Team,
  Challenge,
  Question,
  Checkpoint,
  TeamChallenge,
  EventConfig
} = require('../src/models');
const { EVENT_STATES } = require('../src/constants/eventStates');
const { eventFor } = require('../src/services/eligibility.service');
const checkpointController = require('../src/controllers/checkpoint.controller');
const adminController = require('../src/controllers/admin.controller');
const { generateCheckpointToken } = require('../src/utils/crypto');

describe('Event Lifecycle States & QR Checkpoint Verification Test Suite', () => {
  let replica;
  let uri;
  let testUser;
  let testTeam;
  let testCheckpoint;
  let testChallenge;
  let testQuestion;

  before(async () => {
    replica = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    uri = replica.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);

    // Setup base team, users, and checkpoint for scan testing
    testUser = await User.create({
      username: 'lifecycle_lead',
      email: 'lead@eventlifecycle.test',
      fullName: 'Lifecycle Leader',
      clerkUserId: 'user_lifecycle_lead_1',
      role: 'TEAM_LEADER',
      collegeRollNo: 'LC-001',
      isActive: true
    });

    const member2 = await User.create({
      username: 'lifecycle_member',
      email: 'member@eventlifecycle.test',
      fullName: 'Lifecycle Member',
      clerkUserId: 'user_lifecycle_member_2',
      role: 'TEAM_MEMBER',
      collegeRollNo: 'LC-002',
      isActive: true
    });

    testTeam = await Team.create({
      name: 'Lifecycle Pioneers',
      joinCode: 'LC-JOIN',
      leaderId: testUser._id,
      members: [testUser._id, member2._id],
      currentLevel: 1,
      totalScore: 0
    });

    testUser.teamId = testTeam._id;
    await testUser.save();
    member2.teamId = testTeam._id;
    await member2.save();

    testChallenge = await Challenge.create({
      title: 'Level 1 Challenge',
      description: 'First physical beacon on campus',
      category: 'Web Security',
      levelNumber: 1,
      points: 100,
      status: 'Published',
      isActive: true
    });

    testQuestion = await Question.create({
      title: 'Level 1 Question 1',
      prompt: 'Decrypt the grid cipher beacon',
      category: 'Web Security',
      levelNumber: 1,
      order: 1,
      flag: 'FLAG{LIFECYCLE_ACTIVE}',
      points: 100,
      status: 'Published',
      isActive: true,
      challengeId: testChallenge._id
    });

    testCheckpoint = await Checkpoint.create({
      checkpointCode: 'HTG-CP01',
      name: 'Checkpoint Alpha',
      locationDescription: 'Main Quadrangle',
      levelNumber: 1,
      status: 'Active',
      isActive: true,
      mode: 'Public QR',
      associatedChallengeId: testChallenge._id,
      qrToken: generateCheckpointToken('HTG-CP01', 1)
    });
  });

  after(async () => {
    await mongoose.disconnect();
    if (replica) await replica.stop();
  });

  beforeEach(async () => {
    await EventConfig.deleteMany({});
  });

  it('1. EventConfig.getSingleton enforces a single authoritative record and cleans duplicates', async () => {
    // Create first document
    const primary = await EventConfig.create({
      eventName: 'The Tech Mystery',
      state: 'LIVE'
    });

    // Directly insert a duplicate simulating legacy/concurrent race
    await EventConfig.collection.insertOne({
      eventName: 'Stray Duplicate Event',
      state: 'DRAFT',
      createdAt: new Date(Date.now() + 1000)
    });

    const countBefore = await EventConfig.countDocuments();
    assert.equal(countBefore, 2);

    const singleton = await EventConfig.getSingleton();
    assert.equal(String(singleton._id), String(primary._id));
    assert.equal(singleton.state, 'LIVE');

    const countAfter = await EventConfig.countDocuments();
    assert.equal(countAfter, 1, 'Duplicate EventConfig documents must be cleaned up to ensure authoritative state');
  });

  it('2. Scan verification succeeds when event state is LIVE', async () => {
    await EventConfig.create({
      state: 'LIVE',
      qrCheckpoints: true,
      maintenanceMode: false
    });

    const config = await eventFor('scan');
    assert.equal(config.state, 'LIVE');

    const req = {
      user: { userId: testUser._id, teamId: testTeam._id, role: 'TEAM_LEADER' },
      body: {
        checkpointCode: testCheckpoint.checkpointCode,
        token: testCheckpoint.qrToken
      }
    };
    let responseStatus = 200;
    let responsePayload = null;
    const res = {
      status(s) { responseStatus = s; return this; },
      json(d) { responsePayload = d; return this; }
    };

    await checkpointController.scanCheckpoint(req, res, () => {});
    assert.equal(responseStatus, 200);
    assert.equal(responsePayload.success, true);
    assert.equal(responsePayload.data.checkpoint.code, 'HTG-CP01');
    assert.equal(responsePayload.data.isLevelComplete, false);
  });

  it('3. Scan verification rejects with descriptive 403 when event state is REGISTRATION_OPEN', async () => {
    await EventConfig.create({
      state: 'REGISTRATION_OPEN',
      qrCheckpoints: true,
      maintenanceMode: false,
      registrationOpen: true
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /registration phase/i);
        assert.match(err.message, /when the event goes LIVE/i);
        return true;
      }
    );

    const req = {
      user: { userId: testUser._id, teamId: testTeam._id, role: 'TEAM_LEADER' },
      body: {
        checkpointCode: testCheckpoint.checkpointCode,
        token: testCheckpoint.qrToken
      }
    };
    let responseStatus = 200;
    let responsePayload = null;
    const res = {
      status(s) { responseStatus = s; return this; },
      json(d) { responsePayload = d; return this; }
    };

    await checkpointController.scanCheckpoint(req, res, () => {});
    assert.equal(responseStatus, 403);
    assert.equal(responsePayload.success, false);
    assert.match(responsePayload.message, /registration phase/i);
  });

  it('4. Scan verification rejects with descriptive 403 when event state is DRAFT', async () => {
    await EventConfig.create({
      state: 'DRAFT',
      qrCheckpoints: true,
      maintenanceMode: false
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /draft mode/i);
        return true;
      }
    );
  });

  it('5. Scan verification rejects with descriptive 403 when event state is PAUSED', async () => {
    await EventConfig.create({
      state: 'PAUSED',
      qrCheckpoints: true,
      maintenanceMode: false
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /paused by administrators/i);
        return true;
      }
    );
  });

  it('6. Scan verification rejects with descriptive 403 when event state is REGISTRATION_CLOSED', async () => {
    await EventConfig.create({
      state: 'REGISTRATION_CLOSED',
      qrCheckpoints: true,
      maintenanceMode: false,
      registrationOpen: false
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /registration is closed/i);
        return true;
      }
    );
  });

  it('7. Scan verification rejects with descriptive 403 when event state is CONCLUDED', async () => {
    await EventConfig.create({
      state: 'CONCLUDED',
      qrCheckpoints: true,
      maintenanceMode: false
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /event has concluded/i);
        return true;
      }
    );
  });

  it('8. Scan verification rejects with 403 when maintenanceMode is true', async () => {
    await EventConfig.create({
      state: 'LIVE',
      qrCheckpoints: true,
      maintenanceMode: true
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.equal(err.message, 'Event is unavailable or in maintenance mode');
        return true;
      }
    );
  });

  it('9. Scan verification rejects with 403 when startTime is in future or endTime in past', async () => {
    // Future start
    await EventConfig.create({
      state: 'LIVE',
      startTime: new Date(Date.now() + 60000),
      endTime: null
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /event has not started yet/i);
        return true;
      }
    );

    // Past end
    await EventConfig.updateOne({}, {
      startTime: null,
      endTime: new Date(Date.now() - 60000)
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /event has concluded/i);
        return true;
      }
    );
  });

  it('10. Scan verification rejects with 403 when qrCheckpoints is toggled off', async () => {
    await EventConfig.create({
      state: 'LIVE',
      qrCheckpoints: false,
      maintenanceMode: false
    });

    await assert.rejects(
      async () => await eventFor('scan'),
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.equal(err.message, 'QR checkpoints are disabled');
        return true;
      }
    );
  });

  it('11. Admin updateEventConfig normalizes aliases (status: "Live", isLive: true) to state: "LIVE"', async () => {
    await EventConfig.create({
      state: 'REGISTRATION_OPEN',
      qrCheckpoints: true
    });

    // Test 1: update using status: "Live"
    let req = {
      body: { status: 'Live' },
      user: { username: 'admin' }
    };
    let responseStatus = 200;
    let responsePayload = null;
    let res = {
      status(s) { responseStatus = s; return this; },
      json(d) { responsePayload = d; return this; }
    };

    await adminController.updateEventConfig(req, res, () => {});
    assert.equal(responseStatus, 200);
    assert.equal(responsePayload.data.config.state, 'LIVE');
    assert.equal(responsePayload.data.eventConfig.state, 'LIVE');

    // Confirm database record was actually updated to LIVE
    let updatedDb = await EventConfig.findOne();
    assert.equal(updatedDb.state, 'LIVE');

    // Test 2: update using isLive: false -> PAUSED
    req = {
      body: { isLive: false },
      user: { username: 'admin' }
    };
    await adminController.updateEventConfig(req, res, () => {});
    assert.equal(responsePayload.data.config.state, 'PAUSED');

    updatedDb = await EventConfig.findOne();
    assert.equal(updatedDb.state, 'PAUSED');

    // Test 3: update using isLive: true -> LIVE
    req = {
      body: { isLive: true },
      user: { username: 'admin' }
    };
    await adminController.updateEventConfig(req, res, () => {});
    assert.equal(responsePayload.data.config.state, 'LIVE');

    // Test 4: update using status: "Registration Open" -> REGISTRATION_OPEN
    req = {
      body: { status: 'Registration Open' },
      user: { username: 'admin' }
    };
    await adminController.updateEventConfig(req, res, () => {});
    assert.equal(responsePayload.data.config.state, 'REGISTRATION_OPEN');
  });

  it('12. End-to-end synchronization: Admin sets event LIVE, immediately unblocking QR checkpoint verification', async () => {
    // 1. Initial state is REGISTRATION_OPEN (simulating current production state)
    await EventConfig.create({
      state: 'REGISTRATION_OPEN',
      qrCheckpoints: true,
      registrationOpen: true
    });

    const participantReq = {
      user: { userId: testUser._id, teamId: testTeam._id, role: 'TEAM_LEADER' },
      body: {
        checkpointCode: testCheckpoint.checkpointCode,
        token: testCheckpoint.qrToken
      }
    };
    let pStatus = 200;
    let pPayload = null;
    const pRes = {
      status(s) { pStatus = s; return this; },
      json(d) { pPayload = d; return this; }
    };

    // Participant scan is rejected
    await checkpointController.scanCheckpoint(participantReq, pRes, () => {});
    assert.equal(pStatus, 403);
    assert.equal(pPayload.success, false);
    assert.match(pPayload.message, /registration phase/i);

    // 2. Admin opens Event Control and transitions event to LIVE
    const adminReq = {
      body: { state: 'LIVE' },
      user: { username: 'admin' }
    };
    let aStatus = 200;
    let aPayload = null;
    const aRes = {
      status(s) { aStatus = s; return this; },
      json(d) { aPayload = d; return this; }
    };

    await adminController.updateEventConfig(adminReq, aRes, () => {});
    assert.equal(aStatus, 200);
    assert.equal(aPayload.data.config.state, 'LIVE');

    // 3. Participant immediately retries scan -> succeeds with 200
    pStatus = 200;
    pPayload = null;
    await checkpointController.scanCheckpoint(participantReq, pRes, () => {});
    assert.equal(pStatus, 200);
    assert.equal(pPayload.success, true);
    assert.equal(pPayload.data.checkpoint.code, 'HTG-CP01');
  });
});

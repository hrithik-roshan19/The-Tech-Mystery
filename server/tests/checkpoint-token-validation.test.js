const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

if (!process.env.MONGOMS_SYSTEM_BINARY && process.platform === 'win32') {
  const root = path.join(process.env.ProgramFiles || 'C:/Program Files', 'MongoDB', 'Server');
  if (fs.existsSync(root)) {
    for (const version of fs.readdirSync(root).sort().reverse()) {
      const binary = path.join(root, version, 'bin', 'mongod.exe');
      if (fs.existsSync(binary)) { process.env.MONGOMS_SYSTEM_BINARY = binary; break; }
    }
  }
}
if (process.env.MONGOMS_SYSTEM_BINARY) process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK = 'false';

const config = require('../src/config/environment');
const { generateCheckpointToken, verifyCheckpointToken, decodeCheckpointToken } = require('../src/utils/crypto');
const checkpointService = require('../src/services/checkpoint.service');
const { Checkpoint, Challenge, Question, Team, TeamChallenge, Score, User, EventConfig } = require('../src/models');

describe('QR Checkpoint Token Validation & Physical Sticker Preservation', () => {
  describe('1. Cryptographic Unit Tests (verifyCheckpointToken)', () => {
    it('accepts valid, unexpired dynamic tokens without registeredToken option', () => {
      const token = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });
      const isValid = verifyCheckpointToken('HTG-CP01', 1, token);
      assert.equal(isValid, true, 'Unexpired signed token must be accepted');
    });

    it('rejects expired dynamic tokens when no matching registeredToken is provided', () => {
      const expiredToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 100
      });
      const isValid = verifyCheckpointToken('HTG-CP01', 1, expiredToken);
      assert.equal(isValid, false, 'Expired unanchored token must be strictly rejected');
    });

    it('rejects expired dynamic tokens when registeredToken does NOT match', () => {
      const expiredToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 200
      });
      const anotherToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 50
      });
      const isValid = verifyCheckpointToken('HTG-CP01', 1, expiredToken, {
        registeredToken: anotherToken
      });
      assert.equal(isValid, false, 'Expired token that does not match registered token must be rejected');
    });

    it('accepts expired tokens that match the registered physical checkpoint token', () => {
      // Simulates HTG-CP01 physical QR sticker generated days ago
      const printedStickerToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 86400 // Expired 24 hours ago
      });
      const isValid = verifyCheckpointToken('HTG-CP01', 1, printedStickerToken, {
        registeredToken: printedStickerToken
      });
      assert.equal(isValid, true, 'Physical sticker token registered in checkpoint must be accepted');
    });

    it('accepts expired registered token when registeredToken is passed as an array', () => {
      const printedStickerToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 86400
      });
      const otherToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 1000
      });
      const isValid = verifyCheckpointToken('HTG-CP01', 1, printedStickerToken, {
        registeredToken: [otherToken, printedStickerToken]
      });
      assert.equal(isValid, true, 'Registered token in array must be accepted');
    });

    it('rejects tampered HMAC signature on otherwise valid token', () => {
      const valid = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });
      const [payload, sig] = valid.split('.');
      const tamperedSig = sig.slice(0, -1) + (sig.endsWith('a') ? 'b' : 'a');
      const tamperedToken = `${payload}.${tamperedSig}`;

      assert.equal(verifyCheckpointToken('HTG-CP01', 1, tamperedToken), false);
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, tamperedToken, { registeredToken: valid }), false);
    });

    it('rejects tampered payload data', () => {
      const valid = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });
      const [, sig] = valid.split('.');
      // Tamper payload by crafting modified JSON
      const alteredPayload = Buffer.from(JSON.stringify({
        v: 1,
        code: 'HTG-CP01',
        level: 2, // Changed level
        team: '*',
        exp: Math.floor(Date.now() / 1000) + 3600
      })).toString('base64url');

      const tamperedToken = `${alteredPayload}.${sig}`;
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, tamperedToken), false);
    });

    it('rejects token when checkpoint code does not match', () => {
      const cp02Token = generateCheckpointToken('HTG-CP02', 2, {
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });
      // Try using CP02 token for CP01 verification
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, cp02Token), false);
      assert.equal(verifyCheckpointToken('HTG-CP01', 2, cp02Token), false);
    });

    it('rejects token when level number does not match', () => {
      const cpToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });
      assert.equal(verifyCheckpointToken('HTG-CP01', 2, cpToken), false);
    });

    it('rejects unsigned, malformed, and non-string inputs', () => {
      const invalidInputs = [
        null,
        undefined,
        '',
        '   ',
        12345,
        {},
        [],
        'not-a-token',
        'no_dot_at_all',
        'too.many.dots.here',
        'bad_payload.invalidhexsig!',
        'eyJ2IjoxfQ.tooshortsyntax'
      ];
      for (const input of invalidInputs) {
        assert.equal(verifyCheckpointToken('HTG-CP01', 1, input), false, `Should reject input: ${input}`);
      }
    });

    it('enforces team-bound restrictions', () => {
      const teamIdA = new mongoose.Types.ObjectId();
      const teamIdB = new mongoose.Types.ObjectId();

      const teamBoundToken = generateCheckpointToken('HTG-CP01', 1, {
        teamId: teamIdA,
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });

      // Valid team matches
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, teamBoundToken, { teamId: teamIdA }), true);
      // Mismatched team fails
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, teamBoundToken, { teamId: teamIdB }), false);
      // Public mode fails for team-bound token
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, teamBoundToken, { teamId: null }), false);

      // Public token fails when team-bound required
      const publicToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, publicToken, { teamId: teamIdA }), false);
    });

    it('enforces question ID (qid) bindings', () => {
      const qid1 = new mongoose.Types.ObjectId();
      const qid2 = new mongoose.Types.ObjectId();

      const qToken = generateCheckpointToken('HTG-CP01', 1, {
        qid: qid1,
        expiresAt: Math.floor(Date.now() / 1000) + 3600
      });

      assert.equal(verifyCheckpointToken('HTG-CP01', 1, qToken, { qid: qid1 }), true);
      assert.equal(verifyCheckpointToken('HTG-CP01', 1, qToken, { qid: qid2 }), false);
    });
  });

  describe('2. End-to-End Checkpoint Service Integration Tests', () => {
    let replica;
    let testTeam;
    let leaderUser;
    let memberUser;
    let challengeL1;
    let challengeL2;
    let checkpointL1;
    let checkpointL2;
    let questionL1;
    let physicalStickerTokenL1;

    before(async () => {
      replica = await MongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: 'wiredTiger' }
      });
      const uri = replica.getUri();
      process.env.MONGODB_URI = uri;
      await mongoose.disconnect();
      await mongoose.connect(uri);

      await EventConfig.create({
        eventName: 'The Tech Mystery',
        state: 'LIVE',
        totalLevels: 10,
        registrationOpen: true,
        minTeamSize: 2,
        maxTeamSize: 4
      });

      leaderUser = await User.create({
        username: 'team_leader_cp',
        email: 'leader_cp@tulas.edu.in',
        fullName: 'CP Leader',
        role: 'TEAM_LEADER',
        clerkUserId: 'user_leader_cp_1',
        passwordHash: '$2a$10$hashedparticipantpassword123456789'
      });

      memberUser = await User.create({
        username: 'team_member_cp',
        email: 'member_cp@tulas.edu.in',
        fullName: 'CP Member',
        role: 'TEAM_MEMBER',
        clerkUserId: 'user_member_cp_2',
        passwordHash: '$2a$10$hashedparticipantpassword123456789'
      });

      testTeam = await Team.create({
        name: 'Alpha Scanners',
        joinCode: 'SCNR01',
        leaderId: leaderUser._id,
        members: [leaderUser._id, memberUser._id],
        currentLevel: 1,
        totalScore: 0,
        isDisqualified: false,
        membersCount: 2
      });

      leaderUser.teamId = testTeam._id;
      await leaderUser.save();
      memberUser.teamId = testTeam._id;
      await memberUser.save();
      await Score.create({ teamId: testTeam._id });

      // Create Challenge Level 1 & 2
      challengeL1 = await Challenge.create({
        levelNumber: 1,
        title: 'Level 1 Challenge',
        description: 'First station',
        category: 'CRYPTOGRAPHY',
        difficulty: 'EASY',
        points: 100,
        requiresCheckpointScan: true,
        status: 'Published',
        isActive: true
      });

      challengeL2 = await Challenge.create({
        levelNumber: 2,
        title: 'Level 2 Challenge',
        description: 'Second station',
        category: 'Web',
        difficulty: 'MEDIUM',
        points: 100,
        requiresCheckpointScan: true,
        status: 'Published',
        isActive: true
      });

      // Checkpoint 1 with an EXPIRED token (simulating HTG-CP01 production situation)
      physicalStickerTokenL1 = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 72000 // Expired 20 hours ago
      });

      checkpointL1 = await Checkpoint.create({
        levelNumber: 1,
        name: 'Main Auditorium Station',
        checkpointCode: 'HTG-CP01',
        locationDescription: 'Auditorium Entrance',
        associatedChallengeId: challengeL1._id,
        status: 'Active',
        isActive: true,
        mode: 'Public QR',
        qrToken: physicalStickerTokenL1,
        qrScanUrl: `https://the-tech-mystery.vercel.app/checkpoint/scan?code=HTG-CP01&token=${physicalStickerTokenL1}`
      });
      challengeL1.checkpointId = checkpointL1._id;
      await challengeL1.save();

      // Checkpoint 2 with a fresh token
      const cp02Token = generateCheckpointToken('HTG-CP02', 2, {
        expiresAt: Math.floor(Date.now() / 1000) + 86400
      });
      checkpointL2 = await Checkpoint.create({
        levelNumber: 2,
        name: 'Library Station',
        checkpointCode: 'HTG-CP02',
        locationDescription: 'Library Quad',
        associatedChallengeId: challengeL2._id,
        status: 'Active',
        isActive: true,
        mode: 'Public QR',
        qrToken: cp02Token,
        qrScanUrl: `https://the-tech-mystery.vercel.app/checkpoint/scan?code=HTG-CP02&token=${cp02Token}`
      });
      challengeL2.checkpointId = checkpointL2._id;
      await challengeL2.save();

      // Question for Level 1
      questionL1 = await Question.create({
        challengeId: challengeL1._id,
        levelNumber: 1,
        order: 1,
        checkpointId: checkpointL1._id,
        title: 'L1 Question 1',
        prompt: 'Solve the cipher',
        category: 'CRYPTOGRAPHY',
        difficulty: 'EASY',
        type: 'Multiple Choice',
        points: 100,
        status: 'Published',
        isActive: true,
        flag: 'CORRECT_FLAG',
        options: ['Option A', 'CORRECT_FLAG', 'Option C', 'Option D']
      });
    });

    after(async () => {
      await mongoose.disconnect();
      if (replica) await replica.stop();
    });

    it('scans physical QR sticker with expired exp but registered qrToken successfully', async () => {
      const scanResult = await checkpointService.processScan({
        checkpointCode: 'HTG-CP01',
        token: physicalStickerTokenL1,
        teamId: testTeam._id,
        userId: leaderUser._id,
        questionId: null
      });

      assert.equal(scanResult.teamChallenge.checkpointScanned, true);
      assert.equal(scanResult.teamChallenge.status, 'UNLOCKED');
      assert.equal(scanResult.checkpoint.code, 'HTG-CP01');
      assert.equal(scanResult.alreadyScanned, false);

      const teamChallenge = await TeamChallenge.findOne({ teamId: testTeam._id, levelNumber: 1 });
      assert.equal(teamChallenge.checkpointScanned, true);

      const cp = await Checkpoint.findById(checkpointL1._id);
      assert.equal(cp.scanCount, 1);
      assert.ok(cp.lastScanAt);

      // Verify scanning does not award points
      const teamDoc = await Team.findById(testTeam._id);
      assert.equal(teamDoc.totalScore, 0);
    });

    it('rejects an expired token that does NOT match the registered checkpoint token', async () => {
      const fakeExpiredToken = generateCheckpointToken('HTG-CP01', 1, {
        expiresAt: Math.floor(Date.now() / 1000) - 3600
      });

      await assert.rejects(
        checkpointService.processScan({
          checkpointCode: 'HTG-CP01',
          token: fakeExpiredToken,
          teamId: testTeam._id,
          userId: leaderUser._id
        }),
        /A valid, unexpired signed checkpoint token is required/
      );
    });

    it('rejects a tampered token during scan', async () => {
      const [payload, sig] = physicalStickerTokenL1.split('.');
      const tampered = `${payload}.${sig.slice(0, -2)}00`;

      await assert.rejects(
        checkpointService.processScan({
          checkpointCode: 'HTG-CP01',
          token: tampered,
          teamId: testTeam._id,
          userId: leaderUser._id
        }),
        /A valid, unexpired signed checkpoint token is required/
      );
    });

    it('rejects an unsigned or malformed token string during scan', async () => {
      await assert.rejects(
        checkpointService.processScan({
          checkpointCode: 'HTG-CP01',
          token: 'invalid_malformed_token_string',
          teamId: testTeam._id,
          userId: leaderUser._id
        }),
        /A valid, unexpired signed checkpoint token is required/
      );
    });

    it('rejects scanning Level 2 checkpoint when Level 1 is not yet cleared', async () => {
      // Team is on Level 1, attempting to scan Level 2 checkpoint
      const cp2 = await Checkpoint.findById(checkpointL2._id);
      await assert.rejects(
        checkpointService.processScan({
          checkpointCode: 'HTG-CP02',
          token: cp2.qrToken,
          teamId: testTeam._id,
          userId: leaderUser._id
        }),
        /Checkpoint locked. Solve prior levels first./
      );
    });

    it('rejects token of Checkpoint 2 when submitted to Checkpoint 1', async () => {
      const cp2 = await Checkpoint.findById(checkpointL2._id);
      await assert.rejects(
        checkpointService.processScan({
          checkpointCode: 'HTG-CP01',
          token: cp2.qrToken,
          teamId: testTeam._id,
          userId: leaderUser._id
        }),
        /A valid, unexpired signed checkpoint token is required/
      );
    });
  });
});

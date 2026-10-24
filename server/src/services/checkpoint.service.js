const { safeContent, privateAnswers } = require('../utils/participantData');
const { Checkpoint, Challenge } = require('../models');
const { verifyCheckpointToken } = require('../utils/crypto');
const assignment = require('./questionAssignment.service');
const { eventFor, teamFor } = require('./eligibility.service');
const transaction = require('../utils/transaction');

module.exports = {
  processScan({ checkpointCode, token, teamId, userId, questionId }) {
    return transaction(async () => {
      if (typeof checkpointCode !== 'string' || !checkpointCode.trim()) throw new Error('A valid checkpoint code is required');
      const config = await eventFor('scan');
      const team = await teamFor(teamId, userId, config);
      const checkpoint = await Checkpoint.findOne({ checkpointCode: checkpointCode.trim().toUpperCase(), isActive: true, status: 'Active' });
      if (!checkpoint) throw new Error('Checkpoint is unavailable');
      const bound = checkpoint.mode === 'Team-bound QR';
      if (bound && (!checkpoint.boundTeamId || String(checkpoint.boundTeamId) !== String(team._id))) {
        throw new Error('Checkpoint is not assigned to this team');
      }

      if (!verifyCheckpointToken(checkpoint.checkpointCode, checkpoint.levelNumber, token,
        { teamId: bound ? checkpoint.boundTeamId : null, qid: questionId })) {
        throw new Error('A valid, unexpired signed checkpoint token is required');
      }

      const challenge = await Challenge.findOne({
        _id: checkpoint.associatedChallengeId,
        levelNumber: checkpoint.levelNumber,
        isActive: true,
        status: 'Published'
      });
      if (!challenge) throw new Error('Checkpoint challenge is not published or active');
      if (team.currentLevel < checkpoint.levelNumber) throw new Error('Checkpoint locked. Solve prior levels first.');
      if (team.currentLevel > checkpoint.levelNumber) throw new Error('This level has already been cleared by your team.');

      const { teamChallenge, question, isNewAssignment } = await assignment.getOrAssignQuestion(teamId, checkpoint.levelNumber, questionId);
      const alreadyScanned = teamChallenge.checkpointScanned;
      if (!alreadyScanned) {
        teamChallenge.checkpointScanned = true;
        teamChallenge.checkpointScannedAt = new Date();
        if (teamChallenge.status !== 'SOLVED') teamChallenge.status = 'UNLOCKED';
        teamChallenge.unlockedAt = teamChallenge.unlockedAt || new Date();
        await teamChallenge.save();
        await Checkpoint.updateOne({ _id: checkpoint._id }, { $inc: { scanCount: 1 }, $set: { lastScanAt: new Date() } });
      }
      const answers = await privateAnswers();
      return {
        checkpoint: {
          _id: checkpoint._id,
          name: safeContent(checkpoint.name, answers),
          levelNumber: checkpoint.levelNumber,
          locationDescription: safeContent(checkpoint.locationDescription, answers),
          code: safeContent(checkpoint.checkpointCode, answers)
        },
        teamChallenge: {
          status: teamChallenge.status,
          levelNumber: teamChallenge.levelNumber,
          checkpointScanned: true,
          unlockedAt: teamChallenge.unlockedAt
        },
        question,
        alreadyScanned,
        isNewAssignment
      };
    });
  }
};

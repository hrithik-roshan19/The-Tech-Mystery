const { Checkpoint, Team, TeamChallenge } = require('../models');
const { verifyCheckpointToken } = require('../utils/crypto');
const questionAssignmentService = require('./questionAssignment.service');
const logger = require('../utils/logger');

/**
 * Checkpoint Service
 * Validates physical QR scans, unlocks levels, and coordinates persistent question assignment.
 */
class CheckpointService {
  /**
   * Processes a physical checkpoint scan from a participant.
   *
   * @param {object} params
   * @param {string} params.checkpointCode - e.g. "CP-A7F92B"
   * @param {string} params.token - HMAC token generated for QR
   * @param {string} params.teamId - ID of logged-in user's team
   * @returns {Promise<object>} Status and assigned question details (without answers)
   */
  async processScan({ checkpointCode, token, teamId }) {
    // 1. Find checkpoint
    const checkpoint = await Checkpoint.findOne({
      checkpointCode: checkpointCode.toUpperCase(),
      isActive: true
    });

    if (!checkpoint) {
      throw new Error('Invalid or inactive checkpoint QR code');
    }

    // 2. Cryptographic token verification (if token verification active)
    if (token) {
      const isValid = verifyCheckpointToken(checkpoint.checkpointCode, checkpoint.levelNumber, token);
      if (!isValid) {
        throw new Error('Tampered or forged QR checkpoint token');
      }
    }

    // 3. Verify Team level eligibility
    const team = await Team.findById(teamId);
    if (!team) throw new Error('Team not found');

    if (team.isDisqualified) {
      throw new Error('Your team has been disqualified from participating');
    }

    // Is the team at or past this level?
    if (team.currentLevel < checkpoint.levelNumber) {
      throw new Error(
        `Checkpoint locked! Your team is currently on Level ${team.currentLevel}. Solve prior levels first.`
      );
    }

    // 4. Retrieve or assign team-specific question variation persistently
    const { teamChallenge, question, isNewAssignment } =
      await questionAssignmentService.getOrAssignQuestion(teamId, checkpoint.levelNumber);

    // 5. Unlock the TeamChallenge if it was locked behind checkpoint scan
    if (!teamChallenge.checkpointScanned) {
      teamChallenge.checkpointScanned = true;
      teamChallenge.checkpointScannedAt = new Date();
      teamChallenge.status = 'UNLOCKED';
      teamChallenge.unlockedAt = new Date();
      await teamChallenge.save();

      // Increment checkpoint physical scan metrics
      await Checkpoint.findByIdAndUpdate(checkpoint._id, { $inc: { scanCount: 1 } });
    }

    logger.info(
      `[Checkpoint] Team ${teamId} verified at Checkpoint ${checkpoint.checkpointCode} (Level ${checkpoint.levelNumber})`
    );

    return {
      checkpoint: {
        name: checkpoint.name,
        levelNumber: checkpoint.levelNumber,
        locationDescription: checkpoint.locationDescription
      },
      teamChallenge: {
        status: teamChallenge.status,
        levelNumber: teamChallenge.levelNumber,
        checkpointScanned: true,
        unlockedAt: teamChallenge.unlockedAt
      },
      question,
      isNewAssignment
    };
  }
}

module.exports = new CheckpointService();


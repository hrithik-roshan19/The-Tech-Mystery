const { participantQuestion } = require('../utils/participantData');
const { TeamChallenge, Question, Challenge, EventConfig } = require('../models');
const config = require('../config/environment');
const logger = require('../utils/logger');

/**
 * Question Assignment Service
 * Guarantees atomic First-Come-First-Served (FCFS) claim leases and
 * persistent question variation assignment.
 */
class QuestionAssignmentService {
  /**
   * Retrieves the assigned question for a team at a specific level or claims an available question.
   * Atomic FCFS claim lease: First team to scan/claim gets exclusive access until solve, forfeit, or expiration.
   *
   * NEVER returns the flag/answer field to callers!
   *
   * @param {string} teamId
   * @param {number} levelNumber
   * @param {string} [preferredQuestionId]
   * @returns {Promise<{ teamChallenge: object, question: object, isNewAssignment: boolean }>}
   */
  async getOrAssignQuestion(teamId, levelNumber, preferredQuestionId = null) {
    const activeChallenge = await Challenge.findOneAndUpdate(
      { levelNumber, status: 'Published', isActive: true },
      { $inc: { securityRevision: 1 } },
      { new: true }
    );
    if (!activeChallenge) throw new Error('Challenge is not published or active');

    const now = new Date();
    const eventConfig = await EventConfig.findOne();
    const timeoutMinutes = eventConfig?.questionClaimTimeoutMinutes || config.questionClaimTimeoutMinutes || 30;
    const expiresAt = new Date(now.getTime() + timeoutMinutes * 60 * 1000);

    // 1. Check if already persistently assigned to this team
    let existingAssignment = await TeamChallenge.findOne({ teamId, levelNumber })
      .populate('assignedQuestionId', '+flag')
      .populate('challengeId');

    if (existingAssignment) {
      const assignedQ = existingAssignment.assignedQuestionId;
      if (!assignedQ?.isActive || assignedQ.status !== 'Published' ||
          String(assignedQ.challengeId) !== String(activeChallenge._id)) {
        throw new Error('Assigned question is not published or active');
      }

      // Check if team is scanning a DIFFERENT question variation for this level
      if (preferredQuestionId && /^[0-9a-fA-F]{24}$/.test(String(preferredQuestionId)) &&
          String(assignedQ._id) !== String(preferredQuestionId)) {
        // Check if their existing assignment claim is still actively held by them
        const isExistingClaimActive = assignedQ.isClaimed &&
          String(assignedQ.claimedByTeamId) === String(teamId) &&
          (!assignedQ.claimExpiresAt || assignedQ.claimExpiresAt >= now) &&
          !assignedQ.isCompleted;

        if (isExistingClaimActive && existingAssignment.status !== 'SOLVED') {
          throw new Error('Your team already has an active question claimed for this level.');
        }

        // If existing claim expired or was released, fall through to claim the new preferredQuestionId
      } else {
        // Rescan / access of current assigned question
        if (assignedQ.isClaimed && String(assignedQ.claimedByTeamId) === String(teamId) && !assignedQ.isCompleted) {
          // Extend / refresh lease on self-rescan
          await Question.updateOne(
            { _id: assignedQ._id, isCompleted: false },
            { $set: { claimExpiresAt: expiresAt }, $inc: { securityRevision: 1 } }
          );
        } else {
          await Question.updateOne({ _id: assignedQ._id }, { $inc: { securityRevision: 1 } });
        }

        return {
          teamChallenge: await TeamChallenge.findById(existingAssignment._id),
          question: await participantQuestion(assignedQ),
          isNewAssignment: false
        };
      }
    }

    // 2. Fetch challenge level definition and question pool
    const pool = await Question.find({
      challengeId: activeChallenge._id,
      levelNumber,
      status: 'Published',
      isActive: true
    }).select('+flag');

    if (!pool || pool.length === 0) {
      throw new Error(`No published question variations available in pool for level ${levelNumber}`);
    }

    let targetVariation = null;
    if (preferredQuestionId && /^[0-9a-fA-F]{24}$/.test(String(preferredQuestionId))) {
      targetVariation = pool.find(q => String(q._id) === String(preferredQuestionId));
      if (!targetVariation) {
        throw new Error('Question variation is not published, inactive, or unavailable');
      }
    } else {
      // Find candidate questions in pool that are not completed and either unclaimed, expired, or already claimed by this team
      const availableCandidates = pool.filter(q =>
        !q.isCompleted &&
        (!q.isClaimed || (q.claimExpiresAt && q.claimExpiresAt < now) || String(q.claimedByTeamId) === String(teamId))
      );
      if (availableCandidates.length === 0) {
        throw new Error(`All question variations for level ${levelNumber} are currently claimed or completed`);
      }
      targetVariation = await this.selectBalancedVariation(availableCandidates, levelNumber);
    }

    // Check if target variation is already completed
    if (targetVariation.isCompleted) {
      throw new Error('This question has already been completed by another team.');
    }

    // Check if target variation is currently actively claimed by another team
    const isClaimedByOther = targetVariation.isClaimed &&
      String(targetVariation.claimedByTeamId) !== String(teamId) &&
      (!targetVariation.claimExpiresAt || targetVariation.claimExpiresAt >= now);

    if (isClaimedByOther) {
      throw new Error('This question has already been claimed by another team.');
    }

    // 3. ATOMIC FCFS CLAIM
    const claimedVariation = await Question.findOneAndUpdate(
      {
        _id: targetVariation._id,
        isCompleted: false,
        $or: [
          { isClaimed: false },
          { claimExpiresAt: { $lt: now } },
          { claimedByTeamId: teamId }
        ]
      },
      {
        $set: {
          isClaimed: true,
          claimedByTeamId: teamId,
          claimedAt: (targetVariation.isClaimed && String(targetVariation.claimedByTeamId) === String(teamId)) ? targetVariation.claimedAt : now,
          claimExpiresAt: expiresAt
        },
        $inc: { securityRevision: 1 }
      },
      { new: true }
    ).select('+flag');

    if (!claimedVariation) {
      const checkQ = await Question.findById(targetVariation._id);
      if (checkQ?.isCompleted) {
        throw new Error('This question has already been completed by another team.');
      }
      throw new Error('This question has already been claimed by another team.');
    }

    // 4. Persist assignment atomically
    try {
      if (existingAssignment) {
        existingAssignment.assignedQuestionId = claimedVariation._id;
        if (existingAssignment.status !== 'SOLVED') {
          existingAssignment.status = activeChallenge.requiresCheckpointScan ? 'LOCKED' : 'UNLOCKED';
        }
        await existingAssignment.save();

        logger.info(
          `[Assignment] Re-assigned Question ${claimedVariation._id} (Level ${levelNumber}) to Team ${teamId}`
        );

        return {
          teamChallenge: existingAssignment,
          question: await participantQuestion(claimedVariation),
          isNewAssignment: true
        };
      }

      const newTeamChallenge = await TeamChallenge.create({
        teamId,
        challengeId: activeChallenge._id,
        levelNumber,
        assignedQuestionId: claimedVariation._id,
        status: activeChallenge.requiresCheckpointScan ? 'LOCKED' : 'UNLOCKED',
        checkpointScanned: !activeChallenge.requiresCheckpointScan,
        unlockedAt: activeChallenge.requiresCheckpointScan ? null : now
      });

      logger.info(
        `[Assignment] Assigned Question ${claimedVariation._id} (Level ${levelNumber}) to Team ${teamId}`
      );

      return {
        teamChallenge: newTeamChallenge,
        question: await participantQuestion(claimedVariation),
        isNewAssignment: true
      };
    } catch (err) {
      if (err.code === 11000) {
        logger.debug(`[Assignment] Concurrent assignment caught by unique index for team ${teamId}, level ${levelNumber}`);
        const raceWinner = await TeamChallenge.findOne({ teamId, levelNumber })
          .populate('assignedQuestionId', '+flag')
          .populate('challengeId');
        return {
          teamChallenge: await TeamChallenge.findById(raceWinner._id),
          question: await participantQuestion(raceWinner.assignedQuestionId),
          isNewAssignment: false
        };
      }
      throw err;
    }
  }

  /**
   * Selects the question variation with the fewest assignments across teams to balance distribution.
   *
   * @param {Array} pool - Available questions in level
   * @param {number} levelNumber
   * @returns {Promise<object>} Selected Question document
   */
  async selectBalancedVariation(pool, levelNumber) {
    if (pool.length === 1) return pool[0];

    // Count existing team assignments per question in this level
    const counts = await TeamChallenge.aggregate([
      { $match: { levelNumber } },
      { $group: { _id: '$assignedQuestionId', count: { $sum: 1 } } }
    ]);

    const countMap = new Map();
    counts.forEach((c) => countMap.set(c._id.toString(), c.count));

    // Sort pool by least assigned count
    const sortedPool = [...pool].sort((a, b) => {
      const countA = countMap.get(a._id.toString()) || 0;
      const countB = countMap.get(b._id.toString()) || 0;
      return countA - countB;
    });

    const lowestCount = countMap.get(sortedPool[0]._id.toString()) || 0;
    const candidates = sortedPool.filter(
      (q) => (countMap.get(q._id.toString()) || 0) === lowestCount
    );

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
}

module.exports = new QuestionAssignmentService();

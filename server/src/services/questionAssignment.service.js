const { participantQuestion } = require('../utils/participantData');
const { TeamChallenge, Question, Challenge, EventConfig } = require('../models');
const config = require('../config/environment');
const logger = require('../utils/logger');

/**
 * Question Assignment Service
 * Guarantees persistent team-specific question assignments and prevents
 * multiple teams from receiving the same question when uniqueness is required.
 */
class QuestionAssignmentService {
  /**
   * Retrieves the assigned question for a team at a specific level or claims an available question.
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

      // Check if team is attempting to scan a DIFFERENT question variation for this level
      if (preferredQuestionId && /^[0-9a-fA-F]{24}$/.test(String(preferredQuestionId)) &&
          String(assignedQ._id) !== String(preferredQuestionId)) {
        const isExistingClaimActive = (assignedQ.isClaimed || assignedQ.isAssigned) &&
          (String(assignedQ.claimedByTeamId) === String(teamId) || String(assignedQ.assignedTeamId) === String(teamId)) &&
          (!assignedQ.claimExpiresAt || assignedQ.claimExpiresAt >= now) &&
          !assignedQ.isCompleted;

        if (isExistingClaimActive && existingAssignment.status !== 'SOLVED') {
          throw new Error('Your team already has an active question claimed for this level.');
        }
      } else {
        // Rescan / access of current assigned question (stable idempotency)
        if (assignedQ.isClaimed && String(assignedQ.claimedByTeamId) === String(teamId) && !assignedQ.isCompleted) {
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
      throw new Error(`No published questions available in pool for level ${levelNumber}`);
    }

    // Identify questions already assigned to ANY team in this level
    const existingLevelAssignments = await TeamChallenge.find({ levelNumber }).distinct('assignedQuestionId');
    const assignedQuestionIdSet = new Set(existingLevelAssignments.map(id => String(id)));

    let claimedVariation = null;

    if (preferredQuestionId && /^[0-9a-fA-F]{24}$/.test(String(preferredQuestionId))) {
      const targetVariation = pool.find(q => String(q._id) === String(preferredQuestionId));
      if (!targetVariation) {
        throw new Error('Question variation is not published, inactive, or unavailable');
      }

      if (targetVariation.isCompleted) {
        throw new Error('This question has already been completed by another team.');
      }

      const isClaimedByOther = (targetVariation.isClaimed || targetVariation.isAssigned) &&
        String(targetVariation.claimedByTeamId || targetVariation.assignedTeamId) !== String(teamId) &&
        (!targetVariation.claimExpiresAt || targetVariation.claimExpiresAt >= now);

      if (isClaimedByOther) {
        throw new Error('This question has already been claimed by another team.');
      }

      claimedVariation = await Question.findOneAndUpdate(
        {
          _id: targetVariation._id,
          isCompleted: false,
          $or: [
            { isClaimed: false, isAssigned: false },
            { claimExpiresAt: { $lt: now } },
            { claimedByTeamId: teamId },
            { assignedTeamId: teamId }
          ]
        },
        {
          $set: {
            isClaimed: true,
            claimedByTeamId: teamId,
            claimedAt: (targetVariation.isClaimed && String(targetVariation.claimedByTeamId) === String(teamId)) ? targetVariation.claimedAt : now,
            claimExpiresAt: expiresAt,
            isAssigned: true,
            assignedTeamId: teamId,
            assignedAt: now
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
    } else {
      // General Level QR Scan: Select an unassigned question from the level bank
      const availableCandidates = pool.filter(q =>
        !q.isCompleted &&
        !assignedQuestionIdSet.has(String(q._id)) &&
        (!q.isClaimed || (q.claimExpiresAt && q.claimExpiresAt < now) || String(q.claimedByTeamId) === String(teamId)) &&
        (!q.isAssigned || String(q.assignedTeamId) === String(teamId))
      );

      if (availableCandidates.length === 0) {
        throw new Error('No unique questions are currently available for this level');
      }

      // Shuffle candidates to balance random distribution
      const candidateList = [...availableCandidates].sort(() => Math.random() - 0.5);

      for (const candidate of candidateList) {
        claimedVariation = await Question.findOneAndUpdate(
          {
            _id: candidate._id,
            isCompleted: false,
            $or: [
              { isClaimed: false, isAssigned: false },
              { claimExpiresAt: { $lt: now } },
              { claimedByTeamId: teamId },
              { assignedTeamId: teamId }
            ]
          },
          {
            $set: {
              isClaimed: true,
              claimedByTeamId: teamId,
              claimedAt: (candidate.isClaimed && String(candidate.claimedByTeamId) === String(teamId)) ? candidate.claimedAt : now,
              claimExpiresAt: expiresAt,
              isAssigned: true,
              assignedTeamId: teamId,
              assignedAt: now
            },
            $inc: { securityRevision: 1 }
          },
          { new: true }
        ).select('+flag');

        if (claimedVariation) break;
      }

      if (!claimedVariation) {
        throw new Error('No unique questions are currently available for this level');
      }
    }

    // 4. Persist assignment atomically in TeamChallenge
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
        // Revert reservation for the unneeded variation
        await Question.updateOne(
          { _id: claimedVariation._id, assignedTeamId: teamId },
          { $set: { isAssigned: false, assignedTeamId: null, isClaimed: false, claimedByTeamId: null } }
        );
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

  /**
   * Helper alias to assign a unique question for a team at a specific level.
   *
   * @param {string} teamId
   * @param {number} levelNumber
   * @returns {Promise<{ questionId: object, question: object, teamChallenge: object, isNewAssignment: boolean }>}
   */
  async assignQuestionForTeamAndLevel(teamId, levelNumber) {
    const res = await this.getOrAssignQuestion(teamId, levelNumber);
    const qId = res.teamChallenge.assignedQuestionId?._id || res.teamChallenge.assignedQuestionId;
    return {
      questionId: qId,
      question: res.question,
      teamChallenge: res.teamChallenge,
      isNewAssignment: res.isNewAssignment
    };
  }
}

module.exports = new QuestionAssignmentService();

const checkpointService = require('../services/checkpoint.service');
const { decodeCheckpointToken } = require('../utils/crypto');
const { success, badRequest, notFound } = require('../utils/apiResponse');

/**
 * Checkpoint Controller
 * Handles physical QR checkpoint scanning and retrieval.
 */
class CheckpointController {
  async scanCheckpoint(req, res, next) {
    try {
      let questionId = req.params?.questionId || req.body?.questionId || req.body?.qid || null;
      const token = req.body?.token;
      const teamId = req.user.teamId;

      if (!questionId && token) {
        const decoded = decodeCheckpointToken(token);
        if (decoded?.qid) {
          questionId = decoded.qid;
        }
      }

      let checkpointCode = req.body?.checkpointCode || req.body?.code;
      const cpId = req.params?.checkpointId || req.body?.checkpointId;

      if (!checkpointCode && cpId) {
        const { Checkpoint } = require('../models');
        if (/^[0-9a-fA-F]{24}$/.test(cpId)) {
          const cp = await Checkpoint.findById(cpId);
          if (cp?.checkpointCode) checkpointCode = cp.checkpointCode;
        } else {
          checkpointCode = cpId;
        }
      }

      if (!checkpointCode && questionId) {
        const { Question } = require('../models');
        const q = await Question.findById(questionId);
        if (q?.checkpointCode) checkpointCode = q.checkpointCode;
      }

      if (!checkpointCode) {
        return badRequest(res, 'A checkpoint code or checkpoint ID is required');
      }

      const result = await checkpointService.processScan({
        checkpointCode,
        token,
        teamId,
        userId: req.user.userId,
        questionId
      });

      const message = result.alreadyScanned
        ? `Checkpoint already verified: ${result.checkpoint.name}. Level ${result.checkpoint.levelNumber} is active!`
        : `Checkpoint Verified: ${result.checkpoint.name}. Level ${result.checkpoint.levelNumber} unlocked!`;

      return success(
        res,
        result,
        message
      );
    } catch (error) {
      return res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
  }

  async getCheckpointDetails(req, res, next) {
    try {
      const cpId = req.params?.checkpointId;
      const { Checkpoint } = require('../models');
      let cp = null;
      if (/^[0-9a-fA-F]{24}$/.test(cpId)) {
        cp = await Checkpoint.findById(cpId).populate('associatedChallengeId', 'title levelNumber description points status');
      } else {
        cp = await Checkpoint.findOne({ checkpointCode: String(cpId).toUpperCase() }).populate('associatedChallengeId', 'title levelNumber description points status');
      }
      if (!cp) return notFound(res, 'Checkpoint not found');

      let challengeData = cp.associatedChallengeId;
      if (!challengeData) {
        const { Challenge } = require('../models');
        challengeData = await Challenge.findOne({
          levelNumber: cp.levelNumber,
          isActive: true,
          status: 'Published'
        }).select('title levelNumber description points status');
      }

      return success(res, {
        checkpointId: cp._id,
        name: cp.name,
        code: cp.checkpointCode,
        levelNumber: cp.levelNumber,
        locationDescription: cp.locationDescription,
        status: cp.status,
        mode: cp.mode,
        token: cp.qrToken,
        qrScanUrl: cp.qrScanUrl,
        challenge: challengeData
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new CheckpointController();

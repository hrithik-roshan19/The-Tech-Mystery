const checkpointService = require('../services/checkpoint.service');
const { decodeCheckpointToken } = require('../utils/crypto');
const { success, badRequest } = require('../utils/apiResponse');

/**
 * Checkpoint Controller
 * Handles physical QR checkpoint scanning.
 */
class CheckpointController {
  async scanCheckpoint(req, res, next) {
    try {
      let questionId = req.params?.questionId || req.body.questionId || req.body.qid || null;
      const token = req.body.token;
      const teamId = req.user.teamId;

      if (!questionId && token) {
        const decoded = decodeCheckpointToken(token);
        if (decoded?.qid) {
          questionId = decoded.qid;
        }
      }

      let checkpointCode = req.body.checkpointCode || req.body.code;
      if (!checkpointCode && questionId) {
        const { Question } = require('../models');
        const q = await Question.findById(questionId);
        if (q?.checkpointCode) checkpointCode = q.checkpointCode;
      }

      if (!checkpointCode) {
        return badRequest(res, 'A checkpoint code is required');
      }

      const result = await checkpointService.processScan({
        checkpointCode,
        token,
        teamId,
        userId: req.user.userId,
        questionId
      });

      const message = result.alreadyScanned
        ? `Checkpoint already verified: ${result.checkpoint.name}. Level ${result.checkpoint.levelNumber} is unlocked!`
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
}

module.exports = new CheckpointController();

const checkpointService = require('../services/checkpoint.service');
const { success, badRequest } = require('../utils/apiResponse');

/**
 * Checkpoint Controller
 * Handles physical QR checkpoint scanning.
 */
class CheckpointController {
  async scanCheckpoint(req, res, next) {
    try {
      const { code, token } = req.body;
      const teamId = req.user.teamId;

      const result = await checkpointService.processScan({
        checkpointCode: code,
        token,
        teamId
      });

      return success(
        res,
        result,
        `Checkpoint Verified: ${result.checkpoint.name}. Level ${result.checkpoint.levelNumber} unlocked!`
      );
    } catch (error) {
      return badRequest(res, error.message);
    }
  }
}

module.exports = new CheckpointController();


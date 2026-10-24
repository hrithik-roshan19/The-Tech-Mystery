const scoring = require('../services/scoring.service');
const { success, badRequest } = require('../utils/apiResponse');

module.exports = {
  async submitFlag(req, res) {
    try {
      const submittedFlag = req.body.flag !== undefined ? req.body.flag : req.body.answer;
      const questionId = req.body.questionId || req.body.qid || null;

      const result = await scoring.submit({
        teamId: req.user.teamId,
        userId: req.user.userId,
        levelNumber: Number(req.body.levelNumber),
        flag: submittedFlag,
        questionId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      if (!result.isCorrect) {
        return badRequest(res, result.message || 'Incorrect answer', result);
      }
      return success(res, result, result.message || 'Challenge solved');
    } catch (err) {
      return res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }
  }
};

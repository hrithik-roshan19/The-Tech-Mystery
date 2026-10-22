const scoring = require('../services/scoring.service');
const { success, badRequest } = require('../utils/apiResponse');
module.exports = {
  async submitFlag(req, res) {
    try {
      const result = await scoring.submit({ teamId: req.user.teamId, userId: req.user.userId,
        levelNumber: Number(req.body.levelNumber), flag: req.body.flag,
        ipAddress: req.ip, userAgent: req.headers['user-agent'] });
      if (!result.isCorrect) return badRequest(res, 'Incorrect answer', result);
      return success(res, result, 'Challenge solved');
    } catch (err) { return res.status(err.statusCode || 400).json({ success: false, message: err.message }); }
  }
};

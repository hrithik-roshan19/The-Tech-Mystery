const { TeamChallenge, Question, Challenge, Submission, Team } = require('../models');
const scoringService = require('../services/scoring.service');
const { safeFlagCompare } = require('../utils/crypto');
const { success, badRequest, forbidden, notFound } = require('../utils/apiResponse');
const { SUBMISSION_STATUS } = require('../constants/submissionStatus');
const logger = require('../utils/logger');

/**
 * Submission Controller
 * Validates submitted flags securely server-side.
 */
class SubmissionController {
  async submitFlag(req, res, next) {
    try {
      const { levelNumber, flag } = req.body;
      const teamId = req.user.teamId;
      const userId = req.user.userId;

      // 1. Validate team state
      const team = await Team.findById(teamId);
      if (!team) return notFound(res, 'Team not found');
      if (team.isDisqualified) return forbidden(res, 'Disqualified team cannot submit answers');

      if (team.currentLevel !== levelNumber) {
        return badRequest(
          res,
          `Cannot submit for Level ${levelNumber}. Your team is currently on Level ${team.currentLevel}`
        );
      }

      // 2. Fetch TeamChallenge & Question (including secret flag)
      const teamChallenge = await TeamChallenge.findOne({ teamId, levelNumber });
      if (!teamChallenge) {
        return badRequest(res, 'Challenge is not unlocked or assigned for this team');
      }

      if (teamChallenge.status === 'SOLVED') {
        return badRequest(res, 'Level has already been solved by your team');
      }

      const question = await Question.findById(teamChallenge.assignedQuestionId).select('+flag');
      if (!question) {
        return notFound(res, 'Assigned question record missing');
      }

      const challenge = await Challenge.findById(teamChallenge.challengeId);

      // 3. Increment attempt counter
      teamChallenge.attemptsCount += 1;
      await teamChallenge.save();

      // 4. Constant-time secure flag verification
      const isCorrect = safeFlagCompare(flag, question.flag);

      // 5. Create immutable audit submission record
      const submission = await Submission.create({
        teamId,
        userId,
        challengeId: challenge._id,
        teamChallengeId: teamChallenge._id,
        questionId: question._id,
        levelNumber,
        submittedAnswer: flag,
        isCorrect,
        status: isCorrect ? SUBMISSION_STATUS.CORRECT : SUBMISSION_STATUS.INCORRECT,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      if (!isCorrect) {
        logger.info(`[Submission] Incorrect flag submitted by Team ${teamId} on Level ${levelNumber}`);
        return badRequest(res, 'Incorrect flag. Try again, operative.', {
          attemptsCount: teamChallenge.attemptsCount,
          isCorrect: false
        });
      }

      // 6. Handle successful solve atomically
      const solveResult = await scoringService.recordSuccessfulSolve({
        teamId,
        userId,
        challenge,
        teamChallenge,
        submissionId: submission._id
      });

      return success(
        res,
        {
          isCorrect: true,
          pointsAwarded: solveResult.netPoints,
          newTotalScore: solveResult.newTotalScore,
          nextLevel: solveResult.nextLevel,
          levelCleared: levelNumber
        },
        `GRID BREACHED! Level ${levelNumber} successfully conquered!`
      );
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SubmissionController();

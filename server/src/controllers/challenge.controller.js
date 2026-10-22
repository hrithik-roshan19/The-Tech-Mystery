const transaction = require('../utils/transaction');
const { eventFor, teamFor } = require('../services/eligibility.service');
const { participantQuestion, safeContent, privateAnswers } = require('../utils/participantData');
const { Challenge, Team, TeamChallenge } = require('../models');
const questionAssignmentService = require('../services/questionAssignment.service');
const { success } = require('../utils/apiResponse');

/**
 * Challenge Controller
 * Serves mission map and assigned questions without exposing answers.
 */
class ChallengeController {
  /**
   * Retrieves overview of all levels and completion state for logged-in team
   */
  async getMissionMap(req, res, next) {
    try {
      const challenges = await Challenge.find({ status: 'Published', isActive: true }).sort({ levelNumber: 1 });
      const teamId = req.user.teamId;

      const teamChallenges = await TeamChallenge.find({ teamId });
      const teamChallengeMap = new Map();
      teamChallenges.forEach((tc) => teamChallengeMap.set(tc.levelNumber, tc));

      const team = await Team.findById(teamId);

      const answers = await privateAnswers();
      const mapData = challenges.map((ch) => {
        const tc = teamChallengeMap.get(ch.levelNumber);
        const isSolved = tc?.status === 'SOLVED';
        const isUnlocked = team?.currentLevel >= ch.levelNumber && (!ch.requiresCheckpointScan || tc?.checkpointScanned);
        const isCurrent = team?.currentLevel === ch.levelNumber;

        return {
          levelNumber: ch.levelNumber,
          title: safeContent(ch.title, answers),
          category: ch.category,
          points: ch.points,
          difficulty: ch.difficulty,
          requiresCheckpointScan: ch.requiresCheckpointScan,
          isSolved,
          isUnlocked,
          isCurrent
        };
      });

      return success(res, { missionMap: mapData, currentLevel: team?.currentLevel || 1 });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Retrieves active question for current level
   */
  async getCurrentChallenge(req, res, next) {
    try {
      const data = await transaction(async () => {
        const config = await eventFor('challenge');
        const team = await teamFor(req.user.teamId, req.user.userId, config);
        const challenge = await Challenge.findOne({ levelNumber: team.currentLevel, status: 'Published', isActive: true });
        if (!challenge) throw new Error('No active challenge for the current level');
        const result = await questionAssignmentService.getOrAssignQuestion(team._id, team.currentLevel);
        const teamChallenge = result.teamChallenge;
        if (challenge.requiresCheckpointScan && !teamChallenge.checkpointScanned) throw new Error('Physical checkpoint QR must be scanned to unlock this level challenge');
        const question = await require('../models').Question.findById(teamChallenge.assignedQuestionId).select('+flag');
        return { team, challenge, teamChallenge, question };
      });
      const { team, challenge, teamChallenge, question } = data;
      const answers = await privateAnswers();
      return success(res, {
        levelNumber: team.currentLevel,
        challenge: {
          title: safeContent(challenge.title, answers),
          category: challenge.category,
          points: challenge.points,
          difficulty: challenge.difficulty,
          description: safeContent(challenge.description, answers)
        },
        question: await participantQuestion(question),
        teamChallenge: {
          status: teamChallenge.status,
          unlockedHints: teamChallenge.unlockedHints,
          penaltyIncurred: teamChallenge.penaltyIncurred,
          attemptsCount: teamChallenge.attemptsCount
        }
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ChallengeController();


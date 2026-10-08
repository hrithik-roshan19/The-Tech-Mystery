const { Challenge, Team, TeamChallenge } = require('../models');
const questionAssignmentService = require('../services/questionAssignment.service');
const scoringService = require('../services/scoring.service');
const { success, badRequest, notFound, forbidden } = require('../utils/apiResponse');

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
      const challenges = await Challenge.find({ isActive: true }).sort({ levelNumber: 1 });
      const teamId = req.user.teamId;

      const teamChallenges = await TeamChallenge.find({ teamId });
      const teamChallengeMap = new Map();
      teamChallenges.forEach((tc) => teamChallengeMap.set(tc.levelNumber, tc));

      const team = await Team.findById(teamId);

      const mapData = challenges.map((ch) => {
        const tc = teamChallengeMap.get(ch.levelNumber);
        const isSolved = tc?.status === 'SOLVED';
        const isUnlocked = team?.currentLevel >= ch.levelNumber && (!ch.requiresCheckpointScan || tc?.checkpointScanned);
        const isCurrent = team?.currentLevel === ch.levelNumber;

        return {
          levelNumber: ch.levelNumber,
          title: ch.title,
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
      const team = await Team.findById(req.user.teamId);
      if (!team) return notFound(res, 'Team not found');

      const challenge = await Challenge.findOne({ levelNumber: team.currentLevel, isActive: true });
      if (!challenge) {
        return notFound(res, `No active challenge found for Level ${team.currentLevel}`);
      }

      // Check if checkpoint scan is required and if scanned
      let teamChallenge = await TeamChallenge.findOne({ teamId: team._id, levelNumber: team.currentLevel })
        .populate('assignedQuestionId', '-flag');

      if (challenge.requiresCheckpointScan && (!teamChallenge || !teamChallenge.checkpointScanned)) {
        return forbidden(res, 'Physical checkpoint QR must be scanned to unlock this level challenge');
      }

      // If not yet assigned, retrieve or assign
      if (!teamChallenge) {
        const result = await questionAssignmentService.getOrAssignQuestion(team._id, team.currentLevel);
        teamChallenge = result.teamChallenge;
      }

      return success(res, {
        levelNumber: team.currentLevel,
        challenge: {
          title: challenge.title,
          category: challenge.category,
          points: challenge.points,
          difficulty: challenge.difficulty,
          description: challenge.description
        },
        question: teamChallenge.assignedQuestionId,
        teamChallenge: {
          status: teamChallenge.status,
          unlockedHints: teamChallenge.unlockedHints,
          penaltyIncurred: teamChallenge.penaltyIncurred,
          attemptsCount: teamChallenge.attemptsCount
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ChallengeController();


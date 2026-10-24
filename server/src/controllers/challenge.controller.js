const transaction = require('../utils/transaction');
const { eventFor, teamFor } = require('../services/eligibility.service');
const { participantQuestion, safeContent, privateAnswers } = require('../utils/participantData');
const { Challenge, Team, TeamChallenge, Checkpoint, Question } = require('../models');
const questionAssignmentService = require('../services/questionAssignment.service');
const { success } = require('../utils/apiResponse');

/**
 * Challenge Controller
 * Serves mission map and sequential questions without exposing answers.
 */
class ChallengeController {
  /**
   * Retrieves overview of all levels and completion state for logged-in team
   */
  async getMissionMap(req, res, next) {
    try {
      const challenges = await Challenge.find({ status: 'Published', isActive: true }).sort({ levelNumber: 1 });
      const teamId = req.user?.teamId;

      const teamChallenges = teamId ? await TeamChallenge.find({ teamId }) : [];
      const teamChallengeMap = new Map();
      teamChallenges.forEach((tc) => teamChallengeMap.set(tc.levelNumber, tc));

      const team = teamId ? await Team.findById(teamId) : null;
      const checkpoints = await Checkpoint.find({ status: 'Active', isActive: true });
      const checkpointMap = new Map();
      checkpoints.forEach((cp) => checkpointMap.set(cp.levelNumber, cp));

      const answers = await privateAnswers();
      const mapData = challenges.map((ch) => {
        const tc = teamChallengeMap.get(ch.levelNumber);
        const cp = checkpointMap.get(ch.levelNumber);
        const isSolved = tc?.status === 'SOLVED';
        const isUnlocked = team ? team.currentLevel >= ch.levelNumber && (!ch.requiresCheckpointScan || tc?.checkpointScanned) : ch.levelNumber === 1;
        const isCurrent = team ? team.currentLevel === ch.levelNumber : ch.levelNumber === 1;

        return {
          levelNumber: ch.levelNumber,
          title: safeContent(ch.title, answers),
          category: ch.category,
          points: ch.points,
          difficulty: ch.difficulty,
          description: safeContent(ch.description, answers),
          requiresCheckpointScan: ch.requiresCheckpointScan,
          checkpoint: cp ? {
            name: safeContent(cp.name, answers),
            locationDescription: safeContent(cp.locationDescription, answers),
            code: cp.checkpointCode
          } : null,
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
   * Retrieves active sequential question for current level
   */
  async getCurrentChallenge(req, res, next) {
    try {
      const data = await transaction(async () => {
        const config = await eventFor('challenge');
        const team = await teamFor(req.user.teamId, req.user.userId, config);

        if (team.currentLevel > 10) {
          return {
            isEventComplete: true,
            levelNumber: 10,
            team,
            message: 'Congratulations! All challenge levels have been conquered.'
          };
        }

        const challenge = await Challenge.findOne({ levelNumber: team.currentLevel, status: 'Published', isActive: true });
        if (!challenge) throw new Error('No active challenge for the current level');

        const checkpoint = await Checkpoint.findOne({ levelNumber: team.currentLevel });
        const progression = await questionAssignmentService.getOrAssignQuestion(team._id, team.currentLevel);
        const teamChallenge = progression.teamChallenge;

        if (challenge.requiresCheckpointScan && !teamChallenge.checkpointScanned) {
          const lockErr = new Error('Physical checkpoint QR must be scanned to unlock this level challenge');
          lockErr.statusCode = 403;
          lockErr.data = {
            isLocked: true,
            checkpointScanned: false,
            levelNumber: team.currentLevel,
            challengeTitle: challenge.title,
            checkpoint: checkpoint
              ? {
                  name: checkpoint.name,
                  locationDescription: checkpoint.locationDescription,
                  code: checkpoint.checkpointCode
                }
              : null
          };
          throw lockErr;
        }

        let question = null;
        if (teamChallenge.assignedQuestionId) {
          question = await Question.findById(teamChallenge.assignedQuestionId).select('+flag');
        }
        if (!question || question.status !== 'Published' || !question.isActive) {
          throw new Error('Assigned question is unavailable');
        }

        return { team, challenge, checkpoint, teamChallenge, question, progression };
      });

      if (data.isEventComplete) {
        return success(res, data, data.message);
      }

      const { team, challenge, checkpoint, teamChallenge, question, progression } = data;
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
        checkpoint: checkpoint
          ? {
              name: safeContent(checkpoint.name, answers),
              locationDescription: safeContent(checkpoint.locationDescription, answers),
              code: safeContent(checkpoint.checkpointCode, answers)
            }
          : null,
        question: question ? await participantQuestion(question) : null,
        sequenceNumber: progression.sequenceNumber,
        totalQuestions: progression.totalQuestions,
        solvedCount: progression.solvedCount,
        isLevelComplete: progression.isLevelComplete,
        nextCheckpoint: progression.nextCheckpoint,
        emptyReason: progression.emptyReason,
        teamChallenge: {
          status: teamChallenge.status,
          currentSequenceNumber: teamChallenge.currentSequenceNumber,
          attemptsCount: teamChallenge.attemptsCount,
          checkpointScanned: teamChallenge.checkpointScanned,
          unlockedAt: teamChallenge.unlockedAt
        }
      });
    } catch (error) {
      if (error.data) {
        return res.status(error.statusCode || 400).json({
          success: false,
          message: error.message,
          data: error.data
        });
      }
      return res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ChallengeController();

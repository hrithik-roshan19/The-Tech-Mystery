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
  /**
   * Retrieves active sequential question for current level or admin preview / level query
   */
  async getCurrentChallenge(req, res, next) {
    try {
      const data = await transaction(async () => {
        // Admin preview bypass when admin has no team
        if (req.user?.role === 'ADMIN' && !req.user?.teamId) {
          const targetLevel = parseInt(req.params?.levelNumber || req.query?.level || '1', 10);
          const challenge = (await Challenge.findOne({ levelNumber: targetLevel, status: 'Published', isActive: true }))
            || (await Challenge.findOne({ levelNumber: targetLevel }));
          if (!challenge) throw new Error(`No challenge configured for level ${targetLevel}`);

          const checkpoint = await Checkpoint.findOne({ levelNumber: targetLevel });
          const questions = await Question.find({ levelNumber: targetLevel, status: 'Published', isActive: true }).sort({ order: 1 });
          const question = questions.length > 0 ? questions[0] : null;

          return {
            isAdminPreview: true,
            team: { currentLevel: targetLevel },
            challenge,
            checkpoint,
            teamChallenge: {
              status: 'IN_PROGRESS',
              currentSequenceNumber: 1,
              attemptsCount: 0,
              checkpointScanned: true,
              unlockedAt: new Date()
            },
            question,
            progression: {
              sequenceNumber: 1,
              totalQuestions: questions.length,
              solvedCount: 0,
              isLevelComplete: false,
              nextCheckpoint: null,
              emptyReason: questions.length === 0 ? 'No published questions configured for this level yet.' : null
            }
          };
        }

        const config = await eventFor('challenge');
        const team = await teamFor(req.user.teamId, req.user.userId, config);

        const requestedLevel = req.params?.levelNumber ? parseInt(req.params.levelNumber, 10) : team.currentLevel;

        if (requestedLevel < team.currentLevel) {
          const currentCheckpoint = await Checkpoint.findOne({ levelNumber: requestedLevel });
          const nextCheckpoint = (await Checkpoint.findOne({ levelNumber: requestedLevel + 1, isActive: true }))
            || (await Checkpoint.findOne({ levelNumber: requestedLevel + 1 }));
          const nextLocName = (currentCheckpoint?.nextLocationName && currentCheckpoint.nextLocationName.trim())
            || (nextCheckpoint?.locationDescription && nextCheckpoint.locationDescription.trim())
            || (nextCheckpoint?.name && nextCheckpoint.name.trim())
            || null;
          const locInstructions = (currentCheckpoint?.locationInstructions && currentCheckpoint.locationInstructions.trim())
            || (nextCheckpoint?.notes && nextCheckpoint.notes.trim())
            || null;

          return {
            isLevelComplete: true,
            levelNumber: requestedLevel,
            team,
            nextCheckpointLocation: nextLocName,
            nextLocationName: nextLocName,
            locationInstructions: locInstructions,
            nextCheckpoint: nextCheckpoint
              ? {
                  code: nextCheckpoint.checkpointCode || `HTG-CP${String(nextCheckpoint.levelNumber).padStart(2, '0')}`,
                  name: nextCheckpoint.name || `Checkpoint Level ${nextCheckpoint.levelNumber}`,
                  levelNumber: nextCheckpoint.levelNumber,
                  locationDescription: nextLocName,
                  status: 'Unlocked',
                  instructions: locInstructions
                }
              : null,
            message: `Level ${requestedLevel} has already been solved by your squad.`
          };
        }

        if (requestedLevel > team.currentLevel) {
          const lockErr = new Error(`Level ${requestedLevel} is locked. Your squad must complete Level ${team.currentLevel} first.`);
          lockErr.statusCode = 403;
          lockErr.data = {
            isLocked: true,
            checkpointScanned: false,
            levelNumber: requestedLevel,
            challengeTitle: `Level ${requestedLevel}`
          };
          throw lockErr;
        }

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
        if (question && (question.status !== 'Published' || !question.isActive)) {
          throw new Error('Assigned question is unavailable');
        }
        if (!question && !progression.emptyReason && !progression.isLevelComplete) {
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
        levelNumber: team?.currentLevel || data.levelNumber || 1,
        challenge: challenge ? {
          title: safeContent(challenge.title, answers),
          category: challenge.category,
          points: challenge.points,
          difficulty: challenge.difficulty,
          description: safeContent(challenge.description, answers)
        } : null,
        checkpoint: checkpoint
          ? {
              name: safeContent(checkpoint.name, answers),
              locationDescription: safeContent(checkpoint.locationDescription, answers),
              code: safeContent(checkpoint.checkpointCode, answers)
            }
          : null,
        question: question ? await participantQuestion(question) : null,
        sequenceNumber: progression?.sequenceNumber || 1,
        totalQuestions: progression?.totalQuestions || 0,
        solvedCount: progression?.solvedCount || 0,
        isLevelComplete: progression?.isLevelComplete || data.isLevelComplete || false,
        nextCheckpoint: progression?.nextCheckpoint || data.nextCheckpoint || null,
        nextCheckpointLocation: progression?.nextCheckpointLocation || data.nextCheckpointLocation || null,
        nextLocationName: progression?.nextLocationName || data.nextLocationName || null,
        locationInstructions: progression?.locationInstructions || data.locationInstructions || null,
        emptyReason: progression?.emptyReason || null,
        teamChallenge: teamChallenge ? {
          status: teamChallenge.status,
          currentSequenceNumber: teamChallenge.currentSequenceNumber,
          attemptsCount: teamChallenge.attemptsCount,
          checkpointScanned: teamChallenge.checkpointScanned,
          unlockedAt: teamChallenge.unlockedAt
        } : null
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

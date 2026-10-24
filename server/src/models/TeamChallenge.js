const mongoose = require('mongoose');

/**
 * TeamChallenge Schema
 * Pivot model bridging Teams to their assigned Challenge and sequential question progression.
 *
 * GUARANTEES PERSISTENCE:
 * A compound unique index on { teamId, challengeId } and { teamId, levelNumber }
 * ensures that each team tracks independent, continuous question progression per level.
 */
const teamChallengeSchema = new mongoose.Schema(
  {
    scoringSubmissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', default: null },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      index: true
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: [true, 'Challenge ID is required'],
      index: true
    },
    levelNumber: {
      type: Number,
      required: [true, 'Level number is required'],
      index: true
    },
    assignedQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null,
      index: true
    },
    currentSequenceNumber: {
      type: Number,
      default: 1
    },
    solvedQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }
    ],
    status: {
      type: String,
      enum: ['LOCKED', 'UNLOCKED', 'SOLVED'],
      default: 'LOCKED',
      index: true
    },
    checkpointScanned: {
      type: Boolean,
      default: false
    },
    checkpointScannedAt: {
      type: Date,
      default: null
    },
    unlockedAt: {
      type: Date,
      default: null
    },
    solvedAt: {
      type: Date,
      default: null,
      index: true
    },
    solvedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    unlockedHints: [
      {
        type: Number
      }
    ],
    penaltyIncurred: {
      type: Number,
      default: 0
    },
    attemptsCount: {
      type: Number,
      default: 0
    },
    pointsAwarded: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Unique compound indexes guarantee exact idempotency & persistence per level
teamChallengeSchema.index({ teamId: 1, challengeId: 1 }, { unique: true });
teamChallengeSchema.index({ teamId: 1, levelNumber: 1 }, { unique: true });

const TeamChallenge = mongoose.model('TeamChallenge', teamChallengeSchema);
module.exports = TeamChallenge;

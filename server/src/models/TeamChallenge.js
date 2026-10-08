const mongoose = require('mongoose');

/**
 * TeamChallenge Schema
 * Pivot model bridging Teams to their assigned Challenge and specific Question variation.
 *
 * GUARANTEES PERSISTENCE:
 * A compound unique index on { teamId, challengeId } and { teamId, levelNumber }
 * ensures that once a question from the pool is assigned to a team, reloads or
 * re-scans retrieve the exact same assignedQuestionId.
 */
const teamChallengeSchema = new mongoose.Schema(
  {
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
      required: [true, 'Assigned Question variation is required'],
      index: true
    },
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


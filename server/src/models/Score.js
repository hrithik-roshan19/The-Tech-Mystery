const mongoose = require('mongoose');

/**
 * Score / Leaderboard Snapshot Schema
 * Maintains aggregated team scores and timeline for fast, real-time leaderboard rendering.
 */
const scoreSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      unique: true,
      index: true
    },
    currentScore: {
      type: Number,
      default: 0,
      index: true
    },
    solvedLevelsCount: {
      type: Number,
      default: 0,
      index: true
    },
    totalPenalty: {
      type: Number,
      default: 0
    },
    lastSolveTimestamp: {
      type: Date,
      default: null,
      index: true
    },
    history: [
      {
        levelNumber: { type: Number, required: true },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
        pointsAwarded: { type: Number, required: true },
        solvedAt: { type: Date, default: Date.now },
        submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }
      }
    ]
  },
  {
    timestamps: true
  }
);

// High-performance index for live rank calculation:
// Higher score first; in case of tie, earliest solve timestamp wins
scoreSchema.index({ currentScore: -1, lastSolveTimestamp: 1 });

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;

const mongoose = require('mongoose');

/**
 * Team Schema
 * Represents participating teams (2-4 members per team).
 */
const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Team name must be at least 3 characters'],
      maxlength: [40, 'Team name must not exceed 40 characters'],
      index: true
    },
    joinCode: {
      type: String,
      required: [true, 'Team join code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 6,
      maxlength: 10,
      index: true
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team leader is required'],
      index: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    maxMembers: {
      type: Number,
      default: 4,
      min: 2,
      max: 4
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
      index: true
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      index: true
    },
    lastSolveTimestamp: {
      type: Date,
      default: null,
      index: true // Used for deterministic leaderboard tie-breaking
    },
    isDisqualified: {
      type: Boolean,
      default: false,
      index: true
    },
    disqualificationReason: {
      type: String,
      default: null
    },
    avatarUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Composite index for fast leaderboard sorting: totalScore DESC, lastSolveTimestamp ASC
teamSchema.index({ totalScore: -1, lastSolveTimestamp: 1 });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;


const mongoose = require('mongoose');
const { safeContent } = require('../utils/participantData');
const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../constants/challengeTypes');

/**
 * Question Schema
 * Represents an individual question variation in the level question pool.
 * Teams are assigned one specific question variation per challenge level.
 */
const questionSchema = new mongoose.Schema(
  {
    securityRevision: { type: Number, default: 0 },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: [true, 'Associated Challenge ID is required'],
      index: true
    },
    levelNumber: {
      type: Number,
      required: [true, 'Associated level number is required'],
      index: true
    },
    checkpointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Checkpoint',
      default: null,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Question variation title is required'],
      trim: true
    },
    prompt: {
      type: String,
      required: [true, 'Challenge prompt text/markdown is required']
    },
    category: {
      type: String,
      enum: Object.values(CHALLENGE_TYPES),
      required: true
    },
    difficulty: {
      type: String,
      enum: Object.values(CHALLENGE_DIFFICULTY),
      default: CHALLENGE_DIFFICULTY.MEDIUM
    },
    type: {
      type: String,
      enum: ['Text Answer', 'Flag', 'Multiple Choice', 'File Upload'],
      default: 'Flag'
    },
    points: {
      type: Number,
      default: 100,
      min: 0
    },
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Paused', 'Archived'],
      default: 'Published'
    },
    attempts: {
      type: Number,
      default: 3,
      min: 1
    },
    required: {
      type: Boolean,
      default: true
    },
    // The expected answer / flag string.
    // select: false ensures that questions queries NEVER include the flag unless explicitly requested with .select('+flag')
    flag: {
      type: String,
      required: [true, 'Expected flag is required'],
      trim: true,
      select: false
    },
    isCaseSensitive: {
      type: Boolean,
      default: true
    },
    hints: [
      {
        hintIndex: { type: Number, required: true },
        content: { type: String, required: true },
        penaltyPoints: { type: Number, default: 20 }
      }
    ],
    assetUrls: [
      {
        type: String,
        trim: true
      }
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    qrCodeDataUrl: { type: String, default: null },
    qrScanUrl: { type: String, default: null },
    qrToken: { type: String, default: null },
    checkpointCode: { type: String, default: null },
    // First-Come-First-Served (FCFS) QR Claim & Completion tracking
    isClaimed: {
      type: Boolean,
      default: false,
      index: true
    },
    claimedByTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
      index: true
    },
    claimedAt: {
      type: Date,
      default: null
    },
    claimExpiresAt: {
      type: Date,
      default: null,
      index: true
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true
    },
    completedByTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
      index: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to quickly pull active question pool for a level
questionSchema.index({ challengeId: 1, isActive: 1 });
questionSchema.index({ levelNumber: 1, isActive: 1 });
questionSchema.index({ isClaimed: 1, isCompleted: 1 });
questionSchema.index({ levelNumber: 1, isClaimed: 1, isCompleted: 1 });

// New/edited questions cannot publish literal answers in participant text.
questionSchema.pre('validate', function(next) {
  if (this.flag && ['title', 'prompt', 'assetUrls'].some(field =>
    (this.isModified(field) || this.isModified('flag')) &&
    [this[field]].flat().some(value => typeof value === 'string' && safeContent(value, [this.flag]) !== value))) {
    return next(new Error('Participant content contains private answer material'));
  }
  next();
});
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

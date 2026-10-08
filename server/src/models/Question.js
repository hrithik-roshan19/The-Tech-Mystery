const mongoose = require('mongoose');
const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../constants/challengeTypes');

/**
 * Question Schema
 * Represents an individual question variation in the level question pool.
 * Teams are assigned one specific question variation per challenge level.
 */
const questionSchema = new mongoose.Schema(
  {
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

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;


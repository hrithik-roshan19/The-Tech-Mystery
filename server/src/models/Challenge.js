const mongoose = require('mongoose');
const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../constants/challengeTypes');

/**
 * Challenge Schema
 * Represents an event Level / Stage (Levels 1 through ~10).
 * Acts as the container for a pool of distinct question variations.
 */
const challengeSchema = new mongoose.Schema(
  {
    securityRevision: { type: Number, default: 0 },
    levelNumber: {
      type: Number,
      required: [true, 'Level number is required'],
      unique: true,
      min: 1,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: Object.values(CHALLENGE_TYPES),
      required: [true, 'Challenge category is required']
    },
    description: {
      type: String,
      required: [true, 'Challenge overview description is required']
    },
    objectives: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      default: '🧩'
    },
    points: {
      type: Number,
      required: [true, 'Base solve points are required'],
      default: 100,
      min: 0
    },
    requiresCheckpointScan: {
      type: Boolean,
      default: true,
      index: true
    },
    checkpointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Checkpoint',
      default: null,
      index: true
    },
    difficulty: {
      type: String,
      enum: Object.values(CHALLENGE_DIFFICULTY),
      default: CHALLENGE_DIFFICULTY.MEDIUM
    },
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Paused', 'Archived'],
      default: 'Published',
      index: true
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

const Challenge = mongoose.model('Challenge', challengeSchema);
module.exports = Challenge;


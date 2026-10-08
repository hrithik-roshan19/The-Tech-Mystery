const mongoose = require('mongoose');

/**
 * Checkpoint Schema
 * Physical campus checkpoint corresponding to QR placements.
 *
 * CRITICAL SECURITY ARCHITECTURE:
 * Physical QR stickers encode ONLY an opaque checkpoint token URL:
 * https://hackthegrid.codesphere.org/checkpoint/scan?code=CP-XXXX&token=HMAC...
 * NEVER contains the question, clue, or flag!
 */
const checkpointSchema = new mongoose.Schema(
  {
    levelNumber: {
      type: Number,
      required: [true, 'Checkpoint level number is required'],
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Checkpoint name is required'],
      trim: true
    },
    locationDescription: {
      type: String,
      required: [true, 'Campus location description is required']
    },
    checkpointCode: {
      type: String,
      required: [true, 'Unique checkpoint code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    associatedChallengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      default: null,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    scanCount: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Checkpoint = mongoose.model('Checkpoint', checkpointSchema);
module.exports = Checkpoint;


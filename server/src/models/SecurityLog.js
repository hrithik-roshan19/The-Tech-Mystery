const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    severity: {
      type: String,
      enum: ['CRITICAL', 'WARNING', 'INFO'],
      default: 'INFO',
      index: true
    },
    category: {
      type: String,
      enum: [
        'AUTHENTICATION',
        'AUTHORIZATION',
        'RATE LIMIT',
        'INTEGRITY',
        'CHECKPOINT',
        'QR CHECKPOINT',
        'ADMIN ACTION',
        'SESSION',
        'CONFIGURATION',
        'OTHER'
      ],
      default: 'OTHER',
      index: true
    },
    event: {
      type: String,
      required: true,
      trim: true
    },
    actor: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    target: {
      type: String,
      default: '—',
      trim: true
    },
    source: {
      type: String,
      default: '127.0.0.1',
      trim: true
    },
    detail: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['FLAGGED', 'REVIEW', 'RECORDED', 'REVIEWED'],
      default: 'RECORDED',
      index: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for timeline queries
securityLogSchema.index({ timestamp: -1, severity: 1 });

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

module.exports = SecurityLog;


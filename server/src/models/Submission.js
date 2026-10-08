const mongoose = require('mongoose');
const { SUBMISSION_STATUS } = require('../constants/submissionStatus');

/**
 * Submission Schema
 * Full audit log of all flag/answer attempts by any team member.
 * Provides immutable paper trail for anti-cheat and tie-break verification.
 */
const submissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitting user ID is required'],
      index: true
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: [true, 'Challenge ID is required'],
      index: true
    },
    teamChallengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamChallenge',
      required: [true, 'TeamChallenge reference is required'],
      index: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, 'Question ID is required']
    },
    levelNumber: {
      type: Number,
      required: true,
      index: true
    },
    submittedAnswer: {
      type: String,
      required: [true, 'Submitted answer string is required'],
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(SUBMISSION_STATUS),
      required: true,
      index: true
    },
    pointsDelta: {
      type: Number,
      default: 0
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: 'submittedAt', updatedAt: false }
  }
);

// Compound indexes for analytics and rate checks
submissionSchema.index({ teamId: 1, challengeId: 1, submittedAt: -1 });
submissionSchema.index({ submittedAt: -1 }); // Global activity stream for admin dashboard

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;


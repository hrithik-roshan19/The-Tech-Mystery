const mongoose = require('mongoose');
const { EVENT_STATES } = require('../constants/eventStates');

/**
 * EventConfig Schema
 * Singleton control document governing the entire CTF event lifecycle and rules.
 */
const eventConfigSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'Hack the Grid'
    },
    organizer: {
      type: String,
      default: "CodeSphere Coding Club, Tula's University"
    },
    state: {
      type: String,
      enum: Object.values(EVENT_STATES),
      default: EVENT_STATES.DRAFT,
      index: true
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    registrationDeadline: {
      type: Date,
      default: null
    },
    totalLevels: {
      type: Number,
      default: 10
    },
    isLeaderboardFrozen: {
      type: Boolean,
      default: false
    },
    frozenAt: {
      type: Date,
      default: null
    },
    maxTeamSize: {
      type: Number,
      default: 4
    },
    minTeamSize: {
      type: Number,
      default: 2
    },
    announcements: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

const EventConfig = mongoose.model('EventConfig', eventConfigSchema);
module.exports = EventConfig;


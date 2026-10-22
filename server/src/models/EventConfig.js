const mongoose = require('mongoose');
const { EVENT_STATES } = require('../constants/eventStates');

/**
 * EventConfig Schema
 * Singleton control document governing the entire CTF event lifecycle and rules.
 */
const eventConfigSchema = new mongoose.Schema(
  {
    securityRevision: { type: Number, default: 0 },
    eventName: {
      type: String,
      default: 'The Tech Mystery'
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
    isLeaderboardVisible: {
      type: Boolean,
      default: true
    },
    frozenAt: {
      type: Date,
      default: null
    },
    maxTeamSize: {
      type: Number, min: 2, max: 4,
      default: 4
    },
    minTeamSize: {
      type: Number, min: 2, max: 4,
      default: 2
    },
    subtitle: {
      type: String,
      default: 'CodeSphere × UTKRISHT 2026'
    },
    duration: {
      type: Number,
      default: 120
    },
    maxTeams: {
      type: Number,
      default: 50
    },
    registrationOpen: {
      type: Boolean,
      default: true
    },
    qrCheckpoints: {
      type: Boolean,
      default: true
    },
    // FCFS QR Question Claim Lease Timeout (minutes)
    questionClaimTimeoutMinutes: {
      type: Number,
      default: 30,
      min: 5,
      max: 180
    },
    hintsEnabled: {
      type: Boolean,
      default: true
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    announcementsEnabled: {
      type: Boolean,
      default: true
    },
    location: {
      type: String,
      default: "Tula's University, Dehradun"
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

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants/roles');

/**
 * User Schema
 * Represents participants, team leaders, and administrators.
 */
const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, unique: true, sparse: true, select: false },
    clerkLinkedAt: { type: Date, select: false },
    tokenVersion: { type: Number, default: 0, select: false },
    securityRevision: { type: Number, default: 0 },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and dashes'],
      index: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true
    },
    passwordHash: {
      type: String,
      required: function () { return !this.clerkUserId; },
      select: false // Never exposed in queries by default
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    collegeRollNo: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.TEAM_MEMBER,
      index: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
      index: true
    },
    college: {
      type: String,
      default: "Tula's University",
      trim: true
    },
    course: {
      type: String,
      default: "B.Tech CSE",
      trim: true
    },
    year: {
      type: String,
      default: "3rd Year",
      trim: true
    },
    bio: {
      type: String,
      maxlength: 180,
      default: "",
      trim: true
    },
    github: {
      type: String,
      default: "",
      trim: true
    },
    linkedin: {
      type: String,
      default: "",
      trim: true
    },
    publicProfile: {
      type: Boolean,
      default: true
    },
    emailUpdates: {
      type: Boolean,
      default: true
    },
    avatar: {
      type: String,
      default: ""
    },
    department: {
      type: String,
      default: "CodeSphere · Event Operations",
      trim: true
    },
    twoFactor: {
      type: Boolean,
      default: true
    },
    securityAlerts: {
      type: Boolean,
      default: true
    },
    emailAlerts: {
      type: Boolean,
      default: true
    },
    sessionAlerts: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


/**
 * Pre-save hook: Hash password if modified
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Helper instance method: Compare raw password with stored hash
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash || typeof candidatePassword !== 'string') return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
module.exports = User;


const transaction = require('../utils/transaction');
const { eventFor } = require('./eligibility.service');
const crypto = require('crypto');
const { Team, User, Score, TeamChallenge, EventConfig } = require('../models');
const { ROLES } = require('../constants/roles');

/**
 * Team Service
 * Manages team creation, join codes, member invites, admin management, and level progression tracking.
 */
class TeamService {
  /**
   * Generates a 128-bit invitation code
   */
  generateJoinCode() {
    return 'HTG-' + crypto.randomBytes(16).toString('hex').toUpperCase();
  }

  /**
   * Creates a new team with the creating user as TEAM_LEADER
   */
  async createTeam(userId, teamName, college) {
    const user = await User.findById(userId);
    if (!user || !user.isActive || user.role === ROLES.ADMIN) throw new Error('Active participant account required');
    if (user.teamId) throw new Error('User is already registered with a team');

    const config = await eventFor('registration');
    if (config) {
      if (config.maintenanceMode) {
        throw new Error('CTF platform is in maintenance mode. Team registration is temporarily unavailable.');
      }
      if (config.state === 'CONCLUDED') {
        throw new Error('Event has concluded. Team creation is disabled.');
      }
      if (config.registrationOpen === false || config.state === 'REGISTRATION_CLOSED') {
        throw new Error('Registration is currently closed by event administrators');
      }
      if (config.maxTeams) {
        const teamCount = await Team.countDocuments();
        if (teamCount >= config.maxTeams) {
          throw new Error(`Maximum team registration limit (${config.maxTeams} teams) reached for this event`);
        }
      }
    }

    const trimmedName = teamName ? String(teamName).trim() : '';
    if (!trimmedName || trimmedName.length < 3) {
      throw new Error('Team name must be at least 3 characters');
    }

    const existingTeam = await Team.findOne({ name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
    if (existingTeam) {
      throw new Error(`Team name "${trimmedName}" is already taken`);
    }

    const joinCode = this.generateJoinCode();
    const maxMembers = config?.maxTeamSize || 4;

    const team = await Team.create({
      name: trimmedName,
      college: college && typeof college === 'string' && college.trim() ? college.trim() : "Tula's University",
      joinCode,
      leaderId: user._id,
      members: [user._id],
      maxMembers,
      currentLevel: 1,
      totalScore: 0
    });

    // Update user's team and promote to TEAM_LEADER
    user.teamId = team._id;
    user.role = ROLES.TEAM_LEADER;
    await user.save();

    // Initialize initial Score tracking record for live leaderboard
    await Score.create({
      teamId: team._id,
      currentScore: 0,
      solvedLevelsCount: 0,
      lastSolveTimestamp: null
    });

    return team;
  }

  /**
   * Adds a user to an existing team via join code
   */
  async joinTeam(userId, joinCode) {
    const user = await User.findById(userId);
    if (!user || !user.isActive || user.role === ROLES.ADMIN) throw new Error('Active participant account required');
    if (user.teamId) throw new Error('User is already registered with a team');

    const config = await eventFor('registration');
    if (config) {
      if (config.maintenanceMode) {
        throw new Error('CTF platform is in maintenance mode. Team enrollment is temporarily unavailable.');
      }
      if (config.state === 'CONCLUDED') {
        throw new Error('Event has concluded. Team enrollment is disabled.');
      }
      if (config.registrationOpen === false || config.state === 'REGISTRATION_CLOSED') {
        throw new Error('Team enrollment is currently closed by event administrators');
      }
    }

    const team = await Team.findOne({ joinCode: joinCode.trim().toUpperCase() });
    if (!team) throw new Error('Invalid team join code');

    if (team.isDisqualified) {
      throw new Error('This team has been disqualified from the event');
    }

    const maxAllowed = Math.min(config?.maxTeamSize || 4, team.maxMembers || 4);
    if (team.members.length >= maxAllowed) {
      throw new Error(`Team is full (maximum ${maxAllowed} members allowed)`);
    }

    if (team.members.some((m) => m.toString() === user._id.toString())) {
      throw new Error('You are already a member of this team');
    }

    team.members.push(user._id);
    await team.save();

    user.teamId = team._id;
    user.role = ROLES.TEAM_MEMBER;
    await user.save();

    return team;
  }

  async rotateJoinCode(teamId, userId) {
    const user = await User.findOneAndUpdate({ _id: userId, isActive: true },
      { $inc: { securityRevision: 1 } }, { new: true });
    const team = await Team.findById(teamId);
    if (!team || !user || !(user.role === ROLES.ADMIN ||
      (user.role === ROLES.TEAM_LEADER && String(team.leaderId) === String(user._id) && String(user.teamId) === String(team._id)))) {
      throw Object.assign(new Error('Only the team leader or an administrator may manage invitations'), { statusCode: 403 });
    }
    team.joinCode = this.generateJoinCode();
    await team.save();
    await require('../models').SecurityLog.create({ eventId: `EVT-${crypto.randomUUID()}`,
      severity: 'INFO', category: 'ADMIN ACTION', event: 'Team invitation rotated', actor: String(userId),
      target: String(teamId), detail: 'Previous invitation invalidated', status: 'RECORDED' });
    return { joinCode: team.joinCode };
  }

  /**
   * Admin: Creates a team directly
   */
  async createAdminTeam({ name, college, leaderEmailOrUsername, memberIdentifiers = [], currentLevel = 1, totalScore = 0 }) {
    if (Number(currentLevel) !== 1 || Number(totalScore) !== 0) throw new Error('New teams must start at level 1 with zero score');
    const trimmedName = name ? String(name).trim() : '';
    if (!trimmedName || trimmedName.length < 3) {
      throw new Error('Team name must be at least 3 characters');
    }

    const existingTeam = await Team.findOne({ name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
    if (existingTeam) {
      throw new Error(`Team name "${trimmedName}" is already taken`);
    }

    let leaderUser = null;
    if (leaderEmailOrUsername) {
      leaderUser = await User.findOne({
        $or: [
          { email: leaderEmailOrUsername.trim().toLowerCase() },
          { username: leaderEmailOrUsername.trim() }
        ]
      });
      if (!leaderUser) {
        throw new Error(`Leader user "${leaderEmailOrUsername}" not found`);
      }
      if (!leaderUser.isActive || leaderUser.role === ROLES.ADMIN || leaderUser.teamId) {
        throw new Error(`User "${leaderEmailOrUsername}" is already enrolled in another team`);
      }
    } else {
      throw new Error('A team leader email or username is required');
    }

    const resolvedMembers = [leaderUser._id];

    if (Array.isArray(memberIdentifiers)) {
      for (const idf of memberIdentifiers) {
        if (!idf || typeof idf !== 'string' || !idf.trim()) continue;
        const query = /^[0-9a-fA-F]{24}$/.test(idf.trim())
          ? { _id: idf.trim() }
          : { $or: [{ email: idf.trim().toLowerCase() }, { username: idf.trim() }] };

        const member = await User.findOne(query);
        if (!member) {
          throw new Error(`Member user "${idf}" not found`);
        }
        if (!member.isActive || member.role === ROLES.ADMIN || member.teamId) {
          throw new Error(`User "${idf}" is already enrolled in another team`);
        }
        if (!resolvedMembers.some((m) => m.toString() === member._id.toString())) {
          resolvedMembers.push(member._id);
        }
      }
    }

    if (resolvedMembers.length > 4) {
      throw new Error('Team exceeds maximum capacity of 4 members');
    }

    const joinCode = this.generateJoinCode();
    const team = await Team.create({
      name: trimmedName,
      college: college && typeof college === 'string' && college.trim() ? college.trim() : "Tula's University",
      joinCode,
      leaderId: leaderUser._id,
      members: resolvedMembers,
      maxMembers: 4,
      currentLevel: Math.max(1, Number(currentLevel) || 1),
      totalScore: Math.max(0, Number(totalScore) || 0)
    });

    // Update leader
    leaderUser.teamId = team._id;
    leaderUser.role = ROLES.TEAM_LEADER;
    await leaderUser.save();

    // Update members
    for (const memberId of resolvedMembers) {
      if (memberId.toString() !== leaderUser._id.toString()) {
        await User.findByIdAndUpdate(memberId, { teamId: team._id, role: ROLES.TEAM_MEMBER });
      }
    }

    // Initialize Score
    await Score.create({
      teamId: team._id,
      currentScore: team.totalScore,
      solvedLevelsCount: Math.max(0, team.currentLevel - 1),
      lastSolveTimestamp: team.totalScore > 0 ? new Date() : null
    });

    return Team.findById(team._id)
      .populate('leaderId', 'username email fullName role collegeRollNo')
      .populate('members', 'username email fullName role collegeRollNo');
  }

  /**
   * Admin: Updates team properties
   */
  async updateTeam(teamId, payload) {
    const team = await Team.findById(teamId);
    if (!team) throw new Error('Team not found');

    const { name, college, currentLevel, totalScore, isDisqualified, disqualificationReason, maxMembers } = payload;
    if ((currentLevel !== undefined && Number(currentLevel) !== team.currentLevel) ||
        (totalScore !== undefined && Number(totalScore) !== team.totalScore)) {
      throw new Error('Use submission review for auditable score and progression corrections');
    }

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (trimmed.length < 3) throw new Error('Team name must be at least 3 characters');
      const duplicate = await Team.findOne({
        _id: { $ne: team._id },
        name: { $regex: new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
      if (duplicate) throw new Error(`Team name "${trimmed}" is already in use`);
      team.name = trimmed;
    }

    if (college !== undefined) {
      team.college = String(college).trim() || "Tula's University";
    }

    if (currentLevel !== undefined) {
      const lvl = Number(currentLevel);
      if (Number.isInteger(lvl) && lvl >= 1 && lvl <= 10) {
        team.currentLevel = lvl;
      }
    }

    if (totalScore !== undefined) {
      const scoreNum = Number(totalScore);
      if (!Number.isNaN(scoreNum) && scoreNum >= 0) {
        team.totalScore = scoreNum;
        await Score.findOneAndUpdate(
          { teamId: team._id },
          {
            currentScore: scoreNum,
            lastSolveTimestamp: scoreNum > 0 ? (team.lastSolveTimestamp || new Date()) : null
          },
          { upsert: true }
        );
      }
    }

    if (maxMembers !== undefined) {
      const maxNum = Number(maxMembers);
      if (maxNum < team.members.length) throw new Error('Capacity cannot be smaller than the roster');
      if (maxNum >= 2 && maxNum <= 4) {
        team.maxMembers = maxNum;
      }
    }

    if (isDisqualified !== undefined) {
      team.isDisqualified = Boolean(isDisqualified);
      team.disqualificationReason = team.isDisqualified
        ? (disqualificationReason ? String(disqualificationReason).trim() : 'Violation of event rules')
        : null;
    }

    await team.save();

    return Team.findById(team._id)
      .populate('leaderId', 'username email fullName role collegeRollNo')
      .populate('members', 'username email fullName role collegeRollNo');
  }

  /**
   * Admin: Adds a member to a team
   */
  async addMemberToTeam(teamId, userIdentifier) {
    const team = await Team.findById(teamId);
    if (!team) throw new Error('Team not found');

    if (team.isDisqualified) {
      throw new Error('Cannot add members to a disqualified team');
    }

    const config = await EventConfig.findOne();
    if (team.members.length >= Math.min(team.maxMembers, config?.maxTeamSize || 4)) {
      throw new Error(`Team is already at maximum capacity (${team.maxMembers} members)`);
    }

    if (!userIdentifier || typeof userIdentifier !== 'string' || !userIdentifier.trim()) {
      throw new Error('User email or username is required');
    }

    const query = /^[0-9a-fA-F]{24}$/.test(userIdentifier.trim())
      ? { _id: userIdentifier.trim() }
      : { $or: [{ email: userIdentifier.trim().toLowerCase() }, { username: userIdentifier.trim() }] };

    const user = await User.findOne(query);
    if (!user || !user.isActive || user.role === ROLES.ADMIN) throw new Error('Active participant account required');

    if (user.teamId && user.teamId.toString() !== team._id.toString()) {
      throw new Error(`User "${user.username}" is already a member of another team`);
    }

    if (team.members.some((m) => m.toString() === user._id.toString())) {
      throw new Error(`User "${user.username}" is already in this team`);
    }

    team.members.push(user._id);
    await team.save();

    user.teamId = team._id;
    user.role = ROLES.TEAM_MEMBER;
    await user.save();

    return Team.findById(team._id)
      .populate('leaderId', 'username email fullName role collegeRollNo')
      .populate('members', 'username email fullName role collegeRollNo');
  }

  /**
   * Admin: Removes a member from a team
   */
  async removeMemberFromTeam(teamId, userId) {
    const team = await Team.findById(teamId);
    if (!team) throw new Error('Team not found');

    if (team.leaderId.toString() === userId.toString()) {
      throw new Error('Cannot remove team leader. Transfer leadership or delete the team.');
    }

    const isMember = team.members.some((m) => m.toString() === userId.toString());
    if (!isMember) {
      throw new Error('User is not a member of this team');
    }

    team.members = team.members.filter((m) => m.toString() !== userId.toString());
    await team.save();

    await User.findByIdAndUpdate(userId, {
      teamId: null,
      role: ROLES.TEAM_MEMBER
    });

    return Team.findById(team._id)
      .populate('leaderId', 'username email fullName role collegeRollNo')
      .populate('members', 'username email fullName role collegeRollNo');
  }

  /**
   * Admin: Deletes a team and cleans up associations
   */
  async deleteTeam(teamId) {
    const team = await Team.findById(teamId);
    if (!team) throw new Error('Team not found');

    if (await TeamChallenge.exists({ teamId: team._id })) throw new Error('Teams with gameplay history must be disqualified rather than deleted');

    // Reset all members
    await User.updateMany({ teamId: team._id }, { teamId: null, role: ROLES.TEAM_MEMBER });

    // Clean up related records
    await TeamChallenge.deleteMany({ teamId: team._id });
    await Score.deleteMany({ teamId: team._id });
    await Team.findByIdAndDelete(team._id);

    return { success: true, deletedTeamId: teamId };
  }
}

const service = new TeamService();
for (const method of ['createTeam', 'joinTeam', 'rotateJoinCode', 'createAdminTeam', 'updateTeam', 'addMemberToTeam', 'removeMemberFromTeam', 'deleteTeam']) {
  const original = service[method].bind(service);
  service[method] = (...args) => transaction(() => original(...args));
}
module.exports = service;

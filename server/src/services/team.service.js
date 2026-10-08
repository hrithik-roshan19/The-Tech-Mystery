const crypto = require('crypto');
const { Team, User, Score } = require('../models');
const { ROLES } = require('../constants/roles');

/**
 * Team Service
 * Manages team creation, join codes, member invites, and level progression tracking.
 */
class TeamService {
  /**
   * Generates a unique 7-character alphanumeric join code
   */
  generateJoinCode() {
    return 'HTG-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  }

  /**
   * Creates a new team with the creating user as TEAM_LEADER
   */
  async createTeam(userId, teamName) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.teamId) throw new Error('User is already registered with a team');

    const joinCode = this.generateJoinCode();

    const team = await Team.create({
      name: teamName,
      joinCode,
      leaderId: user._id,
      members: [user._id],
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
    if (!user) throw new Error('User not found');
    if (user.teamId) throw new Error('User is already registered with a team');

    const team = await Team.findOne({ joinCode: joinCode.trim().toUpperCase() });
    if (!team) throw new Error('Invalid team join code');

    if (team.isDisqualified) {
      throw new Error('This team has been disqualified from the event');
    }

    if (team.members.length >= team.maxMembers) {
      throw new Error(`Team is full (maximum ${team.maxMembers} members allowed)`);
    }

    team.members.push(user._id);
    await team.save();

    user.teamId = team._id;
    user.role = ROLES.TEAM_MEMBER;
    await user.save();

    return team;
  }
}

module.exports = new TeamService();


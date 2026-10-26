const { EventConfig, Team, User } = require('../models');
const denied = message => Object.assign(new Error(message), { statusCode: 403 });

async function eventFor(action) {
  // Write conflict with lifecycle edits prevents a concurrent pause/close from
  // being ignored by a transaction using an older snapshot.
  const config = await EventConfig.findOneAndUpdate(
    {},
    { $inc: { securityRevision: 1 } },
    { sort: { createdAt: 1 }, new: true }
  );
  if (!config) {
    if (action === 'registration') {
      throw denied('Registration is currently closed');
    }
    throw denied('Event must be LIVE for gameplay (no event configuration found)');
  }
  if (config.maintenanceMode) throw denied('Event is unavailable or in maintenance mode');
  if (action === 'registration') {
    if (!config.registrationOpen || !['REGISTRATION_OPEN', 'LIVE'].includes(config.state)) {
      throw denied('Registration is currently closed');
    }
    if (config.registrationDeadline && new Date() > config.registrationDeadline) throw denied('Registration deadline has passed');
  } else {
    if (config.state !== 'LIVE') {
      if (config.state === 'PAUSED') {
        throw denied('Event is currently paused by administrators. Checkpoint scanning and gameplay are temporarily suspended.');
      }
      if (config.state === 'REGISTRATION_OPEN') {
        throw denied('Event is currently in registration phase. Gameplay and QR checkpoint scanning unlock when the event goes LIVE.');
      }
      if (config.state === 'REGISTRATION_CLOSED') {
        throw denied('Event registration is closed and gameplay has not started yet. QR scanning unlocks when the event goes LIVE.');
      }
      if (config.state === 'DRAFT') {
        throw denied('Event is in setup/draft mode. Gameplay has not started yet.');
      }
      if (config.state === 'CONCLUDED') {
        throw denied('Event has concluded. Checkpoint scanning and submissions are closed.');
      }
      throw denied(`Event must be LIVE for gameplay (current status: ${config.state || 'INACTIVE'})`);
    }
    if (config.startTime && new Date() < config.startTime) {
      throw denied(`Event has not started yet. Scheduled to begin at ${config.startTime.toISOString()}`);
    }
    if (config.endTime && new Date() >= config.endTime) {
      throw denied(`Event has concluded at ${config.endTime.toISOString()}`);
    }
    if (action === 'scan' && !config.qrCheckpoints) {
      throw denied('QR checkpoints are disabled');
    }
  }
  return config;
}

async function teamFor(teamId, userId, config) {
  const team = await Team.findOneAndUpdate({ _id: teamId, isDisqualified: false },
    { $inc: { securityRevision: 1 } }, { new: true });
  if (!team) throw denied('Team is unavailable or disqualified');
  if (userId) {
    const user = await User.findOneAndUpdate({ _id: userId, teamId, isActive: true },
      { $inc: { securityRevision: 1 } }, { new: true });
    if (!user || !team.members.some(id => String(id) === String(userId))) throw denied('Active team membership required');
  }
  const activeMembers = await User.countDocuments({ _id: { $in: team.members }, teamId, isActive: true, role: { $in: ['TEAM_LEADER', 'TEAM_MEMBER'] } });
  if (activeMembers < (Math.max(2, config.minTeamSize || 2)) || team.members.length > Math.min(team.maxMembers, config.maxTeamSize || 4)) {
    throw denied('Team does not meet event team-size requirements');
  }
  return team;
}

module.exports = { eventFor, teamFor };

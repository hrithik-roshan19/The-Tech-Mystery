const { EventConfig } = require('../models');
const { success } = require('../utils/apiResponse');

/**
 * Public Event Controller
 * Lightweight, unauthenticated endpoints providing live event lifecycle status to participants & visitors.
 */
class EventController {
  async getEventStatus(req, res, next) {
    try {
      const config = await EventConfig.getSingleton({});
      const isLive = config.state === 'LIVE' && !config.maintenanceMode;

      return success(res, {
        eventName: config.eventName || 'The Tech Mystery',
        subtitle: config.subtitle || 'CodeSphere × UTKRISHT 2026',
        state: config.state,
        isLive,
        registrationOpen: Boolean(config.registrationOpen),
        maintenanceMode: Boolean(config.maintenanceMode),
        qrCheckpoints: Boolean(config.qrCheckpoints),
        hintsEnabled: Boolean(config.hintsEnabled),
        isLeaderboardVisible: config.isLeaderboardVisible !== false,
        startTime: config.startTime || null,
        endTime: config.endTime || null,
        serverTime: new Date().toISOString()
      }, 'Authoritative event lifecycle status');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new EventController();

import api from './api';

/**
 * Event Service
 * Communicates with public and participant-facing event status endpoints.
 */
export const eventService = {
  /**
   * Fetches the authoritative event lifecycle status from backend.
   * Public endpoint - unauthenticated.
   */
  getEventStatus: async () => {
    const res = await api.get('/event/status');
    return res.data;
  },
};

export default eventService;

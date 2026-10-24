import api from './api';

export const leaderboardService = {
  getLeaderboard: async () => {
    const res = await api.get('/leaderboard');
    return res.data;
  },

  getStreamUrl: () => {
    const baseURL = api.defaults.baseURL || '/api/v1';
    return `${baseURL}/leaderboard/stream`;
  }
};

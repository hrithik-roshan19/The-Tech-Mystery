import api from './api';

export const leaderboardService = {
  getLeaderboard: async () => {
    const res = await api.get('/leaderboard');
    return res.data;
  }
};


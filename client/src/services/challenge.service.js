import api from './api';

export const challengeService = {
  getMissionMap: async () => {
    const res = await api.get('/challenges/mission-map');
    return res.data;
  },

  getCurrentChallenge: async () => {
    const res = await api.get('/challenges/current');
    return res.data;
  },

  submitFlag: async (levelNumber, flag) => {
    const res = await api.post('/submissions/submit', { levelNumber, flag });
    return res.data;
  }
};

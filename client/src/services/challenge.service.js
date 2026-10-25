import api from './api';

export const challengeService = {
  getMissionMap: async () => {
    const res = await api.get('/challenges/mission-map');
    return res.data;
  },

  getCurrentChallenge: async (levelNumber) => {
    const url = levelNumber ? `/challenges/${levelNumber}` : '/challenges/current';
    const res = await api.get(url);
    return res.data;
  },

  submitFlag: async (levelNumber, flag, questionId) => {
    const res = await api.post('/submissions/submit', {
      levelNumber,
      flag,
      answer: flag,
      questionId
    });
    return res.data;
  },

  submitAnswer: async (levelNumber, answer, questionId) => {
    return challengeService.submitFlag(levelNumber, answer, questionId);
  }
};

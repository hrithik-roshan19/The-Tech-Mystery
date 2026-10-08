import api from './api';

export const teamService = {
  createTeam: async (name) => {
    const res = await api.post('/teams/create', { name });
    return res.data;
  },

  joinTeam: async (joinCode) => {
    const res = await api.post('/teams/join', { joinCode });
    return res.data;
  },

  getMyTeam: async () => {
    const res = await api.get('/teams/me');
    return res.data;
  },

  getTeamById: async (id) => {
    const res = await api.get(`/teams/${id}`);
    return res.data;
  }
};


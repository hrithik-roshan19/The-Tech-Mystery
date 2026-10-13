import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },

  updateProfile: async (payload) => {
    const res = await api.patch('/auth/profile', payload);
    return res.data;
  },

  updateAvatar: async (avatarData) => {
    const res = await api.post('/auth/avatar', { avatar: avatarData });
    return res.data;
  },

  changePassword: async (passwords) => {
    const res = await api.post('/auth/change-password', passwords);
    return res.data;
  }
};



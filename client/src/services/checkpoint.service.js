import api from './api';

export const checkpointService = {
  scanCheckpoint: async (code, token) => {
    const res = await api.post('/checkpoints/scan', { code, token });
    return res.data;
  }
};

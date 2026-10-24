import api from './api';

export const checkpointService = {
  scanCheckpoint: async (codeOrId, token, questionId = null) => {
    const payload = {};
    if (typeof codeOrId === 'object' && codeOrId !== null) {
      Object.assign(payload, codeOrId);
    } else if (typeof codeOrId === 'string' && /^[0-9a-fA-F]{24}$/.test(codeOrId)) {
      payload.checkpointId = codeOrId;
      if (token) payload.token = token;
    } else {
      payload.code = codeOrId;
      if (token) payload.token = token;
    }
    if (questionId) {
      payload.questionId = questionId;
      payload.qid = questionId;
    }
    const res = await api.post('/checkpoints/scan', payload);
    return res.data;
  },

  getCheckpoint: async (checkpointId) => {
    const res = await api.get(`/checkpoints/${checkpointId}`);
    return res.data;
  }
};

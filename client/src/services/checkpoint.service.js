import api from './api';

export const checkpointService = {
  scanCheckpoint: async (code, token, questionId = null) => {
    const payload = { code, token };
    if (questionId) {
      payload.questionId = questionId;
      payload.qid = questionId;
    }
    const res = await api.post('/checkpoints/scan', payload);
    return res.data;
  }
};

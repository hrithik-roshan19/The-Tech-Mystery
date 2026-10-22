import api from './api';

/**
 * Submission Service
 * Handles participant flag submissions to the backend scoring engine.
 */
export const submissionService = {
  /**
   * Submits a flag for verification on a specific level
   * @param {number} levelNumber
   * @param {string} flag
   */
  submitFlag: async (levelNumber, flag) => {
    const res = await api.post('/submissions/submit', {
      levelNumber: Number(levelNumber),
      flag: String(flag).trim()
    });
    return res.data;
  }
};

export default submissionService;


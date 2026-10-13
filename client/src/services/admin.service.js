import api from './api';

/**
 * Admin API Service
 * Communicates with protected /api/v1/admin/* endpoints (requires ADMIN JWT).
 */
export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard-stats');
    return res.data;
  },

  getAllTeams: async () => {
    const res = await api.get('/admin/teams');
    return res.data;
  },

  updateTeamDisqualification: async (teamId, { isDisqualified = true, reason } = {}) => {
    const res = await api.patch(`/admin/teams/${teamId}/disqualify`, {
      isDisqualified,
      reason,
    });
    return res.data;
  },

  getSubmissionLogs: async (params = {}) => {
    const res = await api.get('/admin/submissions', { params });
    return res.data;
  },

  reviewSubmission: async (submissionId, payload) => {
    const res = await api.patch(`/admin/submissions/${submissionId}/review`, payload);
    return res.data;
  },

  getCheckpoints: async () => {
    const res = await api.get('/admin/checkpoints');
    return res.data;
  },

  createCheckpoint: async (payload) => {
    const res = await api.post('/admin/checkpoints', payload);
    return res.data;
  },

  updateCheckpoint: async (checkpointId, payload) => {
    const res = await api.patch(`/admin/checkpoints/${checkpointId}`, payload);
    return res.data;
  },

  getChallenges: async () => {
    const res = await api.get('/admin/challenges');
    return res.data;
  },

  createChallenge: async (payload) => {
    const res = await api.post('/admin/challenges', payload);
    return res.data;
  },

  updateChallenge: async (challengeId, payload) => {
    const res = await api.patch(`/admin/challenges/${challengeId}`, payload);
    return res.data;
  },

  getQuestions: async (params = {}) => {
    const res = await api.get('/admin/questions', { params });
    return res.data;
  },

  createQuestion: async (payload) => {
    const res = await api.post('/admin/questions', payload);
    return res.data;
  },

  updateQuestion: async (questionId, payload) => {
    const res = await api.patch(`/admin/questions/${questionId}`, payload);
    return res.data;
  },

  updateEventConfig: async (payload) => {
    const res = await api.patch('/admin/event-config', payload);
    return res.data;
  },

  getLeaderboard: async () => {
    const res = await api.get('/leaderboard');
    return res.data;
  },

  broadcastAnnouncement: async (payload) => {
    const res = await api.post('/admin/announcements', payload);
    return res.data;
  },

  getSecurityLogs: async (params = {}) => {
    const res = await api.get('/admin/security-logs', { params });
    return res.data;
  },

  reviewSecurityLog: async (logId) => {
    const res = await api.patch(`/admin/security-logs/${logId}/review`);
    return res.data;
  },

  getAdminProfile: async () => {
    const res = await api.get('/admin/profile');
    return res.data;
  },

  updateAdminProfile: async (payload) => {
    const res = await api.patch('/admin/profile', payload);
    return res.data;
  },

  revokeSessions: async () => {
    const res = await api.post('/admin/sessions/revoke');
    return res.data;
  },
};

export default adminService;



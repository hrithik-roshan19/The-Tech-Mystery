import { storage } from '../utils/storage';
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

  createTeam: async (payload) => {
    const res = await api.post('/admin/teams', payload);
    return res.data;
  },

  updateTeam: async (teamId, payload) => {
    const res = await api.patch(`/admin/teams/${teamId}`, payload);
    return res.data;
  },

  approveTeam: async (teamId) => {
    const res = await api.patch(`/admin/teams/${teamId}/approve`);
    return res.data;
  },

  addTeamMember: async (teamId, payload) => {
    const res = await api.post(`/admin/teams/${teamId}/members`, payload);
    return res.data;
  },

  removeTeamMember: async (teamId, userId) => {
    const res = await api.delete(`/admin/teams/${teamId}/members/${userId}`);
    return res.data;
  },

  deleteTeam: async (teamId) => {
    const res = await api.delete(`/admin/teams/${teamId}`);
    return res.data;
  },

  updateTeamDisqualification: async (teamId, { isDisqualified = true, reason } = {}) => {
    const res = await api.patch(`/admin/teams/${teamId}/disqualify`, {
      isDisqualified,
      reason,
    });
    return res.data;
  },

  getSubmissions: async (params = {}) => {
    const res = await api.get('/admin/submissions', { params });
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

  getCheckpointQr: async (checkpointId) => {
    const res = await api.get(`/admin/checkpoints/${checkpointId}/qr`);
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

  getCheckpointLocations: async () => {
    const res = await api.get('/admin/checkpoint-locations');
    return res.data;
  },

  updateCheckpointLocation: async (levelNumber, payload) => {
    const res = await api.patch(`/admin/checkpoint-locations/${levelNumber}`, payload);
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

  deleteChallenge: async (challengeId) => {
    const res = await api.delete(`/admin/challenges/${challengeId}`);
    return res.data;
  },

  getQuestions: async (params = {}) => {
    const res = await api.get('/admin/questions', { params });
    return res.data;
  },

  uploadQuestions: async (questions) => {
    const res = await api.post('/admin/questions/upload', questions);
    return res.data;
  },

  getQuestionQr: async (questionId) => {
    const res = await api.get(`/admin/questions/${questionId}/qr`);
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

  deleteQuestion: async (questionId) => {
    const res = await api.delete(`/admin/questions/${questionId}`);
    return res.data;
  },

  releaseQuestionClaim: async (questionId) => {
    const res = await api.post(`/admin/questions/${questionId}/release-claim`);
    return res.data;
  },

  reorderQuestions: async (questionIds) => {
    const res = await api.put('/admin/questions/reorder', { questionIds });
    return res.data;
  },

  updateEventConfig: async (payload) => {
    const res = await api.patch('/admin/event-config', payload);
    return res.data;
  },

  getLeaderboard: async () => {
    const res = await api.get('/admin/leaderboard');
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
    if (res.data?.data?.accessToken) storage.setToken(res.data.data.accessToken);
    return res.data;
  },
};

export default adminService;

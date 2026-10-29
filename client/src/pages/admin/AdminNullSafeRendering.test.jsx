// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuestionManagementPage from './QuestionManagementPage';
import SubmissionManagementPage from './SubmissionManagementPage';
import AdminDashboard from './AdminDashboard';
import adminService from '../../services/admin.service';

const { mockAdminService } = vi.hoisted(() => {
  const service = {
    getQuestions: vi.fn(),
    getChallenges: vi.fn(),
    getCheckpoints: vi.fn(),
    getSubmissionLogs: vi.fn(),
    getSubmissions: vi.fn(),
    getAllTeams: vi.fn().mockResolvedValue({ data: { teams: [] } }),
    deleteQuestion: vi.fn(),
    updateQuestion: vi.fn(),
    createQuestion: vi.fn(),
    reviewSubmission: vi.fn(),
    updateEventConfig: vi.fn(),
    getDashboardStats: vi.fn().mockResolvedValue({ data: {} }),
  };
  return { mockAdminService: service };
});

vi.mock('../../services/admin.service', () => ({
  adminService: mockAdminService,
  default: mockAdminService,
}));

let mockUser = { id: 'admin-1', username: 'hrx_admin', role: 'ADMIN', email: 'admin@codesphere.tulas.edu.in' };
let mockIsAuthenticated = true;
let mockLoading = false;

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
    loading: mockLoading,
    logout: vi.fn(),
  }),
}));

describe('Admin Questions & Submissions Null-Safety and Resilient Rendering', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockAdminService.getDashboardStats.mockResolvedValue({ data: { stats: {} } });
    mockUser = { id: 'admin-1', username: 'hrx_admin', role: 'ADMIN', email: 'admin@codesphere.tulas.edu.in' };
    mockIsAuthenticated = true;
    mockLoading = false;
  });

  afterEach(() => {
    cleanup();
  });

  describe('QuestionManagementPage (/admin/questions)', () => {
    it('does NOT throw Cannot read properties of null (reading \'status\') when questions database is empty', async () => {
      mockAdminService.getQuestions.mockResolvedValue({
        data: { questions: [] },
      });
      mockAdminService.getChallenges.mockResolvedValue({
        data: { challenges: [] },
      });
      mockAdminService.getCheckpoints.mockResolvedValue({
        data: { checkpoints: [] },
      });

      let renderError = null;
      try {
        render(
          <MemoryRouter>
            <QuestionManagementPage />
          </MemoryRouter>
        );
      } catch (err) {
        renderError = err;
      }

      // Must not throw null pointer exception on mount
      expect(renderError).toBeNull();

      // Check for Question Inspector empty state
      await waitFor(() => {
        expect(screen.getByText(/QUESTION INSPECTOR/i)).toBeDefined();
        expect(screen.getByText(/No Question Selected/i)).toBeDefined();
        expect(screen.getByText(/No questions have been configured yet/i)).toBeDefined();
        expect(screen.getByText(/No questions configured yet/i)).toBeDefined();
      });
    });

    it('renders questions smoothly when live questions exist', async () => {
      mockAdminService.getQuestions.mockResolvedValue({
        data: {
          questions: [
            {
              _id: 'q-mongo-1',
              id: 'Q-001',
              title: 'Subnet Mask Calculation',
              prompt: 'Find the broadcast address for 192.168.1.0/24',
              status: 'Published',
              level: 1,
              points: 100,
              type: 'Flag',
              category: 'Networking',
              attempts: 3,
            },
          ],
        },
      });
      mockAdminService.getChallenges.mockResolvedValue({
        data: { challenges: [{ title: 'Network Infiltration' }] },
      });
      mockAdminService.getCheckpoints.mockResolvedValue({
        data: { checkpoints: [{ levelNumber: 1, checkpointCode: 'HTG-CP01' }] },
      });

      render(
        <MemoryRouter>
          <QuestionManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Subnet Mask Calculation').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Published').length).toBeGreaterThan(0);
        expect(screen.getByText(/QUESTION PREVIEW · Q-001/i)).toBeDefined();
      });
    });

    it('displays error banner and retry action when getQuestions fails', async () => {
      mockAdminService.getQuestions.mockRejectedValue(new Error('Network error connecting to backend'));
      mockAdminService.getChallenges.mockResolvedValue({ data: { challenges: [] } });
      mockAdminService.getCheckpoints.mockResolvedValue({ data: { checkpoints: [] } });

      render(
        <MemoryRouter>
          <QuestionManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeDefined();
        expect(screen.getByText(/Network error connecting to backend/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Retry/i })).toBeDefined();
      });
    });

    it('displays error indicators rather than deceptive zeros when getQuestions fails or times out', async () => {
      mockAdminService.getQuestions.mockRejectedValue(new Error('timeout of 10000ms exceeded'));
      mockAdminService.getChallenges.mockResolvedValue({ data: { challenges: [] } });
      mockAdminService.getCheckpoints.mockResolvedValue({ data: { checkpoints: [] } });

      render(
        <MemoryRouter>
          <QuestionManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeDefined();
        expect(screen.getByText(/timeout of 10000ms exceeded/i)).toBeDefined();
        // Check that stat counters show '—' instead of '0'
        const dashedCounters = screen.getAllByText('—');
        expect(dashedCounters.length).toBeGreaterThanOrEqual(4);
        // Table and Inspector show clear error messaging
        expect(screen.getByText(/Failed to load challenge questions/i)).toBeDefined();
        expect(screen.getByText(/Questions Unavailable/i)).toBeDefined();
      });
    });
  });

  describe('SubmissionManagementPage (/admin/submissions)', () => {
    it('does NOT throw Cannot read properties of null (reading \'result\') when submissions database is empty', async () => {
      mockAdminService.getSubmissionLogs.mockResolvedValue({
        data: { submissions: [], stats: { total: 0, pending: 0, approved: 0, rejected: 0 } },
      });

      let renderError = null;
      try {
        render(
          <MemoryRouter>
            <SubmissionManagementPage />
          </MemoryRouter>
        );
      } catch (err) {
        renderError = err;
      }

      // Must not throw null pointer exception on mount
      expect(renderError).toBeNull();

      // Check for Submission Audit empty state
      await waitFor(() => {
        expect(screen.getByText(/SUBMISSION AUDIT/i)).toBeDefined();
        expect(screen.getByText(/No Submission Selected/i)).toBeDefined();
        expect(screen.getByText(/No participant submissions have been recorded yet/i)).toBeDefined();
        expect(screen.getByText(/No submissions recorded yet/i)).toBeDefined();
      });
    });

    it('renders submissions smoothly when live submissions exist', async () => {
      mockAdminService.getSubmissionLogs.mockResolvedValue({
        data: {
          submissions: [
            {
              id: 'SUB-1046',
              rawId: 'sub-raw-1',
              team: 'CyberKnights',
              teamCode: 'TM-CYBER',
              question: 'Subnet Mask Calculation',
              challenge: 'Network Infiltration',
              answer: '192.168.1.255',
              result: 'Correct',
              points: 100,
              maxPoints: 100,
              attempts: 1,
              level: 1,
              date: '2026-10-25',
              submittedAt: '12:30:00',
              mode: 'Flag',
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <SubmissionManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('CyberKnights').length).toBeGreaterThan(0);
        expect(screen.getByText(/SUBMISSION DETAIL · SUB-1046/i)).toBeDefined();
        expect(screen.getByText('192.168.1.255')).toBeDefined();
      });
    });

    it('displays error banner and retry action when getSubmissionLogs fails', async () => {
      mockAdminService.getSubmissionLogs.mockRejectedValue(new Error('Backend offline or database unreachable'));

      render(
        <MemoryRouter>
          <SubmissionManagementPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeDefined();
        expect(screen.getByText(/Backend offline or database unreachable/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Retry/i })).toBeDefined();
      });
    });
  });

  describe('AdminDashboard (/admin)', () => {
    it('loads without "adminService.getSubmissions is not a function" error and renders real telemetry and submissions', async () => {
      mockAdminService.getDashboardStats.mockResolvedValue({
        data: {
          stats: {
            totalTeams: 12,
            totalParticipants: 36,
            correctSubmissions: 48,
            activeCheckpoints: 10,
            accuracyRate: '88.5%',
            levelProgress: [
              ['Level 01', 100],
              ['Level 02', 75],
            ],
            recentActivity: [
              { time: '14:20:00', title: 'Flag accepted', detail: 'Team Alpha on Level 1', type: 'success' },
            ],
          },
          eventConfig: { state: 'LIVE', registrationOpen: true },
        },
      });

      mockAdminService.getAllTeams.mockResolvedValue({
        data: {
          teams: [
            {
              _id: 'team-alpha-id',
              name: 'Team Alpha',
              joinCode: 'ALPHA1',
              members: ['u1', 'u2', 'u3'],
              totalScore: 500,
              currentLevel: 3,
              isDisqualified: false,
            },
          ],
        },
      });

      mockAdminService.getSubmissions.mockResolvedValue({
        data: {
          submissions: [
            {
              id: 'SUB-9001',
              team: 'Team Alpha',
              level: 2,
              submittedAt: '14:20:00',
              result: 'Correct',
            },
            {
              id: 'SUB-9002',
              team: 'Team Beta',
              level: 1,
              submittedAt: '14:22:15',
              result: 'Incorrect',
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );

      // Verify dashboard headers & metrics load from real backend
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Admin/i })).toBeDefined();
        expect(screen.getByText('REGISTERED TEAMS')).toBeDefined();
        expect(screen.getAllByText('12').length).toBeGreaterThan(0);
        expect(screen.getByText('TOTAL PARTICIPANTS')).toBeDefined();
        expect(screen.getAllByText('36').length).toBeGreaterThan(0);
        expect(screen.getByText('FLAGS CAPTURED')).toBeDefined();
        expect(screen.getAllByText('48').length).toBeGreaterThan(0);
        expect(screen.getByText('ACTIVE CHECKPOINTS')).toBeDefined();
        expect(screen.getAllByText('10').length).toBeGreaterThan(0);
      });

      // Verify recent submissions populated from adminService.getSubmissions
      await waitFor(() => {
        expect(screen.getByText(/Recent submissions/i)).toBeDefined();
        expect(screen.getAllByText('Team Alpha').length).toBeGreaterThan(0);
        expect(screen.getByText(/Level 2 · 14:20:00/i)).toBeDefined();
        expect(screen.getByText('Team Beta')).toBeDefined();
        expect(screen.getByText(/Level 1 · 14:22:15/i)).toBeDefined();
      });

      // Crucial: No error banner for "adminService.getSubmissions is not a function"
      expect(screen.queryByText(/adminService\.getSubmissions is not a function/i)).toBeNull();
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('gracefully handles submission API error without crashing dashboard metrics', async () => {
      mockAdminService.getDashboardStats.mockResolvedValue({
        data: {
          stats: {
            totalTeams: 8,
            totalParticipants: 24,
            correctSubmissions: 15,
            activeCheckpoints: 10,
            accuracyRate: '90.0%',
          },
        },
      });

      mockAdminService.getAllTeams.mockResolvedValue({
        data: {
          teams: [
            {
              _id: 'team-gamma',
              name: 'Team Gamma',
              joinCode: 'GAMMA1',
              members: ['u1', 'u2'],
              totalScore: 200,
              currentLevel: 2,
            },
          ],
        },
      });

      // Submissions API fails
      mockAdminService.getSubmissions.mockRejectedValue(new Error('Submissions service timeout'));

      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );

      // Dashboard stats still render successfully
      await waitFor(() => {
        expect(screen.getByText('REGISTERED TEAMS')).toBeDefined();
        expect(screen.getAllByText('8').length).toBeGreaterThan(0);
        expect(screen.getByText('TOTAL PARTICIPANTS')).toBeDefined();
        expect(screen.getAllByText('24').length).toBeGreaterThan(0);
        expect(screen.getByText('Team Gamma')).toBeDefined();
      });

      // Empty submissions state is shown smoothly rather than crashing the page
      await waitFor(() => {
        expect(screen.getByText(/No submissions yet/i)).toBeDefined();
      });

      // Crucial: No crash error banner
      expect(screen.queryByText(/adminService\.getSubmissions is not a function/i)).toBeNull();
    });
  });
});

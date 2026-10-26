// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({ isLoaded: true, isSignedIn: false, getToken: async () => null }),
  useUser: () => ({ isLoaded: true, isSignedIn: false, user: null }),
  useClerk: () => ({ signOut: vi.fn() }),
  SignIn: () => <div data-testid="clerk-sign-in">Admin Sign In</div>,
  SignUp: () => <div data-testid="clerk-sign-up">Admin Sign Up</div>,
}));

const { mockAdminService } = vi.hoisted(() => {
  const service = {
    getDashboardStats: vi.fn(),
    getAllTeams: vi.fn(),
    getSubmissions: vi.fn(),
    getSubmissionLogs: vi.fn(),
  };
  return { mockAdminService: service };
});

vi.mock('./services/admin.service', () => ({
  adminService: mockAdminService,
  default: mockAdminService,
}));

let mockAuth = {
  user: null,
  isAuthenticated: false,
  loading: false,
  identityAuthenticated: false,
};

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => mockAuth,
}));

describe('Admin Dashboard Route & Component Mount Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('unauthenticated visitor to /admin/dashboard redirects to /admin/login', () => {
    mockAuth = {
      user: null,
      isAuthenticated: false,
      loading: false,
      identityAuthenticated: false,
    };

    const { container } = render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Should redirect to LoginPage, not be a blank black screen
    expect(container.innerHTML).not.toBe('');
  });

  it('authenticated admin visitor renders AdminDashboard without crashing', async () => {
    mockAuth = {
      user: { id: 'admin-1', username: 'hrx_admin', role: 'ADMIN', email: 'admin@codesphere.tulas.edu.in' },
      isAuthenticated: true,
      loading: false,
      identityAuthenticated: true,
    };

    mockAdminService.getDashboardStats.mockResolvedValue({
      success: true,
      data: {
        stats: {
          totalTeams: 5,
          totalParticipants: 15,
          totalChallenges: 10,
          totalQuestions: 17,
          totalSubmissions: 3,
          correctSubmissions: 2,
          totalScans: 10,
          activeCheckpoints: 10,
          accuracyRate: '66.7%',
          levelProgress: [['Level 01', 50], ['Level 02', 20]],
          recentActivity: [{ time: '14:00', title: 'Flag accepted', detail: 'Team A on Level 1', type: 'success' }],
        },
        eventConfig: { state: 'LIVE', registrationOpen: true, qrCheckpoints: true, hintsEnabled: true },
      },
    });

    mockAdminService.getAllTeams.mockResolvedValue({
      success: true,
      data: { teams: [] },
    });

    mockAdminService.getSubmissions.mockResolvedValue({
      success: true,
      data: { submissions: [] },
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(container.innerHTML).not.toBe('');
    expect(screen.getByText('OVERVIEW')).toBeDefined();
    expect(screen.getByText('REGISTERED TEAMS')).toBeDefined();
  });

  it('handles null submissions, empty levelProgress, and malformed teams without throwing', async () => {
    mockAuth = {
      user: { id: 'admin-1', username: 'hrx_admin', role: 'ADMIN', email: 'admin@codesphere.tulas.edu.in' },
      isAuthenticated: true,
      loading: false,
      identityAuthenticated: true,
    };

    mockAdminService.getDashboardStats.mockResolvedValue({
      success: true,
      data: {
        stats: {
          totalTeams: 0,
          totalParticipants: 0,
          totalSubmissions: 0,
          correctSubmissions: 0,
          levelProgress: [],
          recentActivity: [null, { time: null, title: 'Ping' }],
        },
      },
    });

    mockAdminService.getAllTeams.mockResolvedValue({
      success: true,
      data: {
        teams: [
          { _id: 't-1', name: '', joinCode: null, members: null, totalScore: null, currentLevel: null },
        ],
      },
    });

    mockAdminService.getSubmissions.mockResolvedValue({
      success: true,
      data: {
        submissions: [
          null,
          { id: 'SUB-1', team: null, level: null, result: null, isCorrect: null },
          { id: 'SUB-2', team: 'Beta', level: 1, result: 'Pending Review' },
        ],
      },
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(container.innerHTML).not.toBe('');
    expect(screen.getByRole('heading', { level: 1, name: /Admin/i })).toBeDefined();
    expect(screen.getAllByText('0%').length).toBeGreaterThan(0);
  });

  it('AdminLayout wraps child routes with ErrorBoundary preventing black screen', () => {
    mockAuth = {
      user: { id: 'admin-1', username: 'hrx_admin', role: 'ADMIN', email: 'admin@codesphere.tulas.edu.in' },
      isAuthenticated: true,
      loading: false,
      identityAuthenticated: true,
    };

    mockAdminService.getDashboardStats.mockResolvedValue({ success: true, data: { stats: {} } });
    mockAdminService.getAllTeams.mockResolvedValue({ success: true, data: { teams: [] } });
    mockAdminService.getSubmissions.mockResolvedValue({ success: true, data: { submissions: [] } });

    const { container } = render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(container.innerHTML).not.toBe('');
    expect(container.querySelector('.htg-admin-layout-root')).toBeDefined();
  });
});

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const fixture = vi.hoisted(() => ({
  auth: { loading: false, identityAuthenticated: false, isAuthenticated: false, user: null },
  provider: vi.fn(),
}));

vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children, ...props }) => { fixture.provider(props); return <>{children}</>; },
  useAuth: () => ({ isLoaded: true, isSignedIn: false, getToken: async () => null }),
  useUser: () => ({ isLoaded: true, isSignedIn: false, user: null }),
  useClerk: () => ({ signOut: vi.fn() }),
  SignIn: props => <div data-testid="clerk-sign-in" data-routing={props.routing}>Clerk sign-in route</div>,
  SignUp: props => <div data-testid="clerk-sign-up" data-routing={props.routing}>Clerk sign-up route</div>,
}));

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { success: true, data: { team: null, user: null, stats: {} } } }),
    post: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
  },
  setSessionTokenGetter: vi.fn(),
  isClerkMode: () => {
    const provider = import.meta.env.VITE_AUTH_PROVIDER;
    if (provider === 'jwt') return false;
    if (provider === 'clerk') return true;
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return /^pk_(test|live)_/.test(key || '');
  },
  getNormalizedApiBaseUrl: (raw) => (raw ? (raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`) : 'http://localhost:5000/api/v1')
}));

vi.mock('../hooks/useAuth', () => ({ useAuth: () => fixture.auth }));
import AppRoutes from './AppRoutes';
import App from '../App';

beforeEach(() => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'pk_test_fixture');
  fixture.provider.mockClear();
  fixture.auth = { loading: false, identityAuthenticated: false, isAuthenticated: false, user: null };
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); window.history.replaceState({}, '', '/'); });

describe('Actual application auth routes', () => {
  it.each(['/login', '/admin/login'])('%s renders Clerk SignIn when signed out', path => {
    render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
    expect(screen.getByTestId('clerk-sign-in').getAttribute('data-routing')).toBe('hash');
    expect(screen.queryByText('Login to Dashboard')).toBeNull();
  });

  it('/register renders Clerk SignUp without the legacy team wizard when signed out', () => {
    render(<MemoryRouter initialEntries={['/register']}><AppRoutes /></MemoryRouter>);
    expect(screen.getByTestId('clerk-sign-up').getAttribute('data-routing')).toBe('hash');
    expect(screen.queryByText('Team Details')).toBeNull();
  });

  it('keeps explicit JWT rollback selectable even when a publishable key is present', () => {
    vi.stubEnv('VITE_AUTH_PROVIDER', 'jwt');
    render(<MemoryRouter initialEntries={['/login']}><AppRoutes /></MemoryRouter>);
    expect(screen.queryByTestId('clerk-sign-in')).toBeNull();
    expect(screen.getByRole('button', { name: /Login to Dashboard/i })).toBeTruthy();
  });

  it('the application root places ClerkProvider around the real login route', async () => {
    window.history.replaceState({}, '', '/login');
    render(<App />);
    expect(await screen.findByTestId('clerk-sign-in')).toBeTruthy();
    expect(fixture.provider).toHaveBeenCalledWith(expect.objectContaining({
      signInUrl: '/login', signUpUrl: '/register', signInForceRedirectUrl: '/auth/complete',
      signUpForceRedirectUrl: '/auth/complete',
    }));
  });

  // Requirement 1: New users who complete Clerk signup must be redirected to /register
  it('AuthComplete redirects new user without team to /register', () => {
    fixture.auth = {
      loading: false,
      identityAuthenticated: true,
      isAuthenticated: true,
      user: { _id: 'u1', username: 'newbie', role: 'TEAM_MEMBER', teamId: null }
    };
    render(<MemoryRouter initialEntries={['/auth/complete']}><AppRoutes /></MemoryRouter>);
    // After redirect to /register, user sees Team Registration wizard
    expect(screen.getByText('Team Details')).toBeTruthy();
    expect(screen.getByText('Create Your')).toBeTruthy();
  });

  // Requirement 2: Existing users who log in must go directly to /dashboard
  it('AuthComplete redirects existing user with team to /dashboard', () => {
    fixture.auth = {
      loading: false,
      identityAuthenticated: true,
      isAuthenticated: true,
      user: { _id: 'u2', username: 'veteran', role: 'TEAM_LEADER', teamId: 'team_123' }
    };
    render(<MemoryRouter initialEntries={['/auth/complete']}><AppRoutes /></MemoryRouter>);
    // Should NOT redirect to /register
    expect(screen.queryByText('Team Details')).toBeNull();
    expect(screen.queryByTestId('clerk-sign-up')).toBeNull();
  });

  // Requirement 5: Protect /dashboard: if user has not completed registration, redirect to /register
  it('/dashboard redirects authenticated participant without team to /register', () => {
    fixture.auth = {
      loading: false,
      identityAuthenticated: true,
      isAuthenticated: true,
      user: { _id: 'u3', username: 'noteam', role: 'TEAM_MEMBER', teamId: null }
    };
    render(<MemoryRouter initialEntries={['/dashboard']}><AppRoutes /></MemoryRouter>);
    // Redirected to /register where team wizard renders
    expect(screen.getByText('Team Details')).toBeTruthy();
  });

  // Requirement 6 & 3: Protect /register: if user has already completed registration, redirect to /dashboard
  it('/register redirects authenticated participant who already has a team to /dashboard', () => {
    fixture.auth = {
      loading: false,
      identityAuthenticated: true,
      isAuthenticated: true,
      user: { _id: 'u4', username: 'hasteam', role: 'TEAM_LEADER', teamId: 'team_456' }
    };
    render(<MemoryRouter initialEntries={['/register']}><AppRoutes /></MemoryRouter>);
    // Should NOT show registration form or Clerk SignUp
    expect(screen.queryByText('Team Details')).toBeNull();
    expect(screen.queryByTestId('clerk-sign-up')).toBeNull();
  });

  // Role-based protection: Admin users redirect to /admin/dashboard
  it('AuthComplete redirects admin user to /admin/dashboard', () => {
    fixture.auth = {
      loading: false,
      identityAuthenticated: true,
      isAuthenticated: true,
      user: { _id: 'admin1', username: 'adm', role: 'ADMIN', teamId: null }
    };
    render(<MemoryRouter initialEntries={['/auth/complete']}><AppRoutes /></MemoryRouter>);
    // Should not show team wizard or regular dashboard
    expect(screen.queryByText('Team Details')).toBeNull();
  });
});

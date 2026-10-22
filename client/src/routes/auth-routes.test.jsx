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
  useClerk: () => ({ signOut: vi.fn() }),
  SignIn: props => <div data-testid="clerk-sign-in" data-routing={props.routing}>Clerk sign-in route</div>,
  SignUp: props => <div data-testid="clerk-sign-up" data-routing={props.routing}>Clerk sign-up route</div>,
}));
vi.mock('../hooks/useAuth', () => ({ useAuth: () => fixture.auth }));
import AppRoutes from './AppRoutes';
import App from '../App';

beforeEach(() => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'pk_test_fixture');
  fixture.provider.mockClear();
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); window.history.replaceState({}, '', '/'); });

describe('Actual application auth routes', () => {
  it.each(['/login', '/admin/login'])('%s renders Clerk SignIn when signed out', path => {
    render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
    expect(screen.getByTestId('clerk-sign-in').getAttribute('data-routing')).toBe('hash');
    expect(screen.queryByText('Login to Dashboard')).toBeNull();
  });
  it('/register renders Clerk SignUp without the legacy team wizard', () => {
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
});

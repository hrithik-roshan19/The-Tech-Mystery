import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
const fixture = vi.hoisted(() => ({ auth: {}, sdk: {}, signOut: vi.fn(), openUserProfile: vi.fn(), get: vi.fn(), post: vi.fn() }));
vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children }) => <>{children}</>,
  useAuth: () => fixture.sdk,
  useClerk: () => ({ signOut: fixture.signOut, openUserProfile: fixture.openUserProfile }),
  SignIn: () => <div>Official sign-in component</div>, SignUp: () => <div>Official sign-up component</div>
}));
vi.mock('../services/api', () => ({ default: { get: (...args) => fixture.get(...args), post: (...args) => fixture.post(...args) }, setSessionTokenGetter: vi.fn() }));
vi.mock('../hooks/useAuth', () => ({ useAuth: () => fixture.auth }));
import { AuthProvider, ClerkBridge } from './ClerkAuthProvider';
import { AuthContext } from './AuthContext';
import { LoginPage, RegisterPage, AuthCompletePage } from '../pages/auth/ClerkPages';
import ProtectedRoute from '../routes/ProtectedRoute';
function Probe() {
  const context = React.useContext(AuthContext);
  return <><p>{context.loading ? 'loading' : context.user?.username || 'signed out'}</p><button onClick={context.logout}>Logout</button></>;
}
beforeEach(() => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  fixture.auth = { loading: false, identityAuthenticated: false };
  fixture.sdk = { isLoaded: true, isSignedIn: false, getToken: vi.fn().mockResolvedValue('session-fixture') };
  vi.clearAllMocks(); sessionStorage.clear();
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });
describe('Clerk frontend contracts (SDK UI mocked; no real login claim)', () => {
  it('fails closed when publishable key is absent', () => {
    vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', ''); render(<AuthProvider><p>Protected content</p></AuthProvider>);
    expect(screen.getByRole('alert').textContent).toContain('not configured');
    expect(screen.queryByText('Protected content')).toBeNull();
  });
  it('uses official login and registration components', () => {
    const view = render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByText('Official sign-in component')).toBeTruthy();
    view.rerender(<MemoryRouter><RegisterPage /></MemoryRouter>);
    expect(screen.getByText('Official sign-up component')).toBeTruthy();
  });
  it('shows loading until Clerk is ready', () => {
    fixture.sdk.isLoaded = false; render(<ClerkBridge><Probe /></ClerkBridge>);
    expect(screen.getByText('loading')).toBeTruthy(); expect(fixture.get).not.toHaveBeenCalled();
  });
  it('restores only server-resolved users and signs out through Clerk', async () => {
    fixture.sdk.isSignedIn = true;
    fixture.get.mockResolvedValue({ data: { data: { user: { username: 'mapped', role: 'TEAM_MEMBER' } } } });
    render(<ClerkBridge><Probe /></ClerkBridge>);
    await screen.findByText('mapped');
    expect(fixture.get).toHaveBeenCalledWith('/auth/me', { headers: { Authorization: 'Bearer session-fixture' } });
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(fixture.signOut).toHaveBeenCalledWith({ redirectUrl: '/login' }));
  });
  it('redirects an unlinked signed-in identity to account completion', async () => {
    fixture.auth = { loading: false, identityAuthenticated: true, isAuthenticated: false };
    render(<MemoryRouter initialEntries={['/portal']}><Routes>
      <Route path="/portal" element={<ProtectedRoute><p>Protected content</p></ProtectedRoute>} />
      <Route path="/auth/complete" element={<p>Link account destination</p>} />
    </Routes></MemoryRouter>);
    expect(await screen.findByText('Link account destination')).toBeTruthy();
  });
  it('redirects signed-out visitors to login without rendering protected content', async () => {
    fixture.auth = { loading: false, isAuthenticated: false };
    render(<MemoryRouter initialEntries={['/portal']}><Routes>
      <Route path="/portal" element={<ProtectedRoute><p>Protected content</p></ProtectedRoute>} />
      <Route path="/login" element={<p>Login destination</p>} />
    </Routes></MemoryRouter>);
    expect(await screen.findByText('Login destination')).toBeTruthy();
    expect(screen.queryByText('Protected content')).toBeNull();
  });
  it('does not restore an account from a late response after logout', async () => {
    fixture.sdk.isSignedIn = true;
    let resolveRequest;
    fixture.get.mockImplementation(() => new Promise(resolve => { resolveRequest = resolve; }));
    render(<ClerkBridge><Probe /></ClerkBridge>);
    await waitFor(() => expect(fixture.get).toHaveBeenCalled());
    fireEvent.click(screen.getByText('Logout'));
    resolveRequest({ data: { data: { user: { username: 'stale-account' } } } });
    await waitFor(() => expect(fixture.signOut).toHaveBeenCalled());
    expect(screen.queryByText('stale-account')).toBeNull();
  });
  it('denies participant access to admin UI using server role', async () => {
    fixture.auth = { loading: false, isAuthenticated: true, user: { role: 'TEAM_MEMBER' } };
    render(<MemoryRouter initialEntries={['/admin']}><Routes>
      <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><p>Admin content</p></ProtectedRoute>} />
      <Route path="/dashboard" element={<p>Participant destination</p>} />
    </Routes></MemoryRouter>);
    expect(await screen.findByText('Participant destination')).toBeTruthy();
  });
  it('submits explicit participant provisioning and refreshes server membership', async () => {
    fixture.auth = { loading: false, identityAuthenticated: true, authError: 'CLERK_ACCOUNT_UNLINKED', refreshUser: vi.fn(), logout: vi.fn() };
    fixture.post.mockResolvedValue({});
    render(<MemoryRouter><AuthCompletePage /></MemoryRouter>);
    fireEvent.click(screen.getByText('New participant'));
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'fixture_new' } });
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Synthetic Fixture' } });
    fireEvent.click(screen.getByText('Register participant'));
    await waitFor(() => expect(fixture.post).toHaveBeenCalledWith('/auth/clerk/register', { username: 'fixture_new', fullName: 'Synthetic Fixture' }));
    expect(fixture.auth.refreshUser).toHaveBeenCalled();
  });
});

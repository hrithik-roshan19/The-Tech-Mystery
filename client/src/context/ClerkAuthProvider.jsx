import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ClerkProvider, useAuth as useClerkAuth, useClerk } from '@clerk/react';
import { AuthContext, LegacyAuthProvider } from './AuthContext';
import api, { setSessionTokenGetter, isClerkMode } from '../services/api';

export function ClerkBridge({ children }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const clerk = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const revision = useRef(0);
  const refreshUser = useCallback(async () => {
    const requestRevision = ++revision.current;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (requestRevision !== revision.current) return;
      setUser(res.data.data.user);
      setAuthError(null);
    } catch (error) {
      if (requestRevision !== revision.current) return;
      setUser(null);
      setAuthError(error.response?.data?.errorCode || 'ACCOUNT_VERIFICATION_FAILED');
    } finally { if (requestRevision === revision.current) setLoading(false); }
  }, [getToken]);
  useEffect(() => {
    setSessionTokenGetter(getToken);
    if (!isLoaded) return;
    if (isSignedIn) refreshUser();
    else { setUser(null); setAuthError(null); setLoading(false); }
    return () => { revision.current++; setSessionTokenGetter(null); };
  }, [isLoaded, isSignedIn, getToken, refreshUser]);
  useEffect(() => {
    const clear = () => { revision.current++; setUser(null); setLoading(false); setAuthError('ACCOUNT_VERIFICATION_FAILED'); };
    window.addEventListener('htg:unauthorized', clear);
    return () => window.removeEventListener('htg:unauthorized', clear);
  }, []);
  const logout = async () => {
    revision.current++;
    setUser(null);
    await clerk.signOut({ redirectUrl: '/login' });
  };
  return <AuthContext.Provider value={{ user, token: null, loading: !isLoaded || loading,
    identityAuthenticated: !!isSignedIn, isAuthenticated: !!isSignedIn && !!user,
    isAdmin: user?.role === 'ADMIN', hasTeam: !!user?.teamId, authError,
    refreshUser, login: refreshUser, updateTeamMembership: refreshUser, logout,
    manageAccount: () => clerk.openUserProfile() }}>{children}</AuthContext.Provider>;
}

function ClerkSessionBoundary({ children }) {
  const { sessionId } = useClerkAuth();
  return <ClerkBridge key={sessionId || 'signed-out'}>{children}</ClerkBridge>;
}

export function AuthProvider({ children }) {
  if (import.meta.env.VITE_AUTH_PROVIDER === 'jwt') return <LegacyAuthProvider>{children}</LegacyAuthProvider>;
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!isClerkMode() || !/^pk_(test|live)_/.test(key || '')) {
    return <main role="alert">Authentication is not configured. Contact an organizer.</main>;
  }
  return <ClerkProvider publishableKey={key} signInUrl="/login" signUpUrl="/register"
    signInForceRedirectUrl="/auth/complete" signUpForceRedirectUrl="/auth/complete">
    <ClerkSessionBoundary>{children}</ClerkSessionBoundary>
  </ClerkProvider>;
}

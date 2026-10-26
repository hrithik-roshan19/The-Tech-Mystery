import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ClerkProvider, useAuth as useClerkAuth, useClerk } from '@clerk/react';
import { AuthContext, LegacyAuthProvider } from './AuthContext';
import api, { setSessionTokenGetter, setCachedToken, isClerkMode } from '../services/api';

export function ClerkBridge({ children }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const clerk = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [initTimeout, setInitTimeout] = useState(false);
  const revision = useRef(0);
  const refreshUser = useCallback(async () => {
    const requestRevision = ++revision.current;
    setLoading(true);
    try {
      let token = await getToken();
      if (!token) {
        token = await getToken({ skipCache: true });
      }
      if (!token) {
        if (requestRevision !== revision.current) return;
        setUser(null);
        setAuthError(null);
        return;
      }
      setCachedToken(token);
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
    if (isLoaded) {
      setInitTimeout(false);
      return;
    }
    const timer = setTimeout(() => {
      setInitTimeout(true);
      setAuthError((prev) => prev || 'CLERK_INIT_FAILED');
    }, 8000);

    const handleScriptError = (event) => {
      const target = event?.target;
      if (target?.tagName === 'SCRIPT' && typeof target?.src === 'string' && target.src.includes('clerk')) {
        setInitTimeout(true);
        setAuthError((prev) => prev || 'CLERK_INIT_FAILED');
      }
    };
    window.addEventListener('error', handleScriptError, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleScriptError, true);
    };
  }, [isLoaded]);

  useEffect(() => {
    const unregister = setSessionTokenGetter(getToken);
    if (!isLoaded) return;
    if (isSignedIn) refreshUser();
    else { setUser(null); setAuthError(null); setLoading(false); }
    return () => {
      revision.current++;
      if (typeof unregister === 'function') unregister();
    };
  }, [isLoaded, isSignedIn, getToken, refreshUser]);
  useEffect(() => {
    const clear = () => { revision.current++; setUser(null); setLoading(false); setAuthError('ACCOUNT_VERIFICATION_FAILED'); };
    window.addEventListener('htg:unauthorized', clear);
    return () => window.removeEventListener('htg:unauthorized', clear);
  }, []);
  const logout = async () => {
    revision.current++;
    setUser(null);
    await clerk?.signOut?.({ redirectUrl: '/login' });
  };
  return <AuthContext.Provider value={{ user, token: null, loading: initTimeout ? false : (!isLoaded || loading),
    identityAuthenticated: !!isSignedIn, isAuthenticated: !!isSignedIn && !!user,
    isAdmin: user?.role === 'ADMIN', hasTeam: !!user?.teamId, authError: initTimeout ? (authError || 'CLERK_INIT_FAILED') : authError,
    initFailed: initTimeout,
    refreshUser, login: refreshUser, updateTeamMembership: refreshUser, logout,
    manageAccount: () => clerk?.openUserProfile?.() }}>{children}</AuthContext.Provider>;
}

function ClerkSessionBoundary({ children }) {
  return <ClerkBridge>{children}</ClerkBridge>;
}

export function AuthProvider({ children }) {
  if (import.meta.env.VITE_AUTH_PROVIDER === 'jwt') return <LegacyAuthProvider>{children}</LegacyAuthProvider>;
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!isClerkMode() || !/^pk_(test|live)_/.test(key || '')) {
    return <main role="alert">Authentication is not configured. Contact an organizer.</main>;
  }

  // Derive proxyUrl:
  // In deployed environments (e.g. Vercel) or when using pk_live_, route through /.__clerk proxy.
  // On local dev (localhost / 127.0.0.1) with pk_test_, leave undefined so it uses direct dev FAPI.
  const isLocalDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]'
  );
  const proxyUrl = import.meta.env.VITE_CLERK_PROXY_URL || (!isLocalDev || key.startsWith('pk_live_') ? '/.__clerk' : undefined);

  return <ClerkProvider publishableKey={key} proxyUrl={proxyUrl} signInUrl="/login" signUpUrl="/register"
    signInForceRedirectUrl="/auth/complete" signUpForceRedirectUrl="/auth/complete">
    <ClerkSessionBoundary>{children}</ClerkSessionBoundary>
  </ClerkProvider>;
}

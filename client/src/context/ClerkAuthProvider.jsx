import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import { ClerkProvider, useAuth as useClerkAuth, useClerk } from '@clerk/react';
import { AuthContext, LegacyAuthProvider } from './AuthContext';
import api, { setSessionTokenGetter, setCachedToken, isClerkMode } from '../services/api';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function ClerkBridge({ children }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const clerk = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [initTimeout, setInitTimeout] = useState(false);
  const revision = useRef(0);
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const activeRefreshPromiseRef = useRef(null);

  // Synchronously register token getter in layout phase before child effects run
  useIsomorphicLayoutEffect(() => {
    const unregister = setSessionTokenGetter(getToken);
    return () => {
      if (typeof unregister === 'function') unregister();
    };
  }, [getToken]);

  const refreshUser = useCallback(async () => {
    // Deduplicate concurrent refreshUser executions
    if (activeRefreshPromiseRef.current) {
      return activeRefreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      const requestRevision = ++revision.current;
      setLoading(true);
      setAuthError(null);

      // 1. Wait for Clerk session readiness and acquire valid session token with bounded retries
      let token = null;
      const maxTokenAttempts = 4;
      for (let attempt = 1; attempt <= maxTokenAttempts; attempt++) {
        if (requestRevision !== revision.current) return;
        try {
          const getter = getTokenRef.current || getToken;
          if (typeof getter === 'function') {
            token = await getter(attempt > 1 ? { skipCache: true } : undefined);
            if (token && typeof token === 'string' && token !== 'null' && token !== 'undefined') {
              break;
            }
          }
        } catch (err) {
          // Session hydration or token fetch may be transitioning; retry
        }
        if (attempt < maxTokenAttempts) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 100));
        }
      }

      if (requestRevision !== revision.current) return;

      if (!token) {
        setUser(null);
        if (isSignedIn) {
          setAuthError('TOKEN_ACQUISITION_FAILED');
        } else {
          setAuthError(null);
        }
        setLoading(false);
        return;
      }

      setCachedToken(token);

      // 2. Query /api/v1/auth/me with bounded retries for transient network or 503 errors
      const maxApiAttempts = 3;
      let lastError = null;

      for (let attempt = 1; attempt <= maxApiAttempts; attempt++) {
        if (requestRevision !== revision.current) return;
        try {
          const res = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (requestRevision !== revision.current) return;
          setUser(res.data.data.user);
          setAuthError(null);
          setLoading(false);
          return;
        } catch (error) {
          lastError = error;

          // Check if request was intentionally canceled or aborted
          const isCanceled = (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED' ||
            String(error?.message || '').toLowerCase().includes('canceled') ||
            String(error?.message || '').toLowerCase().includes('aborted'));

          if (isCanceled || requestRevision !== revision.current) {
            return;
          }

          const status = error.response?.status;
          const isTransientNetwork = !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
          const isTransientServer = status >= 500 && status <= 504;

          // Permanent client errors (401, 403, 404, etc.) should not be retried
          if (!isTransientNetwork && !isTransientServer) {
            break;
          }

          if (attempt < maxApiAttempts) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 200));
          }
        }
      }

      if (requestRevision !== revision.current) return;

      const isCanceled = (lastError?.name === 'CanceledError' || lastError?.code === 'ERR_CANCELED' ||
        String(lastError?.message || '').toLowerCase().includes('canceled') ||
        String(lastError?.message || '').toLowerCase().includes('aborted'));

      if (isCanceled) {
        return;
      }

      setUser(null);

      // Classify error precisely for UI and error boundary handlers
      if (!lastError?.response) {
        setAuthError('NETWORK_ERROR');
      } else if (lastError.response.status === 401) {
        setAuthError(lastError.response.data?.errorCode || 'SESSION_EXPIRED');
      } else if (lastError.response.status === 403) {
        setAuthError(lastError.response.data?.errorCode || 'FORBIDDEN');
      } else if (lastError.response.status >= 500) {
        setAuthError(lastError.response.data?.errorCode || 'SERVER_UNAVAILABLE');
      } else {
        setAuthError(lastError.response.data?.errorCode || 'ACCOUNT_VERIFICATION_FAILED');
      }

      setLoading(false);
    })();

    activeRefreshPromiseRef.current = refreshPromise;
    try {
      return await refreshPromise;
    } finally {
      activeRefreshPromiseRef.current = null;
    }
  }, [getToken, isSignedIn]);

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
    if (!isLoaded) return;
    if (isSignedIn) refreshUser();
    else { setUser(null); setAuthError(null); setLoading(false); }
    return () => {
      revision.current++;
    };
  }, [isLoaded, isSignedIn, refreshUser]);

  useEffect(() => {
    const clear = () => {
      revision.current++;
      activeRefreshPromiseRef.current = null;
      setUser(null);
      setLoading(false);
      setAuthError('SESSION_EXPIRED');
    };
    window.addEventListener('htg:unauthorized', clear);
    return () => window.removeEventListener('htg:unauthorized', clear);
  }, []);
  const logout = async () => {
    revision.current++;
    activeRefreshPromiseRef.current = null;
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
  // On local dev (localhost / 127.0.0.1 / private LAN IPs) with pk_test_, leave undefined so it uses direct dev FAPI.
  const isPrivateOrLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.endsWith('.local') ||
    /^10\./.test(window.location.hostname) ||
    /^192\.168\./.test(window.location.hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(window.location.hostname)
  );
  const proxyUrl = import.meta.env.VITE_CLERK_PROXY_URL || (!isPrivateOrLocalHost || key.startsWith('pk_live_') ? '/.__clerk' : undefined);

  return <ClerkProvider publishableKey={key} proxyUrl={proxyUrl} signInUrl="/login" signUpUrl="/register"
    signInForceRedirectUrl="/auth/complete" signUpForceRedirectUrl="/auth/complete">
    <ClerkSessionBoundary>{children}</ClerkSessionBoundary>
  </ClerkProvider>;
}

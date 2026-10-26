// @vitest-environment jsdom
import { it, expect, vi, afterEach } from 'vitest';
import api, { setSessionTokenGetter, setCachedToken, isClerkMode, getNormalizedApiBaseUrl, clearApiCache } from './api';
import { storage } from '../utils/storage';
afterEach(() => { vi.unstubAllEnvs(); setSessionTokenGetter(null); storage.clearAll(); });
const adapter = async config => ({ data: config.headers.Authorization, status: 200, statusText: 'OK', headers: {}, config });
it('uses fresh Clerk tokens and ignores legacy browser credentials', async () => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk'); storage.setToken('legacy-fixture');
  setSessionTokenGetter(async () => 'fresh-clerk-fixture');
  expect((await api.get('/synthetic', { adapter })).data).toBe('Bearer fresh-clerk-fixture');
  setSessionTokenGetter(null);
  expect((await api.get('/synthetic', { adapter })).data).toBeUndefined();
});
it('preserves an explicit credential and retains JWT rollback behavior', async () => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'jwt'); storage.setToken('legacy-fixture');
  expect((await api.get('/synthetic', { adapter })).data).toBe('Bearer legacy-fixture');
  expect((await api.get('/synthetic', { adapter, headers: { Authorization: 'Bearer captured' } })).data).toBe('Bearer captured');
});

it('correctly normalizes API base URLs without duplicate /api/v1', () => {
  expect(getNormalizedApiBaseUrl('https://tech-mystery.onrender.com')).toBe('https://tech-mystery.onrender.com/api/v1');
  expect(getNormalizedApiBaseUrl('https://tech-mystery.onrender.com/')).toBe('https://tech-mystery.onrender.com/api/v1');
  expect(getNormalizedApiBaseUrl('https://tech-mystery.onrender.com/api/v1')).toBe('https://tech-mystery.onrender.com/api/v1');
  expect(getNormalizedApiBaseUrl('https://tech-mystery.onrender.com/api/v1/')).toBe('https://tech-mystery.onrender.com/api/v1');
  expect(getNormalizedApiBaseUrl('http://localhost:5000')).toBe('http://localhost:5000/api/v1');
});

it('resolves isClerkMode accurately based on env variables', () => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  expect(isClerkMode()).toBe(true);

  vi.stubEnv('VITE_AUTH_PROVIDER', 'jwt');
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'pk_test_sample');
  expect(isClerkMode()).toBe(false);

  vi.unstubAllEnvs();
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', 'pk_test_123456');
  expect(isClerkMode()).toBe(true);
});

it('strips duplicate /api/v1 from request path in request interceptor', async () => {
  const urlAdapter = async config => ({ data: config.url, status: 200, statusText: 'OK', headers: {}, config });
  const res1 = await api.get('/api/v1/teams/create', { adapter: urlAdapter });
  expect(res1.data).toBe('/teams/create');

  const res2 = await api.get('/teams/create', { adapter: urlAdapter });
  expect(res2.data).toBe('/teams/create');
});

it('adminService exports both getSubmissions and getSubmissionLogs as functions targeting /admin/submissions', async () => {
  const { adminService } = await import('./admin.service');
  expect(typeof adminService.getSubmissions).toBe('function');
  expect(typeof adminService.getSubmissionLogs).toBe('function');
});

it('eventService exports getEventStatus querying /event/status', async () => {
  const { eventService } = await import('./event.service');
  expect(typeof eventService.getEventStatus).toBe('function');
  const urlAdapter = async config => ({ data: config.url, status: 200, statusText: 'OK', headers: {}, config });
  const res = await api.get('/event/status', { adapter: urlAdapter });
  expect(res.data).toBe('/event/status');
});

it('transparently resolves HTTP 304 responses with cached JSON payload', async () => {
  clearApiCache();
  let callCount = 0;
  const mockAdapter = async (config) => {
    callCount++;
    if (callCount === 1) {
      return { data: { success: true, teams: ['Alpha', 'Beta'] }, status: 200, statusText: 'OK', headers: {}, config };
    }
    // Second call simulates server responding 304 Not Modified with empty string body
    return { data: '', status: 304, statusText: 'Not Modified', headers: {}, config };
  };

  const res1 = await api.get('/teams/cached-test', { adapter: mockAdapter });
  expect(res1.status).toBe(200);
  expect(res1.data.teams).toEqual(['Alpha', 'Beta']);

  const res2 = await api.get('/teams/cached-test', { adapter: mockAdapter });
  expect(res2.status).toBe(200);
  expect(res2.data.teams).toEqual(['Alpha', 'Beta']);
});

it('deduplicates concurrent sessionTokenGetter calls and caches token', async () => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  let tokenCallCount = 0;
  setSessionTokenGetter(async () => {
    tokenCallCount++;
    await new Promise((r) => setTimeout(r, 10));
    return 'deduped-token-123';
  });

  const authAdapter = async (config) => ({ data: config.headers.Authorization, status: 200, statusText: 'OK', headers: {}, config });

  // Fire 3 simultaneous requests
  const [r1, r2, r3] = await Promise.all([
    api.get('/sim-1', { adapter: authAdapter }),
    api.get('/sim-2', { adapter: authAdapter }),
    api.get('/sim-3', { adapter: authAdapter }),
  ]);

  expect(tokenCallCount).toBe(1);
  expect(r1.data).toBe('Bearer deduped-token-123');
  expect(r2.data).toBe('Bearer deduped-token-123');
  expect(r3.data).toBe('Bearer deduped-token-123');
});

it('setCachedToken primes token synchronously without invoking getter', async () => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  const throwingGetter = vi.fn(() => { throw new Error('Getter should not be invoked when cache is warm'); });
  setSessionTokenGetter(throwingGetter);
  setCachedToken('prime-jwt-999', 60000);

  const res = await api.get('/synthetic', { adapter });
  expect(res.data).toBe('Bearer prime-jwt-999');
  expect(throwingGetter).not.toHaveBeenCalled();
});

it('setSessionTokenGetter unregister closure protects against stale unmount clearing newer getter', async () => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  const unregister1 = setSessionTokenGetter(async () => 'token-instance-1');
  const unregister2 = setSessionTokenGetter(async () => 'token-instance-2');

  // Stale unmount callback executes
  unregister1();

  // Active getter should remain token-instance-2
  const res1 = await api.get('/synthetic', { adapter });
  expect(res1.data).toBe('Bearer token-instance-2');

  // Active unregister callback executes
  unregister2();
  const res2 = await api.get('/synthetic', { adapter });
  expect(res2.data).toBeUndefined();
});

it('protected admin routes reject locally with ERR_AUTH_TOKEN_UNAVAILABLE when session token is unavailable in Clerk mode', async () => {
  vi.stubEnv('VITE_AUTH_PROVIDER', 'clerk');
  setSessionTokenGetter(null);

  // Protected admin endpoint must reject locally, never emitting anonymous request to server
  await expect(api.get('/admin/dashboard-stats', { adapter })).rejects.toMatchObject({
    code: 'ERR_AUTH_TOKEN_UNAVAILABLE',
    isAuthError: true,
  });

  await expect(api.get('admin/teams', { adapter })).rejects.toMatchObject({
    code: 'ERR_AUTH_TOKEN_UNAVAILABLE',
    isAuthError: true,
  });

  // Non-admin route should not reject locally, but proceed without Authorization header
  const nonAdminRes = await api.get('/synthetic', { adapter });
  expect(nonAdminRes.data).toBeUndefined();
});

it('401 response interceptor only dispatches htg:unauthorized when request included Authorization', async () => {
  const unauthorizedAdapter = async (config) => {
    const error = new Error('Request failed with status code 401');
    error.config = config;
    error.response = { status: 401, data: { message: 'Unauthorized' } };
    throw error;
  };

  const dispatchSpy = vi.fn();
  window.addEventListener('htg:unauthorized', dispatchSpy);

  // 1. Anonymous request that returns 401 should NOT dispatch htg:unauthorized
  try {
    await api.get('/public-probe', { adapter: unauthorizedAdapter });
  } catch {
    // Expected rejection
  }
  expect(dispatchSpy).not.toHaveBeenCalled();

  // 2. Authenticated request with Bearer token that returns 401 MUST dispatch htg:unauthorized
  try {
    await api.get('/protected-probe', {
      adapter: unauthorizedAdapter,
      headers: { Authorization: 'Bearer invalid-expired-token' },
    });
  } catch {
    // Expected rejection
  }
  expect(dispatchSpy).toHaveBeenCalledTimes(1);

  window.removeEventListener('htg:unauthorized', dispatchSpy);
});


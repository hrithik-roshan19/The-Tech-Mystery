import { it, expect, vi, afterEach } from 'vitest';
import api, { setSessionTokenGetter, isClerkMode, getNormalizedApiBaseUrl } from './api';
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

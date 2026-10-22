import { it, expect, vi, afterEach } from 'vitest';
import api, { setSessionTokenGetter } from './api';
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

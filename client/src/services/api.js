import axios from 'axios';
import { storage } from '../utils/storage';

let sessionTokenGetter = null;
let inflightTokenPromise = null;
let cachedSessionToken = null;
let tokenExpiresAt = 0;

export const setSessionTokenGetter = (getter) => {
  sessionTokenGetter = getter;
  if (!getter) {
    cachedSessionToken = null;
    tokenExpiresAt = 0;
    inflightTokenPromise = null;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('htg:unauthorized', () => {
    cachedSessionToken = null;
    tokenExpiresAt = 0;
    inflightTokenPromise = null;
  });
}

/**
 * Determine if Clerk authentication is active.
 * Defaults to Clerk when VITE_CLERK_PUBLISHABLE_KEY is present unless explicitly set to 'jwt'.
 */
export const isClerkMode = () => {
  const provider = import.meta.env.VITE_AUTH_PROVIDER;
  if (provider === 'jwt') return false;
  if (provider === 'clerk') return true;
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return /^pk_(test|live)_/.test(key || '');
};

/**
 * Normalizes the API base URL to ensure /api/v1 is present and not duplicated.
 */
export const getNormalizedApiBaseUrl = (raw) => {
  const input = (raw !== undefined ? raw : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1')).trim();
  const stripped = input.replace(/\/+$/, '');
  return stripped.endsWith('/api/v1') ? stripped : `${stripped}/api/v1`;
};

const API_BASE_URL = getNormalizedApiBaseUrl();

// In-memory cache for GET responses to support HTTP 304 Not Modified transparently
const responseCache = new Map();

export const clearApiCache = () => {
  responseCache.clear();
};

const getCacheKey = (config) => {
  if (!config) return null;
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') return null;
  const url = config.url || '';
  const paramsStr = config.params ? JSON.stringify(config.params) : '';
  return `htg_api_cache:${url}:${paramsStr}`;
};

const getFromCache = (cacheKey) => {
  if (!cacheKey) return null;
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const raw = window.sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        responseCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {
      // ignore storage access errors
    }
  }
  return null;
};

const saveToCache = (cacheKey, data) => {
  if (!cacheKey || data === undefined || data === null || data === '') return;
  responseCache.set(cacheKey, data);
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      // ignore storage quota errors
    }
  }
};

const isDataEmpty = (data) => {
  if (data === undefined || data === null || data === '') return true;
  if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) return true;
  return false;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
});

/**
 * Safely acquire the session token:
 * - Deduplicates concurrent calls to sessionTokenGetter()
 * - Enforces a 4-second safety timeout so requests never hang in the interceptor
 * - Caches the token for 30s in memory to avoid Clerk /tokens rate limits
 */
const getSafeToken = async () => {
  if (!isClerkMode()) {
    return storage.getToken();
  }
  if (!sessionTokenGetter || typeof sessionTokenGetter !== 'function') {
    return null;
  }

  const now = Date.now();
  if (cachedSessionToken && now < tokenExpiresAt) {
    return cachedSessionToken;
  }

  if (inflightTokenPromise) {
    return inflightTokenPromise;
  }

  inflightTokenPromise = (async () => {
    try {
      const tokenPromiseWithTimeout = Promise.race([
        sessionTokenGetter(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Clerk session token acquisition timed out (4000ms)')), 4000)
        ),
      ]);
      const token = await tokenPromiseWithTimeout;
      if (token && typeof token === 'string' && token !== 'null' && token !== 'undefined') {
        cachedSessionToken = token;
        tokenExpiresAt = Date.now() + 30000;
        return token;
      }
      return null;
    } catch (err) {
      console.warn('Session token acquisition warning:', err?.message || err);
      return cachedSessionToken || null;
    } finally {
      inflightTokenPromise = null;
    }
  })();

  return inflightTokenPromise;
};

// Request interceptor to attach token and prevent duplicate /api/v1 prefixes
api.interceptors.request.use(
  async (config) => {
    // Avoid accidental /api/v1 duplication if the request path also included /api/v1
    if (config.url) {
      config.url = config.url.replace(/^\/?api\/v1\/?/, '/');
    }

    // Clean up empty, null or undefined Authorization headers
    if (config.headers?.Authorization) {
      const raw = String(config.headers.Authorization).trim();
      if (raw === 'Bearer' || raw === 'Bearer null' || raw === 'Bearer undefined') {
        delete config.headers.Authorization;
      }
    }

    const token = await getSafeToken();

    if (token && typeof token === 'string' && token !== 'null' && token !== 'undefined' && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle cached 304s and unauthenticated 401 responses
api.interceptors.response.use(
  async (response) => {
    const cacheKey = getCacheKey(response.config);
    if (cacheKey) {
      if (response.status === 304) {
        if (isDataEmpty(response.data)) {
          const cached = getFromCache(cacheKey);
          if (cached) {
            response.data = cached;
            response.status = 200;
            return response;
          }
          // If no cached body exists, retry once with cache-busting to force the full body
          if (!response.config._retry304) {
            response.config._retry304 = true;
            response.config.headers = response.config.headers || {};
            response.config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            response.config.headers['Pragma'] = 'no-cache';
            delete response.config.headers['If-None-Match'];
            delete response.config.headers['if-none-match'];

            // Cache-bust the URL so the native browser network stack bypasses disk ETag cache
            const separator = response.config.url.includes('?') ? '&' : '?';
            response.config.url = `${response.config.url}${separator}_t=${Date.now()}`;

            return api.request(response.config);
          }
          const empty304Error = new Error('Cached 304 response with empty payload');
          empty304Error.response = response;
          return Promise.reject(empty304Error);
        }
      } else if (response.status >= 200 && response.status < 300 && response.data) {
        saveToCache(cacheKey, response.data);
      }
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    if (error.response && error.response.status === 304 && config) {
      const cacheKey = getCacheKey(config);
      const cached = getFromCache(cacheKey);
      if (cached) {
        return {
          ...error.response,
          status: 200,
          statusText: 'OK (Cached 304)',
          data: cached,
        };
      }
      if (!config._retry304) {
        config._retry304 = true;
        config.headers = config.headers || {};
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        delete config.headers['If-None-Match'];
        delete config.headers['if-none-match'];

        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}_t=${Date.now()}`;

        return api.request(config);
      }
    }

    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      cachedSessionToken = null;
      tokenExpiresAt = 0;
      if (!isClerkMode()) storage.clearAll();
      window.dispatchEvent(new Event('htg:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

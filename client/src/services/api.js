import axios from 'axios';
import { storage } from '../utils/storage';

let sessionTokenGetter = null;
export const setSessionTokenGetter = getter => { sessionTokenGetter = getter; };

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

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach token and prevent duplicate /api/v1 prefixes
api.interceptors.request.use(
  async (config) => {
    // Avoid accidental /api/v1 duplication if the request path also included /api/v1
    if (config.url) {
      config.url = config.url.replace(/^\/?api\/v1\/?/, '/');
    }

    const token = isClerkMode()
      ? await sessionTokenGetter?.()
      : storage.getToken();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid (JWT mode only)
      if (!isClerkMode()) storage.clearAll();
      window.dispatchEvent(new Event('htg:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

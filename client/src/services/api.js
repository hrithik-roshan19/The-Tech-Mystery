import axios from 'axios';
import { storage } from '../utils/storage';

let sessionTokenGetter = null;
export const setSessionTokenGetter = getter => { sessionTokenGetter = getter; };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    const token = import.meta.env.VITE_AUTH_PROVIDER === 'clerk'
      ? await sessionTokenGetter?.() : storage.getToken();
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
      // Clear token if expired or invalid
      if (import.meta.env.VITE_AUTH_PROVIDER !== 'clerk') storage.clearAll();
      window.dispatchEvent(new Event('htg:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;


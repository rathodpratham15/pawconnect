import axios, { AxiosError } from 'axios';
import { clearAuth, getToken, isBrowser } from './auth';

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  return url.replace(/\/+$/, '');
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (isBrowser() && error.response?.status === 401) {
      const existingToken = getToken();
      if (existingToken) {
        clearAuth();
        // Redirect to login preserving original path if applicable
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/signup') {
          window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

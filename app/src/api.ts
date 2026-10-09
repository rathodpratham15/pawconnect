import axios from 'axios';
import { clearSession, getToken } from './auth';

// Backend base URL, configured per environment (see .env.example)
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3002').replace(/\/$/, '');

export const GOOGLE_MAPS_API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

// Defined once so the Maps script isn't reloaded because of a new array on every render
export const GOOGLE_MAPS_LIBRARIES: ('places')[] = ['places'];

const api = axios.create({ baseURL: API_URL });

// Attach the JWT to every request when the user is logged in
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired/invalid token sends the user back to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearSession();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default api;

import { User } from './types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const isBrowser = (): boolean => typeof window !== 'undefined';

export const getToken = (): string | null => {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to set token:', e);
  }
};

export const getUser = (): User | null => {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUser = (user: User): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to set user:', e);
  }
};

export const clearAuth = (): void => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to clear auth:', e);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const hasRole = (role: string): boolean => {
  const user = getUser();
  return user?.role === role;
};

export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  address?: string;
  role: 'USER' | 'NGO' | 'ADMIN';
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getUser = (): SessionUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = (): boolean => Boolean(getToken());

export const saveSession = (token: string, user: SessionUser): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

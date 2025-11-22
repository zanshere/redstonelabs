// src/lib/auth.ts
export interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  username: string;
  photo?: string;
}

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth/login';
};

export const getUserRole = (): string | null => {
  const user = getStoredUser();
  return user?.role || null;
};

export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role?.toUpperCase() === 'ADMIN';
};
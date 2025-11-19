// src/lib/auth/types.ts

/**
 * Authentication-related type definitions
 */

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: string;
  phoneNumber?: string;
  photo?: string;
  companyName?: string;
  address?: string;
  taxId?: string;
  workosId?: string;
  oauthProvider?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token: string | null;
  requiresMFA?: boolean;
}

export interface MFAConfig {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface OAuthUser {
  provider: string;
  id: string;
  email: string;
  name: string;
  picture?: string;
  username?: string;
  accessToken?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
  clearError: () => void;
  error: string | null;
}

export interface OAuthResponse {
  user: User;
  token: string;
  requiresMFA?: boolean;
}
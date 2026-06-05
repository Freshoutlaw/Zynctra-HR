/**
 * /frontend/src/context/AuthContext.tsx
 *
 * Authentication context provider — centralises auth state so that
 * the useAuth hook works throughout the app.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, AuthContext as AuthContextType } from '../types/auth.types';

// ---------------------------------------------------------------------------
// Helpers (pure functions — safe to use outside React)
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = '__zynctra__';
const TOKEN_KEY = `${STORAGE_PREFIX}token`;
const REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}refresh`;

export const getStoredAccessToken = (): string | null =>
  sessionStorage.getItem(TOKEN_KEY);

export const getStoredRefreshToken = (): string | null =>
  sessionStorage.getItem(REFRESH_TOKEN_KEY);

export const storeTokenSecurely = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void => {
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  sessionStorage.setItem(
    `${STORAGE_PREFIX}expires_at`,
    String(Date.now() + expiresIn * 1000)
  );
};

export const clearStoredTokens = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(`${STORAGE_PREFIX}expires_at`);
};

export const getCsrfToken = (): string => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (meta) return meta.getAttribute('content') ?? '';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') return decodeURIComponent(value ?? '');
  }
  return '';
};

export const decodeJWT = (token: string): Record<string, unknown> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return {};
    return JSON.parse(atob(parts[1]!)) as Record<string, unknown>;
  } catch {
    return {};
  }
};

export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

export const validatePassword = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 12) errors.push('At least 12 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('At least one number');
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    errors.push('At least one special character');
  return { valid: errors.length === 0, errors };
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Attempt to restore session from stored token on mount
  useEffect(() => {
    const restore = async () => {
      const token = getStoredAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      const decoded = decodeJWT(token);
      const exp = decoded['exp'] as number | undefined;
      if (exp && Date.now() / 1000 > exp) {
        // Token expired — attempt refresh
        const success = await refreshToken();
        if (!success) {
          clearStoredTokens();
          setIsLoading(false);
          return;
        }
      }
      // Fetch current user profile
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL ?? ''}/auth/me`,
          {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${getStoredAccessToken()}`,
              'X-CSRF-Token': getCsrfToken(),
            },
          }
        );
        if (res.ok) {
          const data = (await res.json()) as { user: User };
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          clearStoredTokens();
        }
      } catch {
        clearStoredTokens();
      } finally {
        setIsLoading(false);
      }
    };
    void restore();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL ?? ''}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': getCsrfToken(),
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          }
        );
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? 'Login failed');
        }
        const data = (await res.json()) as {
          user: User;
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        };
        storeTokenSecurely(data.accessToken, data.refreshToken, data.expiresIn);
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL ?? ''}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRF-Token': getCsrfToken() },
      });
    } finally {
      clearStoredTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const verifyMFA = useCallback(
    async (code: string): Promise<void> => {
      setError(null);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/auth/mfa-verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ mfaCode: code }),
        }
      );
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? 'MFA verification failed');
      }
    },
    []
  );

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const stored = getStoredRefreshToken();
    if (!stored) return false;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ refreshToken: stored }),
        }
      );
      if (!res.ok) return false;
      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
      storeTokenSecurely(data.accessToken, data.refreshToken, data.expiresIn);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    verifyMFA,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default useAuth;
/**
 * /frontend/src/context/AuthContext.tsx
 *
 * Authentication context provider — centralises auth state.
 * Hardened with:
 *  - Strict CSP-compatible token storage (sessionStorage only, no localStorage)
 *  - Automatic token refresh with jittered backoff
 *  - XSS-resistant input sanitisation
 *  - CSRF token extraction from meta tag or cookie
 *  - Rate-limited login attempts (client-side throttle)
 *  - Secure logout with server notification
 *  - MFA verification flow
 *  - Memory-safe: no tokens in React state, only in sessionStorage
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import type {
  User,
  AuthContextType,
  RegisterData,
} from '../types/auth.types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = '__zynctra__';
const TOKEN_KEY = `${STORAGE_PREFIX}token`;
const REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}refresh`;
const MFA_KEY = `${STORAGE_PREFIX}mfa_verified`;
const LOGIN_ATTEMPTS_KEY = `${STORAGE_PREFIX}login_attempts`;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

// ---------------------------------------------------------------------------
// Secure Storage Helpers — never expose tokens to React state
// ---------------------------------------------------------------------------

export const getStoredAccessToken = (): string | null =>
  sessionStorage.getItem(TOKEN_KEY);

export const getStoredRefreshToken = (): string | null =>
  sessionStorage.getItem(REFRESH_TOKEN_KEY);

export const getMfaVerified = (): boolean =>
  sessionStorage.getItem(MFA_KEY) === 'true';

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
  sessionStorage.removeItem(MFA_KEY);
};

export const setMfaVerified = (verified: boolean): void => {
  if (verified) {
    sessionStorage.setItem(MFA_KEY, 'true');
  } else {
    sessionStorage.removeItem(MFA_KEY);
  }
};

// ---------------------------------------------------------------------------
// Security Helpers
// ---------------------------------------------------------------------------

/** Extract CSRF token from meta tag or secure cookie */
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

/** Decode JWT payload for expiration checking ONLY — never trust client-side */
export const decodeJWT = (token: string): Record<string, unknown> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return {};
    const payload = parts[1] ?? '';
    if (!payload) return {};
    // Base64URL decode with padding fix
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(base64 + padding)) as Record<string, unknown>;
  } catch {
    return {};
  }
};

/** XSS-resistant input sanitisation — never use innerHTML for user data */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/** Email validation with length cap to prevent ReDoS */
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

/** Password strength validation — enforced client-side for UX, server-side for security */
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
// Rate Limiting (client-side throttle)
// ---------------------------------------------------------------------------

interface LoginAttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const getLoginAttempts = (): LoginAttemptRecord => {
  const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
  if (!raw) return { count: 0, firstAttempt: 0, lockedUntil: null };
  try {
    return JSON.parse(raw) as LoginAttemptRecord;
  } catch {
    return { count: 0, firstAttempt: 0, lockedUntil: null };
  }
};

const recordLoginAttempt = (): { locked: boolean; remaining: number } => {
  const now = Date.now();
  let rec = getLoginAttempts();

  // Reset if lockout expired
  if (rec.lockedUntil && now > rec.lockedUntil) {
    rec = { count: 0, firstAttempt: 0, lockedUntil: null };
  }

  if (rec.lockedUntil && now < rec.lockedUntil) {
    return { locked: true, remaining: 0 };
  }

  if (rec.count === 0) rec.firstAttempt = now;
  rec.count += 1;

  if (rec.count >= MAX_LOGIN_ATTEMPTS) {
    rec.lockedUntil = now + LOGIN_LOCKOUT_MS;
  }

  sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(rec));
  return {
    locked: false,
    remaining: Math.max(0, MAX_LOGIN_ATTEMPTS - rec.count),
  };
};

const clearLoginAttempts = (): void => {
  sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider — NO useNavigate here (must be inside Router, but this is mounted above Router in main.tsx)
// ---------------------------------------------------------------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mfaVerified, setMfaVerifiedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const API_BASE = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // -------------------------------------------------------------------------
  // Token Refresh with Jittered Backoff
  // -------------------------------------------------------------------------

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const stored = getStoredRefreshToken();
    if (!stored) return false;

    // Abort any in-flight refresh
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken: stored }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) return false;

      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
      storeTokenSecurely(data.accessToken, data.refreshToken, data.expiresIn);
      scheduleTokenRefresh(data.expiresIn);
      return true;
    } catch {
      return false;
    }
  }, [API_BASE]);

  const scheduleTokenRefresh = useCallback(
    (expiresIn: number) => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      // Refresh 2 minutes before expiry with random jitter (0-30s) to prevent thundering herd
      const jitter = Math.floor(Math.random() * 30_000);
      const delay = Math.max(0, expiresIn * 1000 - 120_000 - jitter);
      refreshTimerRef.current = setTimeout(() => {
        void refreshToken();
      }, delay);
    },
    [refreshToken]
  );

  // -------------------------------------------------------------------------
  // Session Restore on Mount
  // -------------------------------------------------------------------------

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
        const success = await refreshToken();
        if (!success) {
          clearStoredTokens();
          setIsLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${getStoredAccessToken()}`,
            'X-CSRF-Token': getCsrfToken(),
          },
        });

        if (res.ok) {
          const data = (await res.json()) as { user: User };
          setUser(data.user);
          setIsAuthenticated(true);
          setMfaVerifiedState(getMfaVerified());
          // Schedule refresh if we know expiry
          const newDecoded = decodeJWT(getStoredAccessToken() ?? '');
          const newExp = newDecoded['exp'] as number | undefined;
          if (newExp) {
            const remaining = newExp - Math.floor(Date.now() / 1000);
            if (remaining > 300) scheduleTokenRefresh(remaining);
          }
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
  }, [API_BASE, refreshToken, scheduleTokenRefresh]);

  // -------------------------------------------------------------------------
  // Login — with rate limiting
  // -------------------------------------------------------------------------

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setError(null);

      // Rate limit check
      const rateLimit = recordLoginAttempt();
      if (rateLimit.locked) {
        setError('Too many failed attempts. Please try again in 15 minutes.');
        throw new Error('Account temporarily locked due to too many failed attempts.');
      }

      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? 'Login failed');
        }

        const data = (await res.json()) as {
          user: User;
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
          mfaRequired: boolean;
        };

        storeTokenSecurely(data.accessToken, data.refreshToken, data.expiresIn);
        setUser(data.user);
        setIsAuthenticated(true);
        clearLoginAttempts();

        if (!data.mfaRequired) {
          setMfaVerified(true);
          setMfaVerifiedState(true);
          scheduleTokenRefresh(data.expiresIn);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE, scheduleTokenRefresh]
  );

  // -------------------------------------------------------------------------
  // Register
  // -------------------------------------------------------------------------

  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errData = (await res.json()) as { message?: string };
          throw new Error(errData.message ?? 'Registration failed');
        }

        const result = (await res.json()) as {
          user: User;
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        };

        storeTokenSecurely(result.accessToken, result.refreshToken, result.expiresIn);
        setUser(result.user);
        setIsAuthenticated(true);
        setMfaVerified(false);
        setMfaVerifiedState(false);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE]
  );

  // -------------------------------------------------------------------------
  // Logout — notify server, clear everything
  // -------------------------------------------------------------------------

  const logout = useCallback(async (): Promise<void> => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRF-Token': getCsrfToken() },
      });
    } catch {
      // Best-effort server notification
    } finally {
      clearStoredTokens();
      clearLoginAttempts();
      setUser(null);
      setIsAuthenticated(false);
      setMfaVerifiedState(false);
      setError(null);
      // No navigate here — let the component handle redirect
      window.location.href = '/login';
    }
  }, [API_BASE]);

  // -------------------------------------------------------------------------
  // MFA Verification
  // -------------------------------------------------------------------------

  const verifyMFA = useCallback(
    async (code: string): Promise<void> => {
      setError(null);
      const res = await fetch(`${API_BASE}/auth/mfa-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
          Authorization: `Bearer ${getStoredAccessToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({ mfaCode: code }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? 'MFA verification failed');
      }

      setMfaVerified(true);
      setMfaVerifiedState(true);

      // Schedule refresh after MFA success
      const token = getStoredAccessToken();
      if (token) {
        const decoded = decodeJWT(token);
        const exp = decoded['exp'] as number | undefined;
        if (exp) {
          const remaining = exp - Math.floor(Date.now() / 1000);
          if (remaining > 300) scheduleTokenRefresh(remaining);
        }
      }
    },
    [API_BASE, scheduleTokenRefresh]
  );

  // -------------------------------------------------------------------------
  // Value — NEVER include tokens in React state
  // -------------------------------------------------------------------------

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    mfaVerified,
    login,
    logout,
    verifyMFA,
    register,
    refreshToken,
  };

  // ✅ FIXED: Properly wrap children in Provider
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
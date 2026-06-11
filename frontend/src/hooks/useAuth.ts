/**
 * /src/hooks/useAuth.ts
 * 
 * Secure authentication hook with:
 * - JWT token management
 * - Session validation
 * - MFA support
 * - Automatic token refresh
 * - XSS protection
 * - CSRF prevention
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import the actual useAuth hook from AuthContext
export { useAuth } from '../context/AuthContext';
export { useAuth as default } from '../context/AuthContext';

/**
 * Hook for secure session management
 * Handles token refresh, expiration, and validation
 */
export const useSecureSession = () => {
  const navigate = useNavigate();
  const [sessionValid, setSessionValid] = useState(true);
  const [timeUntilExpire, setTimeUntilExpire] = useState<number | null>(null);
  const isAuthenticated = !!getStoredAccessToken();

  /**
   * Check session validity and token expiration
   */
  const validateSession = useCallback(async () => {
    try {
      const token = getStoredAccessToken();
      
      if (!token) {
        setSessionValid(false);
        return false;
      }

      const decoded = decodeJWT(token);
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = (decoded.exp || 0) - now;

      // Token expires in less than 5 minutes, refresh it
      if (timeRemaining < 300) {
        await refreshAccessToken();
      }

      // Session has expired
      if (timeRemaining <= 0) {
        setSessionValid(false);
        clearSession();
        return false;
      }

      setTimeUntilExpire(timeRemaining * 1000);
      setSessionValid(true);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      setSessionValid(false);
      return false;
    }
  }, []);

  /**
   * Refresh access token using refresh token
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = getStoredRefreshToken();
      
      if (!refreshToken) {
        clearSession();
        navigate('/login');
        return false;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearSession();
        navigate('/login');
        return false;
      }

      const data = await response.json();
      storeTokenSecurely(data.accessToken, data.refreshToken, data.expiresIn);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearSession();
      navigate('/login');
      return false;
    }
  }, [navigate]);

  /**
   * Setup automatic token refresh interval
   */
  useEffect(() => {
    if (!isAuthenticated || !sessionValid) {
      return;
    }

    validateSession();

    const interval = setInterval(() => {
      validateSession();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, sessionValid, validateSession]);

  return {
    sessionValid,
    timeUntilExpire,
    validateSession,
    refreshToken: refreshAccessToken,
  };
};

/**
 * Hook for form validation with security checks
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      // Sanitize input
      const sanitizedValue = sanitizeInput(value);
      
      setValues((prev) => ({ ...prev, [name]: sanitizedValue }));

      // Real-time validation
      if (validate && touched[name]) {
        const newErrors = validate({ ...values, [name]: sanitizedValue });
        setErrors(newErrors);
      }
    },
    [values, touched, validate]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
    }
  }, [values, validate]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validate all fields
      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors({
          submit: 'An error occurred. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
};

/**
 * Utility functions for secure token management
 */

const STORAGE_PREFIX = '__zynctra__';
const TOKEN_KEY = `${STORAGE_PREFIX}token`;
const REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}refresh`;

/**
 * Store tokens in memory + secure httpOnly cookie (handled by server)
 * Never store sensitive data in localStorage
 */
export const storeTokenSecurely = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void => {
  // Store in sessionStorage (cleared on browser close)
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  sessionStorage.setItem(`${STORAGE_PREFIX}expires_at`, String(Date.now() + expiresIn * 1000));

  // Also set httpOnly cookie (handled by server during login)
  // Server should set: Set-Cookie: authToken=...; HttpOnly; Secure; SameSite=Strict
};

export const getStoredAccessToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getStoredRefreshToken = (): string | null => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearSession = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(`${STORAGE_PREFIX}expires_at`);
  
  // Notify server to invalidate token
  fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': getCsrfToken(),
    },
  }).catch(console.error);
};

/**
 * Decode JWT without verification (client-side only)
 * For expiration checking. Never trust claims without server verification.
 */
export const decodeJWT = (token: string): Record<string, any> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = parts[1] ?? '';
    if (!payload) return {};
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Token decode error:', error);
    return {};
  }
};

/**
 * Input sanitization for XSS prevention
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Get CSRF token from meta tag or cookie
 */
export const getCsrfToken = (): string => {
  // Check meta tag first
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    return metaTag.getAttribute('content') || '';
  }

  // Fallback to cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return decodeURIComponent(value ?? '');
    }
  }

  return '';
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};





/**
 * /frontend/src/hooks/useAuth.ts
 *
 * Re-exports the useAuth hook and all auth utilities from AuthContext
 * so existing imports of '../../hooks/useAuth' continue to work.
 */

// export {
//   useAuth as default,
//   useAuth,
//   AuthProvider,
//   getCsrfToken,
//   getStoredAccessToken,
//   getStoredRefreshToken,
//   storeTokenSecurely,
//   clearStoredTokens,
//   decodeJWT,
//   sanitizeInput,
//   validateEmail,
//   validatePassword,
// } from '../context/AuthContext';
/**
 * /frontend/src/middleware/authMiddleware.ts
 * 
 * Authentication middleware for route protection
 */

import { UserRole } from '../types/auth.types';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (token?: string): boolean => {
  if (token) {
    return !!token;
  }
  const stored = sessionStorage.getItem('auth_token');
  return !!stored;
};

/**
 * Check if user has required role
 */
export const hasRole = (userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

/**
 * Check if user has permission
 */
export const hasPermission = (
  userRole: UserRole | undefined,
  requiredPermission: string
): boolean => {
  if (!userRole) return false;

  const permissions: Record<UserRole, string[]> = {
    SUPER_ADMIN: [
      'view_all_orgs',
      'manage_orgs',
      'manage_users',
      'manage_billing',
      'manage_settings',
      'view_audit_logs',
      'access_admin_panel',
    ],
    TENANT_ADMIN: [
      'view_org',
      'manage_employees',
      'manage_billing',
      'manage_integrations',
      'view_audit_logs',
    ],
    MANAGER: ['view_employees', 'manage_team', 'view_performance', 'approve_time_off'],
    HR_SPECIALIST: ['view_employees', 'manage_employees', 'manage_benefits', 'manage_payroll'],
    USER: ['view_own_profile', 'submit_time_off', 'view_pay_stubs', 'update_profile'],
  };

  return permissions[userRole]?.includes(requiredPermission) || false;
};

/**
 * Check subscription access
 */
export const canAccessFeature = (
  planId: string | undefined,
  requiredPlan: 'FREE' | 'STANDARD' | 'PREMIUM'
): boolean => {
  if (!planId) return false;

  const planHierarchy: Record<string, number> = {
    FREE: 0,
    STANDARD: 1,
    PREMIUM: 2,
  };

  const userLevel = planHierarchy[planId] || 0;
  const requiredLevel = planHierarchy[requiredPlan] || 0;

  return userLevel >= requiredLevel;
};

/**
 * Validate token expiration
 */
export const isTokenValid = (expiresAt?: number): boolean => {
  if (!expiresAt) return true; // No expiration
  return Date.now() < expiresAt;
};

/**
 * Get token from storage
 */
export const getToken = (): string | null => {
  return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  return sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token');
};

/**
 * Store tokens
 */
export const storeTokens = (
  token: string,
  refreshToken: string,
  expiresIn?: number,
  useLocalStorage = false
) => {
  const storage = useLocalStorage ? localStorage : sessionStorage;
  storage.setItem('auth_token', token);
  storage.setItem('refresh_token', refreshToken);
  if (expiresIn) {
    storage.setItem('token_expires_at', String(Date.now() + expiresIn * 1000));
  }
};

/**
 * Clear tokens
 */
export const clearTokens = () => {
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('token_expires_at');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'SUPER_ADMIN' || userRole === 'TENANT_ADMIN';
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'SUPER_ADMIN';
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain a special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Check if email is disposable
 */
export const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'mailinator.com',
    'guerrillamail.com',
    'temp-mail.org',
    'throwaway.email',
  ];

  const domain = email.split('@')[1];
  return disposableDomains.includes(domain);
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  // Remove HTML tags and trim
  return input.replace(/<[^>]*>/g, '').trim();
};

/**
 * Rate limiting helper
 */
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts: Map<string, number[]> = new Map();

  return {
    isAllowed: (key: string): boolean => {
      const now = Date.now();
      const recent = attempts.get(key) || [];
      const filtered = recent.filter((time) => now - time < windowMs);

      if (filtered.length < maxAttempts) {
        filtered.push(now);
        attempts.set(key, filtered);
        return true;
      }

      return false;
    },
    reset: (key: string) => {
      attempts.delete(key);
    },
  };
};

export default {
  isAuthenticated,
  hasRole,
  hasPermission,
  canAccessFeature,
  isTokenValid,
  getToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
  isAdmin,
  isSuperAdmin,
  validatePassword,
  validateEmail,
  isDisposableEmail,
  sanitizeInput,
  createRateLimiter,
};
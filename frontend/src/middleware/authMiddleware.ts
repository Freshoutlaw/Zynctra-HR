/**
 * /frontend/src/middleware/authMiddleware.ts
 *
 * Authentication middleware utilities for route protection.
 * Fixed: uses import.meta.env; no duplicate getCsrfToken definition.
 */

import type { UserRole } from '../types/auth.types';
import { getStoredAccessToken, getStoredRefreshToken, decodeJWT } from '../context/AuthContext';

export const isAuthenticated = (): boolean => !!getStoredAccessToken();

export const hasRole = (
  userRole: UserRole | undefined,
  requiredRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

export const hasPermission = (
  userRole: UserRole | undefined,
  requiredPermission: string
): boolean => {
  if (!userRole) return false;

  const permissions: Partial<Record<UserRole, string[]>> = {
    [UserRole.SUPER_ADMIN]: [
      'view_all_orgs',
      'manage_orgs',
      'manage_users',
      'manage_billing',
      'manage_settings',
      'view_audit_logs',
      'access_admin_panel',
    ],
    [UserRole.TENANT_ADMIN]: [
      'view_org',
      'manage_employees',
      'manage_billing',
      'manage_integrations',
      'view_audit_logs',
    ],
    [UserRole.MANAGER]: [
      'view_employees',
      'manage_team',
      'view_performance',
      'approve_time_off',
    ],
    [UserRole.HR_MANAGER]: [
      'view_employees',
      'manage_employees',
      'manage_benefits',
      'manage_payroll',
    ],
    [UserRole.EMPLOYEE]: [
      'view_own_profile',
      'submit_time_off',
      'view_pay_stubs',
      'update_profile',
    ],
  };

  return permissions[userRole]?.includes(requiredPermission) ?? false;
};

export const canAccessFeature = (
  planId: string | undefined,
  requiredPlan: 'FREE' | 'STANDARD' | 'PREMIUM'
): boolean => {
  if (!planId) return false;
  const hierarchy: Record<string, number> = { FREE: 0, STANDARD: 1, PREMIUM: 2 };
  return (hierarchy[planId] ?? 0) >= (hierarchy[requiredPlan] ?? 0);
};

export const isTokenExpired = (): boolean => {
  const token = getStoredAccessToken();
  if (!token) return true;
  const decoded = decodeJWT(token);
  const exp = decoded['exp'] as number | undefined;
  if (!exp) return false;
  return Date.now() / 1000 > exp;
};

export { getStoredAccessToken as getToken, getStoredRefreshToken as getRefreshToken };

export const storeTokens = (
  token: string,
  refreshToken: string,
  expiresIn?: number,
  useLocalStorage = false
): void => {
  const storage = useLocalStorage ? localStorage : sessionStorage;
  storage.setItem('auth_token', token);
  storage.setItem('refresh_token', refreshToken);
  if (expiresIn) {
    storage.setItem('token_expires_at', String(Date.now() + expiresIn * 1000));
  }
};

export const clearTokens = (): void => {
  ['auth_token', 'refresh_token', 'token_expires_at'].forEach((k) => {
    sessionStorage.removeItem(k);
    localStorage.removeItem(k);
  });
};

export const isAdmin = (role?: UserRole): boolean =>
  role === UserRole.SUPER_ADMIN || role === UserRole.TENANT_ADMIN;

export const isSuperAdmin = (role?: UserRole): boolean =>
  role === UserRole.SUPER_ADMIN;

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 12) errors.push('At least 12 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('At least one number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push('At least one special character');
  return { isValid: errors.length === 0, errors };
};

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isDisposableEmail = (email: string): boolean => {
  const disposable = new Set([
    'tempmail.com',
    '10minutemail.com',
    'mailinator.com',
    'guerrillamail.com',
    'temp-mail.org',
    'throwaway.email',
  ]);
  return disposable.has(email.split('@')[1] ?? '');
};

export const sanitizeInput = (input: string): string =>
  input.replace(/<[^>]*>/g, '').trim();

export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, number[]>();
  return {
    isAllowed(key: string): boolean {
      const now = Date.now();
      const recent = (attempts.get(key) ?? []).filter(
        (t) => now - t < windowMs
      );
      if (recent.length >= maxAttempts) return false;
      recent.push(now);
      attempts.set(key, recent);
      return true;
    },
    reset(key: string) {
      attempts.delete(key);
    },
  };
};

export default {
  isAuthenticated,
  hasRole,
  hasPermission,
  canAccessFeature,
  isTokenExpired,
  getToken: getStoredAccessToken,
  getRefreshToken: getStoredRefreshToken,
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
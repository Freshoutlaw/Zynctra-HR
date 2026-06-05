/**
 * /frontend/src/utils/constants.ts
 *
 * Application-wide constants.
 */

export const APP_NAME = 'Zynctra';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:8080/api';

export const WS_URL =
  (import.meta.env['VITE_WEBSOCKET_URL'] as string | undefined) ?? 'ws://localhost:8080/ws';

export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const TOAST_DURATION_MS = 5000;

export const PAGINATION_PAGE_SIZE = 20;

export const SUPPORTED_CURRENCIES = ['USD', 'NGN', 'EUR', 'GBP', 'KES', 'GHS'];

export const SUPPORTED_LOCALES = ['en-US', 'en-GB', 'fr-FR'];

export const PASSWORD_MIN_LENGTH = 12;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'image/webp',
];

export const DEBOUNCE_DELAY_MS = 300;

export const ANOMALY_REFRESH_INTERVAL_MS = 30_000;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  SUBSCRIPTION: '/dashboard/subscription',
  PRICING: '/pricing',
  PAYMENT_VERIFY: '/payment-verification',
  ADMIN: '/admin',
} as const;
/**
 * /frontend/src/utils/errorHandler.ts
 *
 * Centralised error parsing and logging utilities.
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export const parseError = (err: unknown): AppError => {
  if (err instanceof Error) {
    return { message: err.message };
  }
  if (typeof err === 'string') {
    return { message: err };
  }
  if (err !== null && typeof err === 'object') {
    const e = err as Record<string, unknown>;
    return {
      message: (e['message'] as string) ?? 'An error occurred',
      ...(typeof e['code'] === 'string' ? { code: e['code'] as string } : {}),
      ...(typeof e['statusCode'] === 'number'
        ? { statusCode: e['statusCode'] as number }
        : {}),
      ...(typeof e['details'] === 'object' && e['details'] !== null
        ? { details: e['details'] as Record<string, unknown> }
        : {}),
    };
  }
  return { message: 'An unexpected error occurred' };
};

export const isNetworkError = (err: unknown): boolean => {
  if (!(err instanceof Error)) return false;
  return err.message.toLowerCase().includes('network') ||
    err.message.toLowerCase().includes('fetch');
};

export const isAuthError = (statusCode: number): boolean =>
  statusCode === 401 || statusCode === 403;

export const logError = (context: string, err: unknown): void => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, err);
  }
  // In production, send to error monitoring (e.g. Sentry)
};

export const getUserFriendlyMessage = (err: unknown): string => {
  const parsed = parseError(err);

  if (parsed.statusCode === 401) return 'Your session has expired. Please log in again.';
  if (parsed.statusCode === 403) return "You don't have permission to perform this action.";
  if (parsed.statusCode === 404) return 'The requested resource was not found.';
  if (parsed.statusCode === 429) return 'Too many requests. Please wait a moment and try again.';
  if (parsed.statusCode && parsed.statusCode >= 500)
    return 'A server error occurred. Please try again later.';
  if (isNetworkError(err)) return 'Network error. Please check your internet connection.';

  return parsed.message;
};

export default {
  parseError,
  isNetworkError,
  isAuthError,
  logError,
  getUserFriendlyMessage,
};
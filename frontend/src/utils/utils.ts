/**
 * /frontend/src/utils/utils.ts
 *
 * Common utility functions — all pure, no React dependencies.
 */

export const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const formatDate = (
  date: string | Date,
  fmt: 'short' | 'long' | 'iso' = 'short'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (fmt === 'long')
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (fmt === 'iso') return d.toISOString().split('T')[0]!;
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
};

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const secs = Math.floor(diffMs / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (secs < 60) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(d, 'short');
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

export const deepClone = <T,>(obj: T): T =>
  JSON.parse(JSON.stringify(obj)) as T;

export const getQueryParams = (url: string): Record<string, string> => {
  const params = new URLSearchParams(new URL(url, window.location.origin).search);
  const result: Record<string, string> = {};
  params.forEach((v, k) => { result[k] = v; });
  return result;
};

export const buildQueryString = (params: Record<string, unknown>): string => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  }
  return qs.toString();
};

export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const truncate = (s: string, length: number, suffix = '…'): string =>
  s.length <= length ? s : s.slice(0, length - suffix.length) + suffix;

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
};

export const getErrorMessage = (err: unknown): string => {
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
};

export const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') return val.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'object') return Object.keys(val as object).length === 0;
  return false;
};

export const sortByKey = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] =>
  [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });

export const groupByKey = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> =>
  arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      (acc[k] ??= []).push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );

export const unique = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): T[] => [...new Map(arr.map((item) => [item[key], item])).values()];

export const retryWithBackoff = async <T,>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> => {
  let lastErr: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
};

export default {
  formatCurrency,
  formatDate,
  formatTime,
  formatRelativeTime,
  debounce,
  throttle,
  deepClone,
  getQueryParams,
  buildQueryString,
  capitalize,
  truncate,
  generateId,
  copyToClipboard,
  getErrorMessage,
  isEmpty,
  sortByKey,
  groupByKey,
  unique,
  retryWithBackoff,
};
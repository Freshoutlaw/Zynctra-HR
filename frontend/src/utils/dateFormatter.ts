/**
 * /frontend/src/utils/dateFormatter.ts
 *
 * Date formatting utilities with locale support.
 */

export const formatDate = (
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  locale = 'en-US'
): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat(locale, options).format(d);
};

export const formatDateTime = (
  date: Date | string | null | undefined,
  locale = 'en-US'
): string =>
  formatDate(date, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }, locale);

export const formatRelative = (date: Date | string | null | undefined): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';

  const diffMs = Date.now() - d.getTime();
  const secs = Math.floor(Math.abs(diffMs) / 1000);
  const past = diffMs > 0;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (secs < 60) { value = secs; unit = 'second'; }
  else if (secs < 3600) { value = Math.floor(secs / 60); unit = 'minute'; }
  else if (secs < 86400) { value = Math.floor(secs / 3600); unit = 'hour'; }
  else if (secs < 2592000) { value = Math.floor(secs / 86400); unit = 'day'; }
  else if (secs < 31536000) { value = Math.floor(secs / 2592000); unit = 'month'; }
  else { value = Math.floor(secs / 31536000); unit = 'year'; }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  return rtf.format(past ? -value : value, unit);
};

export const isOverdue = (dueDate: Date | string): boolean =>
  new Date() > (typeof dueDate === 'string' ? new Date(dueDate) : dueDate);

export const daysBetween = (a: Date | string, b: Date | string): number => {
  const da = typeof a === 'string' ? new Date(a) : a;
  const db = typeof b === 'string' ? new Date(b) : b;
  return Math.ceil(Math.abs(db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
};

export const toISODateString = (date: Date): string =>
  date.toISOString().split('T')[0]!;

export default {
  formatDate,
  formatDateTime,
  formatRelative,
  isOverdue,
  daysBetween,
  toISODateString,
};
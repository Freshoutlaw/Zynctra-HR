/**
 * /frontend/src/utils/helpers.ts
 *
 * Miscellaneous helper functions.
 */

/** Sleep for `ms` milliseconds */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Check if a value is a plain object */
export const isPlainObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === 'object' && !Array.isArray(val);

/** Safely access a nested property by path string e.g. "a.b.c" */
export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (isPlainObject(acc)) return acc[key];
    return undefined;
  }, obj);
};

/** Remove keys with undefined / null values from an object */
export const omitNullish = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const result: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) {
      result[k as keyof T] = v as T[keyof T];
    }
  }
  return result;
};

/** Chunk an array into subarrays of size `n` */
export const chunk = <T,>(arr: T[], n: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n));
  }
  return result;
};

/** Flatten one level of a nested array */
export const flatten = <T,>(arr: T[][]): T[] => ([] as T[]).concat(...arr);

/** Return a random integer between min and max (inclusive) */
export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Clamp a number between min and max */
export const clamp = (val: number, min: number, max: number): number =>
  Math.min(Math.max(val, min), max);

/** Convert bytes to a human-readable size string */
export const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
};

/** Generate initials from a full name */
export const getInitials = (name: string, max = 2): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

/** Build a CSS class string, filtering falsy values */
export const cx = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');

export default {
  sleep,
  isPlainObject,
  getNestedValue,
  omitNullish,
  chunk,
  flatten,
  randomInt,
  clamp,
  formatBytes,
  getInitials,
  cx,
};
/**
 * /frontend/src/utils/payloadValidator.ts
 *
 * Request payload validation before sending to API.
 */

export interface PayloadValidationResult {
  valid: boolean;
  errors: string[];
}

const SQL_INJECTION_PATTERNS = [
  /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bEXEC\b)/i,
  /('|--|;|\bOR\b\s+\d+=\d+|\bAND\b\s+\d+=\d+)/i,
];

const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=/gi,
];

export const validatePayload = (payload: unknown): PayloadValidationResult => {
  const errors: string[] = [];

  const str = JSON.stringify(payload);

  // Size check (10 MB)
  if (str.length > 10 * 1024 * 1024) {
    errors.push('Payload exceeds maximum allowed size (10 MB)');
  }

  // SQL injection patterns
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(str)) {
      errors.push('Payload contains potentially dangerous SQL patterns');
      break;
    }
  }

  // XSS patterns
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(str)) {
      errors.push('Payload contains potentially dangerous script patterns');
      break;
    }
  }

  return { valid: errors.length === 0, errors };
};

export const sanitizePayload = <T extends Record<string, unknown>>(
  payload: T
): T => {
  const sanitized = JSON.stringify(payload)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  return JSON.parse(sanitized) as T;
};

export default { validatePayload, sanitizePayload };
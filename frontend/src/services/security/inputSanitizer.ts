/**
 * /frontend/src/services/security/inputSanitizer.ts
 *
 * Input sanitisation and XSS prevention (pure service).
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

class InputSanitizer {
  sanitizeHtml(input: string): string {
    if (!input) return '';
    return input.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
  }

  sanitizeUrl(input: string): string {
    try {
      const url = new URL(input);
      if (!['http:', 'https:'].includes(url.protocol)) return '';
      return url.toString();
    } catch {
      return '';
    }
  }

  sanitizeJavaScript(input: string): string {
    return input.replace(/<script|javascript:|on\w+=/gi, '');
  }

  sanitizeJson(input: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(input) as unknown;
      return this.deepSanitize(parsed) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private deepSanitize(obj: unknown): unknown {
    if (typeof obj === 'string') return this.sanitizeHtml(obj);
    if (Array.isArray(obj)) return obj.map((i) => this.deepSanitize(i));
    if (obj !== null && typeof obj === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        out[k] = this.deepSanitize(v);
      }
      return out;
    }
    return obj;
  }

  removeSpecialChars(input: string, allowedChars = ''): string {
    return input.replace(new RegExp(`[^a-zA-Z0-9${allowedChars}]`, 'g'), '');
  }

  truncateString(input: string, length: number): string {
    return input.length > length ? `${input.slice(0, length)}...` : input;
  }
}

export default new InputSanitizer();
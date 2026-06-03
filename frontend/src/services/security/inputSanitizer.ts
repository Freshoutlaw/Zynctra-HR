/**
 * /frontend/src/services/security/inputSanitizer.ts
 * 
 * Input sanitization and XSS prevention
 */

class InputSanitizer {
  private htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  sanitizeHtml(input: string): string {
    if (!input) return '';
    return input.replace(/[&<>"'\/]/g, (char) => this.htmlEscapeMap[char]);
  }

  sanitizeUrl(input: string): string {
    try {
      const url = new URL(input);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }
      return url.toString();
    } catch {
      return '';
    }
  }

  sanitizeJavaScript(input: string): string {
    const dangerous = /<script|javascript:|on\w+=/gi;
    return input.replace(dangerous, '');
  }

  sanitizeJson(input: string): Record<string, any> | null {
    try {
      const parsed = JSON.parse(input);
      return this.deepSanitize(parsed);
    } catch {
      return null;
    }
  }

  private deepSanitize(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeHtml(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSanitize(item));
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.deepSanitize(value);
      }
      return sanitized;
    }
    return obj;
  }

  removeSpecialChars(input: string, allowedChars: string = ''): string {
    const regex = new RegExp(`[^a-zA-Z0-9${allowedChars}]`, 'g');
    return input.replace(regex, '');
  }

  truncateString(input: string, length: number): string {
    if (input.length > length) {
      return input.substring(0, length) + '...';
    }
    return input;
  }
}

export default new InputSanitizer();
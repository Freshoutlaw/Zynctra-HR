/**
 * /frontend/src/services/security/cryptoUtil.ts
 *
 * Cryptographic utilities using the Web Crypto API.
 */

class CryptoUtil {
  generateRandomString(length = 32): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values, (v) => chars[v % chars.length]!).join('');
  }

  async generateHash(data: string): Promise<string> {
    const encoded = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  generateUUID(): string {
    return crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
  }

  encodeBase64(data: string): string {
    try {
      return btoa(unescape(encodeURIComponent(data)));
    } catch {
      return '';
    }
  }

  decodeBase64(data: string): string {
    try {
      return decodeURIComponent(escape(atob(data)));
    } catch {
      return '';
    }
  }

  async generateSecureToken(length = 32): Promise<string> {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  /** Constant-time string comparison to prevent timing attacks */
  compareStrings(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}

export default new CryptoUtil();
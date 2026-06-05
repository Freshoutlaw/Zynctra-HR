/**
 * /frontend/src/services/storage/secureLocalStorage.ts
 *
 * Secure localStorage wrapper with optional base64 obfuscation.
 * In production, replace the encode/decode with real AES-GCM encryption.
 */

class SecureLocalStorage {
  private readonly prefix = 'zynctra_secure_';

  set<T>(key: string, value: T, encode = false): void {
    try {
      const serialised = JSON.stringify(value);
      localStorage.setItem(
        this.prefix + key,
        encode ? this.encode(serialised) : serialised
      );
    } catch (err) {
      console.error('[SecureStorage] set failed:', err);
    }
  }

  get<T>(key: string, decode = false): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;
      const str = decode ? this.decode(raw) : raw;
      return JSON.parse(str) as T;
    } catch (err) {
      console.error('[SecureStorage] get failed:', err);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(this.prefix)) localStorage.removeItem(key);
    }
  }

  private encode(data: string): string {
    try { return btoa(encodeURIComponent(data)); } catch { return data; }
  }

  private decode(data: string): string {
    try { return decodeURIComponent(atob(data)); } catch { return data; }
  }
}

export default new SecureLocalStorage();
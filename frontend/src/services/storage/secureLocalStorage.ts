/**
 * /frontend/src/services/storage/secureLocalStorage.ts
 * 
 * Secure local storage with encryption (mock)
 */

class SecureLocalStorage {
  private prefix = 'zynctra_secure_';

  set(key: string, value: any, encrypt: boolean = false): void {
    try {
      const serialized = JSON.stringify(value);
      const data = encrypt ? this.simpleEncrypt(serialized) : serialized;
      localStorage.setItem(this.prefix + key, data);
    } catch (error) {
      console.error('Failed to save to secure storage:', error);
    }
  }

  get<T>(key: string, decrypt: boolean = false): T | null {
    try {
      const data = localStorage.getItem(this.prefix + key);
      if (!data) return null;

      const serialized = decrypt ? this.simpleDecrypt(data) : data;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to read from secure storage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }

  private simpleEncrypt(data: string): string {
    // Simple base64 encoding (in production use proper encryption)
    return btoa(data);
  }

  private simpleDecrypt(data: string): string {
    // Simple base64 decoding (in production use proper decryption)
    return atob(data);
  }
}

export default new SecureLocalStorage();
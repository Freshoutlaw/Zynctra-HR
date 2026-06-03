/**
 * /frontend/src/services/storage/sessionStorage.ts
 * 
 * Session storage management
 */

class SessionStorageManager {
  private prefix = 'zynctra_session_';

  set(key: string, value: any): void {
    try {
      sessionStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to session storage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const data = sessionStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to read from session storage:', error);
      return null;
    }
  }

  remove(key: string): void {
    sessionStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => sessionStorage.removeItem(key));
  }

  exists(key: string): boolean {
    return sessionStorage.getItem(this.prefix + key) !== null;
  }

  keys(): string[] {
    return Object.keys(sessionStorage)
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.replace(this.prefix, ''));
  }
}

export default new SessionStorageManager();
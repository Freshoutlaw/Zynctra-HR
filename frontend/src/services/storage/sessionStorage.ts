/**
 * /frontend/src/services/storage/sessionStorage.ts
 *
 * Session storage management wrapper.
 */

class SessionStorageManager {
  private readonly prefix = 'zynctra_session_';

  set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (err) {
      console.error('[SessionStorage] set failed:', err);
    }
  }

  get<T>(key: string): T | null {
    try {
      const raw = sessionStorage.getItem(this.prefix + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      console.error('[SessionStorage] get failed:', err);
      return null;
    }
  }

  remove(key: string): void {
    sessionStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith(this.prefix)) sessionStorage.removeItem(key);
    }
  }

  exists(key: string): boolean {
    return sessionStorage.getItem(this.prefix + key) !== null;
  }

  keys(): string[] {
    return Object.keys(sessionStorage)
      .filter((k) => k.startsWith(this.prefix))
      .map((k) => k.slice(this.prefix.length));
  }
}

export default new SessionStorageManager();
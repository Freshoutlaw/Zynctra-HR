/**
 * /frontend/src/services/storage/cacheManager.ts
 * 
 * Cache management with TTL and invalidation
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize = 100;

  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries()).reduce((oldest, [k, v]) =>
        v.timestamp < oldest[1].timestamp ? [k, v] : oldest
      )[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: RegExp): void {
    Array.from(this.cache.keys())
      .filter((key) => pattern.test(key))
      .forEach((key) => this.cache.delete(key));
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: Math.round((this.cache.size / this.maxSize) * 100),
    };
  }
}

export default new CacheManager();
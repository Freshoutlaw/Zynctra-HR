/**
 * /frontend/src/services/storage/cacheManager.ts
 *
 * In-memory cache with TTL and LRU-style eviction.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private readonly cache = new Map<string, CacheEntry<unknown>>();
  private readonly maxSize = 100;

  set<T>(key: string, data: T, ttlSeconds = 3600): void {
    if (this.cache.size >= this.maxSize) {
      // Evict oldest entry
      const oldest = [...this.cache.entries()].sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      )[0];
      if (oldest) this.cache.delete(oldest[0]);
    }
    this.cache.set(key, { data, timestamp: Date.now(), ttl: ttlSeconds * 1000 });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
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
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) this.cache.delete(key);
    }
  }

  getStats(): { size: number; maxSize: number; usage: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: Math.round((this.cache.size / this.maxSize) * 100),
    };
  }
}

export default new CacheManager();
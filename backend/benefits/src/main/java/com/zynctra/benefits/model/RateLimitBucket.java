package com.zynctra.benefits.model;

import lombok.Getter;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory token bucket for rate limiting in benefits service.
 */
@Getter
public class RateLimitBucket {

    private final String key;
    private final long capacity;
    private final long refillRate;
    private final AtomicLong tokens;
    private volatile long lastRefillNanos;
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong blockedRequests = new AtomicLong(0);
    private volatile Instant firstViolation;
    private volatile int consecutiveViolations = 0;

    public RateLimitBucket(String key, long capacity, long refillRate) {
        this.key = key;
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.tokens = new AtomicLong(capacity);
        this.lastRefillNanos = System.nanoTime();
    }

    public synchronized boolean tryConsume(long requested) {
        refill();
        totalRequests.incrementAndGet();

        long current = tokens.get();
        if (current >= requested) {
            tokens.set(current - requested);
            consecutiveViolations = 0;
            return true;
        }

        blockedRequests.incrementAndGet();
        consecutiveViolations++;
        if (firstViolation == null) {
            firstViolation = Instant.now();
        }
        return false;
    }

    private void refill() {
        long now = System.nanoTime();
        long elapsedSeconds = (now - lastRefillNanos) / 1_000_000_000L;

        if (elapsedSeconds > 0) {
            long tokensToAdd = elapsedSeconds * refillRate;
            long newTokens = Math.min(capacity, tokens.get() + tokensToAdd);
            tokens.set(newTokens);
            lastRefillNanos = now;
        }
    }

    public boolean isAbusive() {
        long total = totalRequests.get();
        if (total < 10) return false;
        long blocked = blockedRequests.get();
        return (blocked * 100 / total) > 80;
    }

    public boolean hasExceededConsecutiveThreshold(int threshold) {
        return consecutiveViolations >= threshold;
    }

    public void resetViolations() {
        consecutiveViolations = 0;
        firstViolation = null;
    }

    @Override
    public String toString() {
        return String.format("RateLimitBucket{key=%s, tokens=%d/%d, total=%d, blocked=%d}",
            key, tokens.get(), capacity, totalRequests.get(), blockedRequests.get());
    }

    // Manual getters for fields not covered by @Getter
    public long getTokens() {
        return tokens.get();
    }

    public long getBlockedRequests() {
        return blockedRequests.get();
    }
}

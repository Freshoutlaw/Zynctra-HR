package com.zynctra.benefits.service;

import com.zynctra.benefits.exception.RateLimitExceededException;
import com.zynctra.benefits.model.RateLimitBucket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class RateLimitService {

    @Value("${security.rate-limit.capacity:100}")
    private long defaultCapacity;

    @Value("${security.rate-limit.refill-rate:10}")
    private long defaultRefillRate;

    @Value("${security.rate-limit.abuse-threshold:5}")
    private int abuseConsecutiveThreshold;

    private final Map<String, RateLimitBucket> buckets = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleanupExecutor = Executors.newSingleThreadScheduledExecutor(
        r -> { Thread t = new Thread(r, "rate-limit-cleanup"); t.setDaemon(true); return t; }
    );

    public RateLimitService() {
        cleanupExecutor.scheduleAtFixedRate(this::cleanupStaleBuckets,
            10, 10, TimeUnit.MINUTES);
    }

    public void checkRateLimit(String tenantId, String userId, long cost) {
        if (tenantId == null || userId == null) {
            throw new IllegalStateException("Rate limiting requires authenticated tenant and user");
        }
        String key = tenantId + ":" + userId;
        RateLimitBucket bucket = buckets.computeIfAbsent(key,
            k -> new RateLimitBucket(k, defaultCapacity, defaultRefillRate));

        if (!bucket.tryConsume(cost)) {
            int retryAfter = Math.max(1, (int) Math.ceil(cost / (double) defaultRefillRate));
            log.warn("SECURITY: Rate limit exceeded | tenant={} | user={}", tenantId, userId);
            throw new RateLimitExceededException("Rate limit exceeded", tenantId, userId, retryAfter);
        }

        if (bucket.hasExceededConsecutiveThreshold(abuseConsecutiveThreshold)) {
            log.error("SECURITY: Potential abuse | tenant={} | user={}", tenantId, userId);
        }
    }

    public void checkRateLimit(String tenantId, String userId) {
        checkRateLimit(tenantId, userId, 1);
    }

    private void cleanupStaleBuckets() {
        buckets.entrySet().removeIf(e -> {
            RateLimitBucket b = e.getValue();
            return b.getTokens().get() == defaultCapacity && b.getBlockedRequests().get() == 0;
        });
    }
}
package com.zynctra.learning.security;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LearningRateLimiter {

    private final ConcurrentHashMap<String, RateLimiter> limiters = new ConcurrentHashMap<>();

    private final RateLimiterConfig aiConfig = RateLimiterConfig.custom()
        .limitForPeriod(30).limitRefreshPeriod(Duration.ofMinutes(1)).timeoutDuration(Duration.ZERO).build();
    private final RateLimiterConfig downloadConfig = RateLimiterConfig.custom()
        .limitForPeriod(10).limitRefreshPeriod(Duration.ofMinutes(1)).timeoutDuration(Duration.ZERO).build();
    private final RateLimiterConfig certConfig = RateLimiterConfig.custom()
        .limitForPeriod(3).limitRefreshPeriod(Duration.ofDays(1)).timeoutDuration(Duration.ZERO).build();

    public boolean allowAiRequest(String userId, String tenantId) {
        return getLimiter("ai:" + tenantId + ":" + userId, aiConfig).acquirePermission();
    }

    public boolean allowDownload(String userId, String tenantId) {
        return getLimiter("dl:" + tenantId + ":" + userId, downloadConfig).acquirePermission();
    }

    public boolean allowCertAttempt(String userId, String tenantId) {
        return getLimiter("cert:" + tenantId + ":" + userId, certConfig).acquirePermission();
    }

    private RateLimiter getLimiter(String key, RateLimiterConfig config) {
        return limiters.computeIfAbsent(key, k -> RateLimiter.of(k, config));
    }
}
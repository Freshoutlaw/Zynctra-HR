package com.zynctra.securityadmin.config;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * AGGRESSIVE Rate Limiting for Security Admin.
 * 
 * Admin operations are HIGH-VALUE targets:
 * - Role changes can escalate privileges
 * - Permission changes can bypass controls
 * - Policy changes can weaken security
 * 
 * Very strict limits prevent automated attacks and force deliberate action.
 */
@Configuration
public class RateLimitConfig {

    @Bean
    public RateLimiterRegistry rateLimiterRegistry() {
        RateLimiterConfig defaultConfig = RateLimiterConfig.custom()
            .limitForPeriod(50)
            .limitRefreshPeriod(Duration.ofMinutes(1))
            .timeoutDuration(Duration.ofMillis(500))
            .build();
        return RateLimiterRegistry.of(defaultConfig);
    }

    @Bean(name = "roleRateLimiter")
    public RateLimiter roleRateLimiter(RateLimiterRegistry registry) {
        // Role changes: 10 per 5 minutes (deliberate action required)
        RateLimiterConfig config = RateLimiterConfig.custom()
            .limitForPeriod(10)
            .limitRefreshPeriod(Duration.ofMinutes(5))
            .timeoutDuration(Duration.ofMillis(200))
            .build();
        return registry.rateLimiter("role-admin", config);
    }

    @Bean(name = "permissionRateLimiter")
    public RateLimiter permissionRateLimiter(RateLimiterRegistry registry) {
        RateLimiterConfig config = RateLimiterConfig.custom()
            .limitForPeriod(10)
            .limitRefreshPeriod(Duration.ofMinutes(5))
            .timeoutDuration(Duration.ofMillis(200))
            .build();
        return registry.rateLimiter("permission-admin", config);
    }

    @Bean(name = "policyRateLimiter")
    public RateLimiter policyRateLimiter(RateLimiterRegistry registry) {
        RateLimiterConfig config = RateLimiterConfig.custom()
            .limitForPeriod(20)
            .limitRefreshPeriod(Duration.ofMinutes(5))
            .timeoutDuration(Duration.ofMillis(200))
            .build();
        return registry.rateLimiter("policy-admin", config);
    }

    @Bean(name = "auditRateLimiter")
    public RateLimiter auditRateLimiter(RateLimiterRegistry registry) {
        // Audit reads can be higher for investigation
        RateLimiterConfig config = RateLimiterConfig.custom()
            .limitForPeriod(100)
            .limitRefreshPeriod(Duration.ofMinutes(1))
            .timeoutDuration(Duration.ofMillis(500))
            .build();
        return registry.rateLimiter("audit-read", config);
    }

    @Bean(name = "threatRateLimiter")
    public RateLimiter threatRateLimiter(RateLimiterRegistry registry) {
        RateLimiterConfig config = RateLimiterConfig.custom()
            .limitForPeriod(50)
            .limitRefreshPeriod(Duration.ofMinutes(1))
            .timeoutDuration(Duration.ofMillis(300))
            .build();
        return registry.rateLimiter("threat-admin", config);
    }
}
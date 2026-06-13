package com.zynctra.performance.config;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Rate Limiting Configuration
 * 
 * Prevents brute force, DoS, and abuse on performance endpoints.
 * Uses Resilience4j for in-process rate limiting (no external dependencies).
 */
@Configuration
public class RateLimitConfig {

    @Bean
    public RateLimiterRegistry rateLimiterRegistry() {
        RateLimiterConfig defaultConfig = RateLimiterConfig.custom()
            .limitForPeriod(100)           // 100 requests
            .limitRefreshPeriod(Duration.ofMinutes(1))
            .timeoutDuration(Duration.ofMillis(500))
            .build();
        
        return RateLimiterRegistry.of(defaultConfig);
    }

    @Bean(name = "strictRateLimiter")
    public RateLimiter strictRateLimiter(RateLimiterRegistry registry) {
        // For write operations (POST/PUT/DELETE)
        RateLimiterConfig strictConfig = RateLimiterConfig.custom()
            .limitForPeriod(20)            // 20 write ops per minute
            .limitRefreshPeriod(Duration.ofMinutes(1))
            .timeoutDuration(Duration.ofMillis(100))
            .build();
        
        return registry.rateLimiter("performance-strict", strictConfig);
    }

    @Bean(name = "standardRateLimiter")
    public RateLimiter standardRateLimiter(RateLimiterRegistry registry) {
        // For read operations (GET)
        RateLimiterConfig standardConfig = RateLimiterConfig.custom()
            .limitForPeriod(100)           // 100 read ops per minute
            .limitRefreshPeriod(Duration.ofMinutes(1))
            .timeoutDuration(Duration.ofMillis(200))
            .build();
        
        return registry.rateLimiter("performance-standard", standardConfig);
    }
}
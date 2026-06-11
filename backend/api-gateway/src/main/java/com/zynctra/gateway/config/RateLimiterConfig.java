package com.zynctra.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

import java.util.Objects;

/**
 * Rate Limiter Configuration
 * 
 * Defines key resolvers for distributed rate limiting.
 * Each resolver generates a unique key based on different
 * request attributes for granular rate limit control.
 */
@Configuration
public class RateLimiterConfig {

    /**
     * User-based rate limiting key resolver.
     * Uses the authenticated user ID from the JWT token.
     * Falls back to IP address for unauthenticated requests.
     */
    @Bean
    @Primary
    public KeyResolver userKeyResolver() {
        return exchange -> {
            String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
            if (userId != null) {
                return Mono.just("user:" + userId);
            }
            // Fallback to IP for unauthenticated requests
            String ip = Objects.requireNonNull(
                exchange.getRequest().getRemoteAddress()).getAddress().getHostAddress();
            return Mono.just("ip:" + ip);
        };
    }

    /**
     * Tenant-based rate limiting key resolver.
     * Limits requests per tenant organization.
     */
    @Bean
    public KeyResolver tenantKeyResolver() {
        return exchange -> {
            String tenantId = exchange.getRequest().getHeaders().getFirst("X-Tenant-Id");
            if (tenantId != null) {
                return Mono.just("tenant:" + tenantId);
            }
            String ip = Objects.requireNonNull(
                exchange.getRequest().getRemoteAddress()).getAddress().getHostAddress();
            return Mono.just("ip:" + ip);
        };
    }

    /**
     * IP-based rate limiting key resolver.
     * Used for public endpoints like webhooks.
     */
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            String ip = Objects.requireNonNull(
                exchange.getRequest().getRemoteAddress()).getAddress().getHostAddress();
            return Mono.just("ip:" + ip);
        };
    }
}
package com.zynctra.gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;

/**
 * Rate Limiting Filter
 * 
 * Custom rate limiting implementation using Redis for distributed state.
 * Supports multiple rate limit strategies:
 * - Login attempts: 5 per 15 minutes per IP
 * - General API: 100 per minute per user
 * - Admin endpoints: 10 per minute per admin
 * - Webhooks: 5 per minute per IP
 * 
 * Uses sliding window algorithm for accurate rate limiting.
 */
@Component
public class RateLimitingFilter extends AbstractGatewayFilterFactory<RateLimitingFilter.Config> {

    @Autowired
    private ReactiveStringRedisTemplate redisTemplate;

    // Rate limit configurations
    private static final int LOGIN_ATTEMPTS = 5;
    private static final Duration LOGIN_WINDOW = Duration.ofMinutes(15);
    private static final int GENERAL_LIMIT = 100;
    private static final Duration GENERAL_WINDOW = Duration.ofMinutes(1);
    private static final int ADMIN_LIMIT = 10;
    private static final Duration ADMIN_WINDOW = Duration.ofMinutes(1);
    private static final int WEBHOOK_LIMIT = 5;
    private static final Duration WEBHOOK_WINDOW = Duration.ofMinutes(1);

    public RateLimitingFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().value();
            String clientKey = getClientKey(request, path);

            // Determine rate limit based on endpoint type
            RateLimit rateLimit = determineRateLimit(path);

            String redisKey = String.format("rate_limit:%s:%s", rateLimit.type, clientKey);

            return checkRateLimit(redisKey, rateLimit)
                .flatMap(allowed -> {
                    if (allowed) {
                        // Add rate limit headers to response
                        return chain.filter(exchange).then(
                            addRateLimitHeaders(exchange, redisKey, rateLimit)
                        );
                    } else {
                        return rateLimited(exchange.getResponse(), rateLimit);
                    }
                });
        };
    }

    /**
     * Determines the appropriate rate limit configuration based on the request path.
     */
    private RateLimit determineRateLimit(String path) {
        if (path.startsWith("/api/auth/login")) {
            return new RateLimit("login", LOGIN_ATTEMPTS, LOGIN_WINDOW);
        }
        if (path.startsWith("/api/admin/") || path.startsWith("/api/audit/") || path.startsWith("/api/security/")) {
            return new RateLimit("admin", ADMIN_LIMIT, ADMIN_WINDOW);
        }
        if (path.startsWith("/api/billing/webhooks/")) {
            return new RateLimit("webhook", WEBHOOK_LIMIT, WEBHOOK_WINDOW);
        }
        return new RateLimit("general", GENERAL_LIMIT, GENERAL_WINDOW);
    }

    /**
     * Generates a unique client key for rate limiting.
     */
    private String getClientKey(ServerHttpRequest request, String path) {
        // For authenticated requests, use user ID
        String userId = request.getHeaders().getFirst("X-User-Id");
        if (userId != null) {
            return userId;
        }

        // For webhook endpoints, use a combination of IP and path
        if (path.startsWith("/api/billing/webhooks/")) {
            String ip = getClientIp(request);
            String provider = path.substring(path.lastIndexOf('/') + 1);
            return ip + ":" + provider;
        }

        // Fallback to IP address
        return getClientIp(request);
    }

    /**
     * Extracts the client IP address from the request.
     */
    private String getClientIp(ServerHttpRequest request) {
        String forwardedFor = request.getHeaders().getFirst("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            return forwardedFor.split(",")[0].trim();
        }

        String realIp = request.getHeaders().getFirst("X-Real-IP");
        if (realIp != null && !realIp.isEmpty()) {
            return realIp;
        }

        return request.getRemoteAddress() != null
            ? request.getRemoteAddress().getAddress().getHostAddress()
            : "unknown";
    }

    /**
     * Checks if the request is within the rate limit using Redis sliding window.
     */
    private Mono<Boolean> checkRateLimit(String redisKey, RateLimit rateLimit) {
        long now = Instant.now().toEpochMilli();
        long windowStart = now - rateLimit.window.toMillis();

        return redisTemplate.opsForZSet()
            .removeRangeByScore(redisKey, 0, windowStart)
            .then(redisTemplate.opsForZSet().zCard(redisKey))
            .flatMap(currentCount -> {
                if (currentCount < rateLimit.limit) {
                    // Add current request timestamp
                    return redisTemplate.opsForZSet()
                        .add(redisKey, String.valueOf(now), now)
                        .then(redisTemplate.expire(redisKey, rateLimit.window))
                        .thenReturn(true);
                }
                return Mono.just(false);
            });
    }

    /**
     * Adds rate limit headers to the response.
     */
    private Mono<Void> addRateLimitHeaders(org.springframework.web.server.ServerWebExchange exchange, String redisKey, RateLimit rateLimit) {
        return redisTemplate.opsForZSet().zCard(redisKey)
            .flatMap(count -> {
                long remaining = Math.max(0, rateLimit.limit - count);
                exchange.getResponse().getHeaders().set("X-RateLimit-Limit", String.valueOf(rateLimit.limit));
                exchange.getResponse().getHeaders().set("X-RateLimit-Remaining", String.valueOf(remaining));
                return redisTemplate.opsForZSet().range(redisKey, 0, 0)
                    .map(oldest -> {
                        long resetAt = Long.parseLong(oldest) + rateLimit.window.toMillis();
                        exchange.getResponse().getHeaders().set("X-RateLimit-Reset", String.valueOf(resetAt));
                        return Mono.empty();
                    })
                    .defaultIfEmpty(Mono.empty())
                    .then();
            });
    }

    /**
     * Returns a 429 Too Many Requests response.
     */
    private Mono<Void> rateLimited(org.springframework.http.server.reactive.ServerHttpResponse response, RateLimit rateLimit) {
        response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        response.getHeaders().set("Retry-After", String.valueOf(rateLimit.window.getSeconds()));
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String errorBody = String.format(
            "{\"success\":false,\"error\":{\"code\":\"RATE_LIMIT_EXCEEDED\"," +
            "\"message\":\"Rate limit exceeded. Please try again in %d seconds.\"," +
            "\"statusCode\":429},\"timestamp\":\"%s\",\"traceId\":\"%s\"}",
            rateLimit.window.getSeconds(), Instant.now().toString(), java.util.UUID.randomUUID()
        );

        DataBuffer buffer = response.bufferFactory().wrap(errorBody.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }

    /**
     * Rate limit configuration record.
     */
    private record RateLimit(String type, int limit, Duration window) {}

    public static class Config {
        // Configuration properties if needed
    }
}
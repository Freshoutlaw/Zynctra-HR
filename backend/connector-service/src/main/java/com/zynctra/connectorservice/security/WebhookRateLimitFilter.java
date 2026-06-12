package com.zynctra.connector.security;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class WebhookRateLimitFilter extends OncePerRequestFilter {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private final ConcurrentHashMap<String, RateLimiter> limiters = new ConcurrentHashMap<>();
    
    private final RateLimiterConfig config = RateLimiterConfig.custom()
        .limitForPeriod(10)           // 10 requests
        .limitRefreshPeriod(Duration.ofMinutes(1))
        .timeoutDuration(Duration.ZERO)
        .build();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String key = getRateLimitKey(request);
        RateLimiter limiter = limiters.computeIfAbsent(key, k -> 
            RateLimiter.of("webhook-" + k, config));
        
        if (!limiter.acquirePermission()) {
            SEC_LOG.warn("SECURITY_EVENT: webhook_rate_limit_exceeded key={} ip={}", 
                key, request.getRemoteAddr());
            response.setStatus(429);
            response.getWriter().write("{\"error\":\"rate_limit_exceeded\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getRateLimitKey(HttpServletRequest request) {
        // Rate limit by provider + IP combination
        String provider = request.getRequestURI().replaceAll(".*/webhooks/", "");
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null) ip = request.getRemoteAddr();
        return provider + ":" + ip;
    }
}
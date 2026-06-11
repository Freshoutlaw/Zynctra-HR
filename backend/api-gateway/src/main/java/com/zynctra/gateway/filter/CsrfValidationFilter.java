package com.zynctra.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * CSRF Validation Filter
 * 
 * Implements double-submit cookie pattern for CSRF protection.
 * Validates that state-changing requests (POST, PUT, PATCH, DELETE)
 * contain a matching X-CSRF-Token header for the XSRF-TOKEN cookie.
 * 
 * GET requests are exempt from CSRF validation.
 */
@Component
public class CsrfValidationFilter extends AbstractGatewayFilterFactory<CsrfValidationFilter.Config> {

    private static final String CSRF_HEADER = "X-CSRF-Token";
    private static final String CSRF_COOKIE = "XSRF-TOKEN";

    public CsrfValidationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            HttpMethod method = request.getMethod();
            
            // Skip CSRF validation for safe methods
            if (method == HttpMethod.GET || method == HttpMethod.HEAD || method == HttpMethod.OPTIONS) {
                return chain.filter(exchange);
            }
            
            // Skip CSRF for public routes (auth endpoints handle their own CSRF)
            String path = request.getPath().value();
            if (path.startsWith("/api/auth/") || path.startsWith("/api/billing/webhooks/")) {
                return chain.filter(exchange);
            }
            
            // Extract CSRF token from header
            String csrfHeader = request.getHeaders().getFirst(CSRF_HEADER);
            
            // Extract CSRF token from cookie
            String csrfCookie = request.getCookies().getFirst(CSRF_COOKIE) != null
                ? request.getCookies().getFirst(CSRF_COOKIE).getValue()
                : null;
            
            // Validate presence
            if (!StringUtils.hasText(csrfHeader) || !StringUtils.hasText(csrfCookie)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
            
            // Validate match
            if (!csrfHeader.equals(csrfCookie)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
            
            return chain.filter(exchange);
        };
    }

    public static class Config {
        // Configuration properties if needed
    }
}
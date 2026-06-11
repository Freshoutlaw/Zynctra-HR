package com.zynctra.gateway.filter;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Security Header Filter
 * 
 * Adds security headers to all outgoing responses to protect against
 * common web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.).
 * 
 * Headers added:
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - X-XSS-Protection: 1; mode=block
 * - Strict-Transport-Security: max-age=31536000; includeSubDomains
 * - Content-Security-Policy: default-src 'self'
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Permissions-Policy: geolocation=(), microphone=(), camera=()
 */
@Component
public class SecurityHeaderFilter implements GlobalFilter, Ordered {

    @Override
    public int getOrder() {
        return -1; // Execute early, before other filters
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            
            // Prevent MIME type sniffing
            response.getHeaders().set("X-Content-Type-Options", "nosniff");
            
            // Prevent clickjacking
            response.getHeaders().set("X-Frame-Options", "DENY");
            
            // Legacy XSS protection (for older browsers)
            response.getHeaders().set("X-XSS-Protection", "1; mode=block");
            
            // Enforce HTTPS
            response.getHeaders().set(
                "Strict-Transport-Security",
                "max-age=31536000; includeSubDomains; preload"
            );
            
            // Content Security Policy
            response.getHeaders().set(
                "Content-Security-Policy",
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self'; " +
                "connect-src 'self' ws: wss:; " +
                "frame-ancestors 'none'; " +
                "base-uri 'self'; " +
                "form-action 'self';"
            );
            
            // Referrer policy
            response.getHeaders().set("Referrer-Policy", "strict-origin-when-cross-origin");
            
            // Permissions policy (feature policy)
            response.getHeaders().set(
                "Permissions-Policy",
                "geolocation=(), microphone=(), camera=(), payment=(), usb=(), " +
                "magnetometer=(), gyroscope=(), fullscreen=(self)"
            );
            
            // Remove server identification
            response.getHeaders().remove("Server");
            response.getHeaders().remove("X-Powered-By");
        }));
    }
}
package com.zynctra.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

/**
 * Logging Filter
 * 
 * Logs all incoming requests and outgoing responses with structured data.
 * Captures: method, path, query params, user ID, tenant ID, status code,
 * response time, client IP, and trace ID.
 * 
 * Logs are structured as JSON for ingestion into ELK stack.
 * Sensitive data (passwords, tokens) is redacted from logs.
 */
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    // Headers that should not be logged (sensitive data)
    private static final java.util.Set<String> SENSITIVE_HEADERS = java.util.Set.of(
        "authorization",
        "cookie",
        "x-csrf-token",
        "x-api-key",
        "password",
        "x-password"
    );

    @Override
    public int getOrder() {
        return -2; // Execute first, before all other filters
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        Instant startTime = Instant.now();
        String traceId = generateTraceId();

        // Add trace ID to exchange for correlation across services
        ServerWebExchange mutatedExchange = exchange.mutate()
            .request(exchange.getRequest().mutate()
                .header("X-Request-ID", traceId)
                .build())
            .build();

        ServerHttpRequest request = mutatedExchange.getRequest();
        String method = request.getMethodValue();
        String path = request.getPath().value();
        String clientIp = getClientIp(request);
        String userId = request.getHeaders().getFirst("X-User-Id");
        String tenantId = request.getHeaders().getFirst("X-Tenant-Id");

        // Log incoming request
        logRequest(traceId, method, path, clientIp, userId, tenantId, request);

        return chain.filter(mutatedExchange)
            .doFinally(signalType -> {
                ServerHttpResponse response = mutatedExchange.getResponse();
                long durationMs = Duration.between(startTime, Instant.now()).toMillis();
                int statusCode = response.getStatusCode() != null 
                    ? response.getStatusCode().value() 
                    : 0;

                // Log response
                logResponse(traceId, method, path, statusCode, durationMs, userId, tenantId, clientIp);
            });
    }

    /**
     * Logs the incoming request with sanitized headers.
     */
    private void logRequest(String traceId, String method, String path, String clientIp,
                            String userId, String tenantId, ServerHttpRequest request) {
        
        java.util.Map<String, String> safeHeaders = new java.util.HashMap<>();
        request.getHeaders().forEach((key, values) -> {
            String lowerKey = key.toLowerCase();
            if (!SENSITIVE_HEADERS.contains(lowerKey)) {
                safeHeaders.put(key, String.join(", ", values));
            } else {
                safeHeaders.put(key, "[REDACTED]");
            }
        });

        logger.info("REQUEST traceId={} method={} path={} clientIp={} userId={} tenantId={} headers={}",
            traceId, method, path, clientIp, 
            userId != null ? userId : "anonymous",
            tenantId != null ? tenantId : "none",
            safeHeaders);
    }

    /**
     * Logs the outgoing response with timing information.
     */
    private void logResponse(String traceId, String method, String path, int statusCode,
                             long durationMs, String userId, String tenantId, String clientIp) {
        
        String level = statusCode >= 500 ? "ERROR" : 
                       statusCode >= 400 ? "WARN" : "INFO";

        String logMessage = String.format(
            "RESPONSE traceId=%s method=%s path=%s status=%d durationMs=%d userId=%s tenantId=%s clientIp=%s",
            traceId, method, path, statusCode, durationMs,
            userId != null ? userId : "anonymous",
            tenantId != null ? tenantId : "none",
            clientIp
        );

        switch (level) {
            case "ERROR" -> logger.error(logMessage);
            case "WARN" -> logger.warn(logMessage);
            default -> logger.info(logMessage);
        }
    }

    /**
     * Generates a unique trace ID for request correlation.
     */
    private String generateTraceId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    /**
     * Extracts the client IP address, respecting proxy headers.
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
}
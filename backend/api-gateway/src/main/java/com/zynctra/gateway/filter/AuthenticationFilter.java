package com.zynctra.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

/**
 * Authentication Filter (Global)
 * 
 * Global filter that runs on every request to validate authentication
 * for protected routes. This is the primary authentication entry point
 * that works in conjunction with the route-specific JwtAuthenticationFilter.
 * 
 * Skips validation for public routes defined in the permit list.
 */
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    // Public paths that don't require authentication
    private static final List<String> PUBLIC_PATHS = List.of(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
        "/api/auth/refresh",
        "/api/billing/webhooks",
        "/api/plans",
        "/health",
        "/actuator/health",
        "/actuator/info"
    );

    @Override
    public int getOrder() {
        return 0; // Execute early but after logging
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        // Skip authentication for public paths
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        // Check Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst(AUTHORIZATION_HEADER);

        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(BEARER_PREFIX)) {
            return unauthorized(exchange.getResponse(), "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            Claims claims = validateToken(token);

            // Check expiration
            if (claims.getExpiration().before(Date.from(Instant.now()))) {
                return unauthorized(exchange.getResponse(), "Token has expired");
            }

            // Add user context to exchange attributes for downstream use
            ServerWebExchange mutatedExchange = exchange.mutate()
                .request(exchange.getRequest().mutate()
                    .header("X-User-Id", claims.getSubject())
                    .header("X-Tenant-Id", getClaim(claims, "tenantId"))
                    .header("X-User-Role", getClaim(claims, "role"))
                    .header("X-User-Email", getClaim(claims, "email"))
                    .header("X-Session-Id", getClaim(claims, "sessionId"))
                    .build())
                .build();

            return chain.filter(mutatedExchange);

        } catch (ExpiredJwtException e) {
            return unauthorized(exchange.getResponse(), "Token has expired");
        } catch (SignatureException e) {
            return unauthorized(exchange.getResponse(), "Invalid token signature");
        } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            return unauthorized(exchange.getResponse(), "Invalid token format");
        }
    }

    /**
     * Checks if the request path matches any public path pattern.
     */
    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    /**
     * Validates the JWT token and returns its claims.
     */
    private Claims validateToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    /**
     * Safely extracts a claim value.
     */
    private String getClaim(Claims claims, String key) {
        Object value = claims.get(key);
        return value != null ? value.toString() : "";
    }

    /**
     * Returns a 401 Unauthorized response with JSON error body.
     */
    private Mono<Void> unauthorized(ServerHttpResponse response, String message) {
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String errorBody = String.format(
            "{\"success\":false,\"error\":{\"code\":\"UNAUTHORIZED\",\"message\":\"%s\",\"statusCode\":401}," +
            "\"timestamp\":\"%s\",\"traceId\":\"%s\"}",
            message, Instant.now().toString(), java.util.UUID.randomUUID()
        );

        DataBuffer buffer = response.bufferFactory().wrap(errorBody.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }
}
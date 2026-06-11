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
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * JWT Authentication Filter
 * 
 * Validates JWT access tokens on incoming requests.
 * Extracts user claims and forwards them as headers
 * to downstream services for authorization decisions.
 * 
 * Expected Authorization header: Bearer <token>
 */
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            
            // Check if Authorization header is present
            String authHeader = request.getHeaders().getFirst(AUTHORIZATION_HEADER);
            
            if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(BEARER_PREFIX)) {
                return unauthorized(exchange.getResponse(), "Missing or invalid Authorization header");
            }

            String token = authHeader.substring(BEARER_PREFIX.length());

            try {
                // Validate token and extract claims
                Claims claims = validateToken(token);
                
                // Check if token is expired
                if (claims.getExpiration().before(Date.from(Instant.now()))) {
                    return unauthorized(exchange.getResponse(), "Token has expired");
                }

                // Build mutated request with user context headers
                ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", claims.getSubject())
                    .header("X-Tenant-Id", getClaim(claims, "tenantId"))
                    .header("X-User-Role", getClaim(claims, "role"))
                    .header("X-User-Email", getClaim(claims, "email"))
                    .header("X-Session-Id", getClaim(claims, "sessionId"))
                    .build();

                return chain.filter(exchange.mutate().request(mutatedRequest).build());

            } catch (ExpiredJwtException e) {
                return unauthorized(exchange.getResponse(), "Token has expired");
            } catch (SignatureException e) {
                return unauthorized(exchange.getResponse(), "Invalid token signature");
            } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
                return unauthorized(exchange.getResponse(), "Invalid token format");
            }
        };
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
     * Safely extracts a claim value, returning empty string if null.
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

    public static class Config {
        // Configuration properties if needed
    }
}
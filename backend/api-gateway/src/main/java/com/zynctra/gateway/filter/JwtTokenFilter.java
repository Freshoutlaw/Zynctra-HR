package com.zynctra.gateway.filter;

import com.zynctra.common.constant.ApiConstants;
import com.zynctra.common.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Component
public class JwtTokenFilter implements GlobalFilter, Ordered {
    private final JwtTokenProvider jwtTokenProvider;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Skip JWT validation for auth endpoints
        if (path.startsWith("/api/v1/auth/login") || path.startsWith("/api/v1/auth/register")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String requestId = exchange.getRequest().getHeaders().getFirst(ApiConstants.X_REQUEST_ID);

        if (requestId == null) {
            requestId = UUID.randomUUID().toString();
        }

        if (authHeader != null && authHeader.startsWith(ApiConstants.BEARER_PREFIX)) {
            String token = authHeader.substring(ApiConstants.BEARER_PREFIX.length());

            if (jwtTokenProvider.isTokenValid(token) && !jwtTokenProvider.isTokenExpired(token)) {
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                String tenantId = jwtTokenProvider.getTenantIdFromToken(token);

                exchange.getRequest().mutate()
                        .header(ApiConstants.X_USER_ID, userId)
                        .header(ApiConstants.X_TENANT_ID, tenantId)
                        .header(ApiConstants.X_REQUEST_ID, requestId)
                        .build();

                return chain.filter(exchange);
            } else {
                log.warn("Invalid or expired token");
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        } else {
            log.warn("Missing authorization header for path: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -1;
    }
}

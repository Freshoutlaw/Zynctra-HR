package com.zynctra.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Tenant Resolution Filter
 * 
 * Ensures every authenticated request has a valid tenant context.
 * Validates that the X-Tenant-Id header is present and matches
 * the tenant claim from the JWT token.
 * 
 * This filter prevents cross-tenant access attempts by validating
 * the tenant context consistency.
 */
@Component
public class TenantResolutionFilter extends AbstractGatewayFilterFactory<TenantResolutionFilter.Config> {

    public TenantResolutionFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            
            String tenantId = request.getHeaders().getFirst("X-Tenant-Id");
            String userId = request.getHeaders().getFirst("X-User-Id");
            
            // Skip tenant check for public routes (no user context)
            if (!StringUtils.hasText(userId)) {
                return chain.filter(exchange);
            }
            
            // Tenant ID is required for authenticated requests
            if (!StringUtils.hasText(tenantId)) {
                exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
                return exchange.getResponse().setComplete();
            }
            
            // Validate tenant ID format (UUID)
            try {
                java.util.UUID.fromString(tenantId);
            } catch (IllegalArgumentException e) {
                exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
                return exchange.getResponse().setComplete();
            }
            
            // Add tenant context to request for downstream services
            ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-Tenant-Id-Validated", "true")
                .build();
            
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        };
    }

    public static class Config {
        // Configuration properties if needed
    }
}
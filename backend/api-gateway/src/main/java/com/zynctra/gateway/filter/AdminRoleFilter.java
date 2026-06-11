package com.zynctra.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Admin Role Filter
 * 
 * Restricts access to admin endpoints to users with
 * SUPER_ADMIN or TENANT_ADMIN roles only.
 * 
 * Must be applied after JwtAuthenticationFilter so that
 * the X-User-Role header is populated.
 */
@Component
public class AdminRoleFilter extends AbstractGatewayFilterFactory<AdminRoleFilter.Config> {

    private static final String ROLE_HEADER = "X-User-Role";
    private static final String SUPER_ADMIN = "SUPER_ADMIN";
    private static final String TENANT_ADMIN = "TENANT_ADMIN";

    public AdminRoleFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String role = exchange.getRequest().getHeaders().getFirst(ROLE_HEADER);
            
            if (!StringUtils.hasText(role)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
            
            boolean isAdmin = SUPER_ADMIN.equals(role) || TENANT_ADMIN.equals(role);
            
            // SUPER_ADMIN can access all admin endpoints
            // TENANT_ADMIN can access tenant-scoped admin endpoints
            if (!isAdmin) {
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
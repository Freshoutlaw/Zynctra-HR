package com.zynctra.gateway.config;

import com.zynctra.gateway.filter.*;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

/**
 * Gateway Configuration
 * 
 * Registers custom gateway filters and configures the filter execution order.
 * Lower order values execute first.
 * 
 * Filter execution order:
 * 1. LoggingFilter (-2) - Log all requests
 * 2. SecurityHeaderFilter (-1) - Add security headers
 * 3. CsrfValidationFilter (0) - Validate CSRF tokens
 * 4. JwtAuthenticationFilter (1) - Validate JWT tokens
 * 5. TenantContextFilter (2) - Resolve and validate tenant
 * 6. AdminRoleFilter (3) - Check admin roles (conditional)
 * 7. RateLimitingFilter (10) - Apply rate limits
 */
@Configuration
public class GatewayConfig {

    @Bean
    @Order(-2)
    public GlobalFilter loggingFilter() {
        return new LoggingFilter();
    }

    @Bean
    @Order(-1)
    public GlobalFilter securityHeaderFilter() {
        return new SecurityHeaderFilter();
    }

    @Bean
    public GatewayFilterFactory<CsrfValidationFilter.Config> csrfValidationFilterFactory() {
        return new CsrfValidationFilter();
    }

    @Bean
    public GatewayFilterFactory<JwtAuthenticationFilter.Config> jwtAuthenticationFilterFactory() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public GatewayFilterFactory<TenantContextFilter.Config> tenantContextFilterFactory() {
        return new TenantContextFilter();
    }

    @Bean
    public GatewayFilterFactory<AdminRoleFilter.Config> adminRoleFilterFactory() {
        return new AdminRoleFilter();
    }

    @Bean
    public GatewayFilterFactory<RateLimitingFilter.Config> rateLimitingFilterFactory() {
        return new RateLimitingFilter();
    }
}
package com.zynctra.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security Configuration
 * 
 * Configures Spring Security for the reactive API Gateway.
 * Disables default form login and CSRF (handled by custom filters)
 * and enables stateless JWT-based authentication at the gateway level.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
            // Disable default CSRF - handled by custom CsrfValidationFilter
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            
            // Disable form login - we use JWT
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
            
            // Disable HTTP basic auth
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            
            // Stateless sessions
            .securityContextRepository(
                org.springframework.security.web.server.context.NoOpServerSecurityContextRepository.getInstance()
            )
            
            // Authorize requests
            .authorizeExchange(exchanges -> exchanges
                // Public endpoints - no authentication required
                .pathMatchers(
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/forgot-password",
                    "/api/auth/reset-password",
                    "/api/auth/refresh",
                    "/api/billing/webhooks/**",
                    "/api/plans",
                    "/health",
                    "/actuator/health",
                    "/actuator/info"
                ).permitAll()
                
                // WebSocket terminal - authenticated via query param (handled separately)
                .pathMatchers("/ws/terminal/**").authenticated()
                
                // All other requests require authentication
                .anyExchange().authenticated()
            )
            
            // Exception handling
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint((exchange, ex) -> {
                    exchange.getResponse().setStatusCode(
                        org.springframework.http.HttpStatus.UNAUTHORIZED
                    );
                    return exchange.getResponse().setComplete();
                })
                .accessDeniedHandler((exchange, ex) -> {
                    exchange.getResponse().setStatusCode(
                        org.springframework.http.HttpStatus.FORBIDDEN
                    );
                    return exchange.getResponse().setComplete();
                })
            )
            
            .build();
    }
}
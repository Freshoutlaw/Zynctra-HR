package com.zynctra.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Route Configuration
 * 
 * Defines explicit route configurations for downstream services.
 * Routes are also declared in application.yml; this class provides
 * programmatic route definitions for complex routing logic.
 */
@Configuration
public class RouteConfig {

    /**
     * Custom route locator for advanced routing scenarios.
     * Primary routes are defined in application.yml.
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Health check route for load balancer
            .route("health-check", r -> r
                .path("/health")
                .uri("http://localhost:8080/actuator/health"))
            
            // WebSocket route for admin terminal
            .route("terminal-websocket", r -> r
                .path("/ws/terminal/**")
                .uri("lb:ws://admin-service"))
            
            .build();
    }
}
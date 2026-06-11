package com.zynctra.gateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class GatewayRouteConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes
                .route("auth-login", r -> r
                        .path("/api/v1/auth/login")
                        .uri("http://localhost:8001/auth"))
                .route("auth-register", r -> r
                        .path("/api/v1/auth/register")
                        .uri("http://localhost:8001/auth"))
                .route("auth-refresh", r -> r
                        .path("/api/v1/auth/refresh")
                        .uri("http://localhost:8001/auth"))
                .route("auth-me", r -> r
                        .path("/api/v1/auth/me")
                        .uri("http://localhost:8001/auth"))
                .route("auth-logout", r -> r
                        .path("/api/v1/auth/logout")
                        .uri("http://localhost:8001/auth"))
                .route("auth-password-reset", r -> r
                        .path("/api/v1/auth/password-reset", "/api/v1/auth/verify")
                        .uri("http://localhost:8001/auth"))

                // Core HR Routes
                .route("employees", r -> r
                        .path("/api/v1/employees/**")
                        .uri("http://localhost:8002/hr"))

                // Payroll Routes
                .route("payroll", r -> r
                        .path("/api/v1/payroll/**")
                        .uri("http://localhost:8003/payroll"))

                // ATS Routes
                .route("ats", r -> r
                        .path("/api/v1/ats/**")
                        .uri("http://localhost:8004/ats"))

                // Time & Attendance Routes
                .route("attendance", r -> r
                        .path("/api/v1/attendance/**")
                        .uri("http://localhost:8005/time-attendance"))

                // Performance Routes
                .route("performance", r -> r
                        .path("/api/v1/performance/**")
                        .uri("http://localhost:8006/performance"))

                // Benefits Routes
                .route("benefits", r -> r
                        .path("/api/v1/benefits/**")
                        .uri("http://localhost:8007/benefits"))

                // Learning Routes
                .route("learning", r -> r
                        .path("/api/v1/learning/**")
                        .uri("http://localhost:8008/learning"))

                // Security Routes
                .route("security", r -> r
                        .path("/api/v1/security/**", "/api/v1/audit/**")
                        .uri("http://localhost:8009/security"))

                // Analytics Routes
                .route("analytics", r -> r
                        .path("/api/v1/analytics/**", "/api/v1/ai/**")
                        .uri("http://localhost:8010/analytics"))

                // Connectors Routes
                .route("connectors", r -> r
                        .path("/api/v1/connectors/**")
                        .uri("http://localhost:8011/connectors"))

                .build();
    }
}

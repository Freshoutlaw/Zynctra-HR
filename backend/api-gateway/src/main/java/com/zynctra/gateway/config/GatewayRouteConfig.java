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
                        .uri("http://auth-service:8001"))
                .route("auth-register", r -> r
                        .path("/api/v1/auth/register")
                        .uri("http://auth-service:8001"))
                .route("auth-refresh", r -> r
                        .path("/api/v1/auth/refresh")
                        .uri("http://auth-service:8001"))
                .route("auth-me", r -> r
                        .path("/api/v1/auth/me")
                        .uri("http://auth-service:8001"))
                .route("auth-logout", r -> r
                        .path("/api/v1/auth/logout")
                        .uri("http://auth-service:8001"))
                .route("auth-password-reset", r -> r
                        .path("/api/v1/auth/password-reset", "/api/v1/auth/verify")
                        .uri("http://auth-service:8001"))

                // Core HR Routes
                .route("employees", r -> r
                        .path("/api/v1/employees/**")
                        .uri("http://core-hr-service:8002"))

                // Payroll Routes
                .route("payroll", r -> r
                        .path("/api/v1/payroll/**")
                        .uri("http://payroll-service:8003"))

                // ATS Routes
                .route("ats", r -> r
                        .path("/api/v1/ats/**")
                        .uri("http://ats-service:8004"))

                // Time & Attendance Routes
                .route("attendance", r -> r
                        .path("/api/v1/attendance/**")
                        .uri("http://time-attendance-service:8005"))

                // Performance Routes
                .route("performance", r -> r
                        .path("/api/v1/performance/**")
                        .uri("http://performance-service:8007"))

                // Benefits Routes
                .route("benefits", r -> r
                        .path("/api/v1/benefits/**")
                        .uri("http://benefits-service:8086"))

                // Learning Routes
                .route("learning", r -> r
                        .path("/api/v1/learning/**")
                        .uri("http://learning-service:8008"))

                // Security Routes
                .route("security", r -> r
                        .path("/api/v1/security/**", "/api/v1/audit/**")
                        .uri("http://security-admin-service:8009"))

                // Analytics Routes
                .route("analytics", r -> r
                        .path("/api/v1/analytics/**", "/api/v1/ai/**")
                        .uri("http://analytics-service:8006"))

                // Connectors Routes
                .route("connectors", r -> r
                        .path("/api/v1/connectors/**")
                        .uri("http://connector-service:8010"))

                .build();
    }
}

package com.zynctra.analytics.config;

import com.zynctra.analytics.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security Configuration
 * 
 * Configures Spring Security for the Analytics Service.
 * Uses stateless JWT authentication with role-based access control.
 * All endpoints require authentication except health checks.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                
                // Dashboard endpoints - any authenticated user
                .requestMatchers(HttpMethod.GET, "/api/analytics/dashboard/**").authenticated()
                
                // Report endpoints - any authenticated user can view
                .requestMatchers(HttpMethod.GET, "/api/analytics/reports/**").authenticated()
                
                // Report creation/modification - HR_MANAGER and above
                .requestMatchers(HttpMethod.POST, "/api/analytics/reports/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/analytics/reports/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/analytics/reports/**")
                    .hasAnyAuthority("TENANT_ADMIN", "SUPER_ADMIN")
                
                // Export endpoints - any authenticated user
                .requestMatchers("/api/analytics/exports/**").authenticated()
                
                // Scheduled reports - HR_MANAGER and above
                .requestMatchers("/api/analytics/scheduled/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                
                // Trend analysis - HR_MANAGER and above
                .requestMatchers("/api/analytics/trends/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                
                // Admin analytics - SUPER_ADMIN only
                .requestMatchers("/api/analytics/admin/**")
                    .hasAuthority("SUPER_ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
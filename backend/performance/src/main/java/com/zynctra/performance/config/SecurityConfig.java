package com.zynctra.performance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security Configuration for Performance Service
 * 
 * Zero-Trust principles:
 * - All endpoints require authentication by default
 * - Role-based access control (RBAC) enforced
 * - No session state (stateless JWT)
 * - CORS strictly limited
 * - CSRF disabled for stateless API (replaced by token validation)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

    private static final List<String> ALLOWED_ORIGINS = List.of(
        "https://app.zynctra.com",
        "https://admin.zynctra.com"
    );

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http
            // Stateless — no sessions
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // CSRF not needed for stateless JWT, but we enforce token validation
            .csrf(csrf -> csrf.disable())
            
            // CORS strictly controlled
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public health check only
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                
                // Admin endpoints restricted
                .requestMatchers("/api/performance/admin/**").hasRole("PERFORMANCE_ADMIN")
                
                // Manager endpoints
                .requestMatchers("/api/performance/manager/**").hasAnyRole("MANAGER", "PERFORMANCE_ADMIN", "HR_ADMIN")
                
                // Self-service endpoints (employees view own data)
                .requestMatchers("/api/performance/self/**").hasAnyRole("EMPLOYEE", "MANAGER", "PERFORMANCE_ADMIN")
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            
            // Add JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            
            // Security headers
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.headerValue(org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.XXssConfig.HeaderValue.ENABLED_MODE_BLOCK))
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(ALLOWED_ORIGINS);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Tenant-ID", "X-Request-ID"));
        config.setExposedHeaders(Arrays.asList("X-RateLimit-Limit", "X-RateLimit-Remaining"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
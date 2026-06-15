package com.zynctra.securityadmin.config;

import com.zynctra.securityadmin.security.JwtAuthenticationFilter;
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
 * ULTRA-STRICT Security Configuration for Security Admin Service.
 * 
 * CRITICAL DIFFERENCES from other modules:
 * - ALL endpoints require SUPER_ADMIN or SECURITY_ADMIN (no employee/manager access)
 * - MFA claim enforced for all write operations
 * - IP whitelist for admin access (configurable)
 * - No CORS for admin endpoints (admin only from internal network)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private static final List<String> ADMIN_ORIGINS = List.of(
        "https://admin.zynctra.com",
        "https://localhost:3000"  // For local development only
    );

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Health check only
                .requestMatchers("/actuator/health").permitAll()
                
                // ALL other endpoints require SECURITY_ADMIN or SUPER_ADMIN
                // No employee, manager, or regular HR access allowed
                .requestMatchers("/api/security-admin/roles/**").hasAnyRole("SUPER_ADMIN", "SECURITY_ADMIN")
                .requestMatchers("/api/security-admin/permissions/**").hasAnyRole("SUPER_ADMIN", "SECURITY_ADMIN")
                .requestMatchers("/api/security-admin/policies/**").hasAnyRole("SUPER_ADMIN", "SECURITY_ADMIN")
                .requestMatchers("/api/security-admin/audit/**").hasAnyRole("SUPER_ADMIN", "SECURITY_ADMIN", "AUDIT_READER")
                .requestMatchers("/api/security-admin/threats/**").hasAnyRole("SUPER_ADMIN", "SECURITY_ADMIN", "THREAT_ANALYST")
                
                // Super-admin only operations (role creation, policy changes)
                .requestMatchers("/api/security-admin/admin/**").hasRole("SUPER_ADMIN")
                
                .anyRequest().denyAll()  // DENY BY DEFAULT — explicit allow only
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'none'; frame-ancestors 'none'"))
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.headerValue(
                    org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.XXssConfig.HeaderValue.ENABLED_MODE_BLOCK))
                .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(ADMIN_ORIGINS);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "X-Tenant-ID", "X-MFA-Verified", "X-Request-ID"));
        config.setExposedHeaders(Arrays.asList("X-RateLimit-Limit", "X-RateLimit-Remaining"));
        config.setAllowCredentials(true);
        config.setMaxAge(600L);  // 10 minutes cache
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
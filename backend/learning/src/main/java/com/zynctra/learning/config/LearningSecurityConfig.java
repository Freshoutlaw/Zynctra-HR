package com.zynctra.learning.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class LearningSecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain learningApiSecurity(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/learning/**")
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.headerValue(
                    org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                .contentTypeOptions(contentType -> {})
                .httpStrictTransportSecurity(hsts -> hsts.maxAgeInSeconds(31536000).includeSubDomains(true))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/learning/health").permitAll()
                .requestMatchers("/api/learning/tutor/**").authenticated()
                .requestMatchers("/api/learning/courses/**").authenticated()
                .requestMatchers("/api/learning/paths/**").authenticated()
                .requestMatchers("/api/learning/progress/**").authenticated()
                .requestMatchers("/api/learning/certifications/**").authenticated()
                .requestMatchers("/api/learning/content/upload").hasAnyRole("INSTRUCTOR", "ADMIN", "LEARNING_ADMIN")
                .requestMatchers("/api/learning/admin/**").hasAnyRole("LEARNING_ADMIN", "ADMIN")
                .requestMatchers("/api/learning/threats/**").hasRole("SECURITY_ADMIN")
                .anyRequest().denyAll()
            );
        return http.build();
    }
}
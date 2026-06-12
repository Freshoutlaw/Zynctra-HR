package com.zynctra.payroll.config;

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
public class PayrollSecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain payrollApiSecurity(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/payroll/**")
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
                .requestMatchers("/api/payroll/health").permitAll()
                .requestMatchers("/api/payroll/runs/*/disburse").hasRole("PAYROLL_ADMIN")
                .requestMatchers("/api/payroll/runs/*/reconcile").hasRole("PAYROLL_ADMIN")
                .requestMatchers("/api/payroll/runs/*/approve").hasAnyRole("PAYROLL_ADMIN", "PAYROLL_APPROVER")
                .requestMatchers("/api/payroll/runs/**").hasAnyRole("PAYROLL_ADMIN", "PAYROLL_PROCESSOR")
                .requestMatchers("/api/payroll/employees/**/bank-accounts").authenticated()
                .requestMatchers("/api/payroll/**/export").hasAnyRole("PAYROLL_ADMIN", "FINANCE", "ADMIN")
                .anyRequest().denyAll()
            );
        return http.build();
    }
}
package com.zynctra.connector.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.zynctra.connector.security.WebhookAuthenticationFilter;
import com.zynctra.connector.security.WebhookRateLimitFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class ConnectorSecurityConfig {

    private final WebhookAuthenticationFilter webhookAuthFilter;
    private final WebhookRateLimitFilter rateLimitFilter;

    public ConnectorSecurityConfig(WebhookAuthenticationFilter webhookAuthFilter,
                                    WebhookRateLimitFilter rateLimitFilter) {
        this.webhookAuthFilter = webhookAuthFilter;
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain webhookSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/connectors/webhooks/**", "/api/connectors/callbacks/**")
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(webhookAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/connectors/webhooks/**").authenticated()
                .requestMatchers("/api/connectors/callbacks/**").authenticated()
                .anyRequest().denyAll()
            );
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/connectors/**")
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/connectors/health").permitAll()
                .requestMatchers("/api/connectors/admin/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/connectors/**").hasAnyRole("ADMIN", "CONNECTOR_MANAGER")
                .anyRequest().denyAll()
            );
        return http.build();
    }
}
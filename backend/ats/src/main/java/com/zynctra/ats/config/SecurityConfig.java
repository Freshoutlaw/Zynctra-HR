package com.zynctra.ats.config;

import com.zynctra.ats.security.JwtAuthenticationFilter;
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
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/jobs/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/jobs/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/jobs/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**")
                    .hasAnyAuthority("TENANT_ADMIN", "SUPER_ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/candidates/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/candidates/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/candidates/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/candidates/**")
                    .hasAnyAuthority("TENANT_ADMIN", "SUPER_ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/applications/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/applications").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/applications/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/applications/**")
                    .hasAnyAuthority("TENANT_ADMIN", "SUPER_ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/interviews/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/interviews/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/interviews/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/offers/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/offers/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/offers/**")
                    .hasAnyAuthority("HR_MANAGER", "TENANT_ADMIN", "SUPER_ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
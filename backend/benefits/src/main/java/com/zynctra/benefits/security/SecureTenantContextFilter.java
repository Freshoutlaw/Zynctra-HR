package com.zynctra.benefits.security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.zynctra.benefits.security.TenantContext;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 100)
public class SecureTenantContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try {
            if (auth != null && auth instanceof TenantAuthenticationToken token) {
                UUID tenantId = token.getTenantId();
                UUID userId = UUID.fromString(token.getPrincipal().toString());
                String role = token.getAuthorities().stream()
                    .findFirst().map(a -> a.getAuthority()).orElse("ROLE_USER");

                String correlationId = request.getHeader("X-Request-Id");
                if (correlationId == null || !correlationId.matches("^[a-zA-Z0-9\\-]{8,64}$")) {
                    correlationId = UUID.randomUUID().toString().substring(0, 8);
                }

                TenantContext.set(tenantId, userId, role, correlationId);
                response.setHeader("X-Request-Id", correlationId);
            }
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
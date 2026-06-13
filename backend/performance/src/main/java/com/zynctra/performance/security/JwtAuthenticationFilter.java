package com.zynctra.performance.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT Authentication Filter
 * 
 * SECURITY:
 * - Validates JWT signature and expiration
 * - Extracts tenant ID from JWT claims and sets in TenantContext
 * - Rejects malformed or missing tokens
 * - Stateless — no session storage
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                     HttpServletResponse response, 
                                     FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

            Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

            String userId = claims.getSubject();
            String tenantId = claims.get("tenant_id", String.class);
            List<String> roles = claims.get("roles", List.class);

            if (userId == null || tenantId == null) {
                throw new JwtException("Missing required claims");
            }

            // Validate tenant ID format
            if (!tenantId.matches("^[a-zA-Z0-9\-_]{4,64}$")) {
                throw new SecurityException("Invalid tenant ID in token");
            }

            // Set tenant context
            TenantContext.setCurrentTenant(tenantId);

            // Build authentication
            var authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());

            var auth = new UsernamePasswordAuthenticationToken(
                userId, null, authorities);
            auth.setDetails(tenantId);

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (JwtException | SecurityException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid token\"}");
            return;
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/actuator/health") || path.startsWith("/actuator/info");
    }
}
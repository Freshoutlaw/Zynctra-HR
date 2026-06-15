package com.zynctra.securityadmin.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT Authentication Filter with MFA claim validation.
 * 
 * CRITICAL: For security admin, MFA is MANDATORY for all operations.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.require-mfa-for-admin:true}")
    private boolean requireMfa;

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
            Boolean mfaVerified = claims.get("mfa_verified", Boolean.class);
            
            if (userId == null || tenantId == null) {
                throw new JwtException("Missing required claims");
            }

            if (!tenantId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
                throw new SecurityException("Invalid tenant ID in token");
            }

            // CRITICAL: MFA verification for admin access
            if (requireMfa && (mfaVerified == null || !mfaVerified)) {
                if (isAdminEndpoint(request.getRequestURI())) {
                    throw new SecurityException("MFA verification required for admin operations");
                }
            }

            TenantContext.setCurrentTenant(tenantId);
            
            var authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
            
            var auth = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            auth.setDetails(tenantId);
            
            SecurityContextHolder.getContext().setAuthentication(auth);
            
        } catch (JwtException | SecurityException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private boolean isAdminEndpoint(String uri) {
        return uri.contains("/security-admin/");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/actuator/health");
    }
}
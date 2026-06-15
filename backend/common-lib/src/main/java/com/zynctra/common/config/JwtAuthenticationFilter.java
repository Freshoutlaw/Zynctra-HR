package com.zynctra.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    // Load from environment - NEVER hardcode
    private final SecretKey jwtSecretKey;
    private final long jwtExpirationMs;
    
    public JwtAuthenticationFilter() {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("JWT_SECRET must be set and >= 32 bytes");
        }
        this.jwtSecretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = Long.parseLong(System.getenv().getOrDefault("JWT_EXPIRATION_MS", "900000")); // 15 min default
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);
        
        try {
            // STRICT validation
            Jws<Claims> claimsJws = Jwts.parser()
                .verifyWith(jwtSecretKey)
                .requireIssuer(System.getenv("JWT_ISSUER"))
                .requireAudience(System.getenv("JWT_AUDIENCE"))
                .clockSkewSeconds(30)
                .build()
                .parseSignedClaims(jwt);
            
            Claims claims = claimsJws.getPayload();
            
            // Additional validation
            Instant expiration = claims.getExpiration().toInstant();
            if (expiration.isBefore(Instant.now())) {
                throw new ExpiredJwtException(null, claims, "Token expired");
            }
            
            String username = claims.getSubject();
            String tenantId = claims.get("tenant_id", String.class);
            List<String> roles = claims.get("roles", List.class);
            
            if (username == null || tenantId == null) {
                throw new MalformedJwtException("Missing required claims");
            }

            // Bind tenant to request attribute for downstream use
            request.setAttribute("tenant_id", tenantId);
            TenantContext.setCurrentTenant(tenantId);

            var authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

            var authToken = new UsernamePasswordAuthenticationToken(
                username, null, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            SecurityContextHolder.getContext().setAuthentication(authToken);
            
        } catch (ExpiredJwtException e) {
            SEC_LOG.warn("SECURITY_EVENT: expired_token_attempt ip={} uri={}", 
                request.getRemoteAddr(), request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"token_expired\"}");
            return;
        } catch (JwtException | IllegalArgumentException e) {
            SEC_LOG.warn("SECURITY_EVENT: invalid_token_attempt ip={} uri={} error={}", 
                request.getRemoteAddr(), request.getRequestURI(), e.getClass().getSimpleName());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"invalid_token\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
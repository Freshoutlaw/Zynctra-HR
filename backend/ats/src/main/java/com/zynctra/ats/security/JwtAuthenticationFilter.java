package com.zynctra.ats.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.SignatureException;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.issuer:zynctra-hr}")
    private String expectedIssuer;

    @Value("${jwt.audience:zynctra-api}")
    private String expectedAudience;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Add security headers to every response
        addSecurityHeaders(response);

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            // Validate secret minimum length (256 bits = 32 bytes for HS256)
            if (jwtSecret == null || jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
                log.error("JWT secret is too short or not configured. Minimum 32 bytes required.");
                response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Authentication misconfiguration");
                return;
            }

            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                .verifyWith(key)
                .requireIssuer(expectedIssuer)
                .requireAudience(expectedAudience)
                .build()
                .parseSignedClaims(token)
                .getPayload();

            // Explicit expiration check
            Date expiration = claims.getExpiration();
            if (expiration == null || expiration.before(Date.from(Instant.now()))) {
                log.warn("JWT token expired for user: {}", claims.getSubject());
                response.sendError(HttpStatus.UNAUTHORIZED.value(), "Token expired");
                return;
            }

            String userId = claims.getSubject();
            String role = claims.get("role", String.class);
            String tenantId = claims.get("tenantId", String.class);
            String email = claims.get("email", String.class);

            if (userId == null || tenantId == null || role == null) {
                log.warn("JWT missing required claims");
                response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid token claims");
                return;
            }

            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

            TenantAuthenticationToken authentication = new TenantAuthenticationToken(
                userId, null, authorities, UUID.fromString(tenantId), email
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            request.setAttribute("X-Tenant-Id", tenantId);
            request.setAttribute("X-User-Id", userId);
            request.setAttribute("X-User-Role", role);

        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Token expired");
            return;
        } catch (SignatureException | MalformedJwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid token");
            return;
        } catch (Exception e) {
            log.error("JWT validation error: {}", e.getMessage());
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Authentication failed");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void addSecurityHeaders(HttpServletResponse response) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'none'");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Block ALL actuator endpoints by default, explicitly allow only health/info if needed
        return path.startsWith("/actuator/health") || path.startsWith("/actuator/info");
    }
}
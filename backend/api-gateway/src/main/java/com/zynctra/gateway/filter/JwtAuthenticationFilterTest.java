package com.zynctra.gateway.filter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * JWT Authentication Filter Tests
 * 
 * Validates token parsing, expiration handling, and claim extraction.
 */
class JwtAuthenticationFilterTest {

    private JwtAuthenticationFilter filter;
    private static final String SECRET = "test-secret-key-for-jwt-signing-only-32bytes!";
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    @BeforeEach
    void setUp() {
        filter = new JwtAuthenticationFilter();
        ReflectionTestUtils.setField(filter, "jwtSecret", SECRET);
    }

    @Test
    void shouldPassWithValidToken() {
        // Given
        String token = createValidToken(UUID.randomUUID(), "TENANT_ADMIN", "test@zynctra.com");
        
        MockServerHttpRequest request = MockServerHttpRequest
            .get("/api/employees")
            .header("Authorization", "Bearer " + token)
            .build();
        
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        GatewayFilterChain chain = mock(GatewayFilterChain.class);
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // When & Then
        StepVerifier.create(filter.apply(new JwtAuthenticationFilter.Config()).filter(exchange, chain))
            .verifyComplete();

        // Verify headers were added
        assertThat(exchange.getRequest().getHeaders().getFirst("X-User-Id")).isNotNull();
        assertThat(exchange.getRequest().getHeaders().getFirst("X-Tenant-Id")).isNotNull();
        assertThat(exchange.getRequest().getHeaders().getFirst("X-User-Role")).isEqualTo("TENANT_ADMIN");
    }

    @Test
    void shouldRejectMissingAuthorizationHeader() {
        // Given
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/employees").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        GatewayFilterChain chain = mock(GatewayFilterChain.class);

        // When & Then
        StepVerifier.create(filter.apply(new JwtAuthenticationFilter.Config()).filter(exchange, chain))
            .verifyComplete();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void shouldRejectExpiredToken() {
        // Given
        String expiredToken = Jwts.builder()
            .subject(UUID.randomUUID().toString())
            .claim("tenantId", UUID.randomUUID().toString())
            .claim("role", "EMPLOYEE")
            .issuedAt(Date.from(Instant.now().minus(2, ChronoUnit.HOURS)))
            .expiration(Date.from(Instant.now().minus(1, ChronoUnit.HOURS)))
            .signWith(KEY)
            .compact();

        MockServerHttpRequest request = MockServerHttpRequest
            .get("/api/employees")
            .header("Authorization", "Bearer " + expiredToken)
            .build();
        
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        GatewayFilterChain chain = mock(GatewayFilterChain.class);

        // When & Then
        StepVerifier.create(filter.apply(new JwtAuthenticationFilter.Config()).filter(exchange, chain))
            .verifyComplete();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void shouldRejectInvalidTokenSignature() {
        // Given
        String invalidToken = Jwts.builder()
            .subject(UUID.randomUUID().toString())
            .claim("tenantId", UUID.randomUUID().toString())
            .signWith(Keys.hmacShaKeyFor("different-secret-key-32bytes-long!!".getBytes(StandardCharsets.UTF_8)))
            .compact();

        MockServerHttpRequest request = MockServerHttpRequest
            .get("/api/employees")
            .header("Authorization", "Bearer " + invalidToken)
            .build();
        
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        GatewayFilterChain chain = mock(GatewayFilterChain.class);

        // When & Then
        StepVerifier.create(filter.apply(new JwtAuthenticationFilter.Config()).filter(exchange, chain))
            .verifyComplete();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private String createValidToken(UUID userId, String role, String email) {
        UUID tenantId = UUID.randomUUID();
        
        return Jwts.builder()
            .subject(userId.toString())
            .claim("tenantId", tenantId.toString())
            .claim("role", role)
            .claim("email", email)
            .claim("sessionId", UUID.randomUUID().toString())
            .issuedAt(Date.from(Instant.now()))
            .expiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
            .signWith(KEY)
            .compact();
    }
}
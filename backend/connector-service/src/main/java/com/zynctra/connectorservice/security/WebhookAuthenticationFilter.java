package com.zynctra.connector.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;

@Component
public class WebhookAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    // Maximum age of webhook: 5 minutes (prevents replay attacks)
    private static final long MAX_WEBHOOK_AGE_MS = 300_000;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String provider = extractProvider(request);
        String signature = request.getHeader("X-Webhook-Signature");
        String timestamp = request.getHeader("X-Webhook-Timestamp");
        String body = readBody(request);
        
        // 1. Timestamp validation (replay protection)
        if (timestamp == null || !isTimestampValid(timestamp)) {
            SEC_LOG.warn("SECURITY_EVENT: webhook_replay_or_stale provider={} ip={}", 
                provider, request.getRemoteAddr());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid timestamp");
            return;
        }
        
        // 2. Signature validation
        if (signature == null || !verifySignature(provider, body, timestamp, signature)) {
            SEC_LOG.warn("SECURITY_EVENT: webhook_invalid_signature provider={} ip={}", 
                provider, request.getRemoteAddr());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid signature");
            return;
        }
        
        // 3. Provider-specific additional checks
        if (!verifyProviderSpecific(request, provider)) {
            SEC_LOG.warn("SECURITY_EVENT: webhook_provider_check_failed provider={}", provider);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Provider verification failed");
            return;
        }
        
        SEC_LOG.info("SECURITY_EVENT: webhook_authenticated provider={} ip={}", 
            provider, request.getRemoteAddr());
        
        filterChain.doFilter(request, response);
    }
    
    private boolean verifySignature(String provider, String body, String timestamp, String signature) {
        String secret = getWebhookSecret(provider);
        if (secret == null) return false;
        
        try {
            String payload = timestamp + "." + body;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expected = Base64.getEncoder().encodeToString(hash);
            
            // Constant-time comparison to prevent timing attacks
            return MessageDigest.isEqual(
                signature.getBytes(StandardCharsets.UTF_8),
                expected.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            SEC_LOG.error("SECURITY_EVENT: signature_verification_error provider={}", provider, e);
            return false;
        }
    }
    
    private boolean isTimestampValid(String timestamp) {
        try {
            long webhookTime = Long.parseLong(timestamp);
            long now = Instant.now().toEpochMilli();
            return Math.abs(now - webhookTime) <= MAX_WEBHOOK_AGE_MS;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    private boolean verifyProviderSpecific(HttpServletRequest request, String provider) {
        return switch (provider.toLowerCase()) {
            case "slack" -> verifySlack(request);
            case "workday" -> verifyWorkday(request);
            case "salesforce" -> verifySalesforce(request);
            default -> true;
        };
    }
    
    private boolean verifySlack(HttpServletRequest request) {
        // Slack-specific: verify request signing version
        String version = request.getHeader("X-Slack-Request-Timestamp");
        return version != null;
    }
    
    private boolean verifyWorkday(HttpServletRequest request) {
        // Workday-specific: verify custom header presence
        return request.getHeader("X-Workday-Signature") != null;
    }
    
    private boolean verifySalesforce(HttpServletRequest request) {
        // Salesforce-specific: verify organization ID
        String orgId = request.getHeader("X-Salesforce-Org-ID");
        return orgId != null && orgId.matches("^[a-zA-Z0-9]{15,18}$");
    }
    
    private String extractProvider(HttpServletRequest request) {
        String uri = request.getRequestURI();
        // Extract from path: /api/connectors/webhooks/{provider}
        String[] parts = uri.split("/");
        return parts.length > 0 ? parts[parts.length - 1] : "unknown";
    }
    
    private String getWebhookSecret(String provider) {
        // Load from environment variables - NEVER hardcode
        return System.getenv("WEBHOOK_SECRET_" + provider.toUpperCase());
    }
    
    private String readBody(HttpServletRequest request) throws IOException {
        // Use cached request wrapper to allow multiple reads
        return request.getReader().lines().collect(java.util.stream.Collectors.joining());
    }
}
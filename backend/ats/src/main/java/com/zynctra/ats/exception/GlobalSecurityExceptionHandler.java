package com.zynctra.ats.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * Global exception handler for the ATS module.
 *
 * <p><strong>Security-critical design:</strong></p>
 * <ul>
 *   <li>All security exceptions are logged with full internal detail (for SIEM).</li>
 *   <li>Only {@code publicMessage}, {@code errorCode}, and {@code timestamp} are
 *       returned to the client — never stack traces, internal details, or raw data.</li>
 *   <li>For {@link TenantIsolationException}, returns HTTP 404 (not 403) to prevent
 *       resource existence enumeration.</li>
 *   <li>For {@link SecretLeakageException}, returns HTTP 500 to mask detection.</li>
 * </ul>
 */
@Slf4j
@RestControllerAdvice(basePackages = "com.zynctra.ats")
public class GlobalSecurityExceptionHandler {

    private static final String HEADER_RETRY_AFTER = "Retry-After";

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, Object>> handleSecurityException(
            SecurityException ex,
            HttpServletRequest request) {

        // Log full security event to SIEM / security audit log
        log.error("SECURITY_EVENT | endpoint={} | method={} | {}",
            request.getRequestURI(),
            request.getMethod(),
            ex.toSecurityLogEntry()
        );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", ex.getErrorCode());
        body.put("message", ex.getPublicMessage());
        body.put("timestamp", Instant.now().toString());
        body.put("path", request.getRequestURI());
        body.put("requestId", generateSafeRequestId(request));

        ResponseEntity.BodyBuilder builder = ResponseEntity.status(ex.getHttpStatus());

        if (ex instanceof RateLimitExceededException rateEx) {
            builder.header(HEADER_RETRY_AFTER, String.valueOf(rateEx.getRetryAfterSeconds()));
        }

        return builder.body(body);
    }

    @ExceptionHandler(SuspiciousActivityException.class)
    public ResponseEntity<Map<String, Object>> handleSuspiciousActivity(
            SuspiciousActivityException ex,
            HttpServletRequest request) {

        log.error("THREAT_DETECTED | severity={} | rule={} | endpoint={} | ip={} | {}",
            ex.getSeverity(),
            ex.getDetectionRule(),
            request.getRequestURI(),
            maskIp(request.getRemoteAddr()),
            ex.toSecurityLogEntry()
        );

        if (ex.requiresSessionInvalidation()) {
            request.setAttribute("SECURITY_INVALIDATE_SESSION", true);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", ex.getErrorCode());
        body.put("message", ex.getPublicMessage());
        body.put("timestamp", Instant.now().toString());
        body.put("requestId", generateSafeRequestId(request));

        return ResponseEntity.status(ex.getHttpStatus()).body(body);
    }

    @ExceptionHandler(SecretLeakageException.class)
    public ResponseEntity<Map<String, Object>> handleSecretLeakage(
            SecretLeakageException ex,
            HttpServletRequest request) {

        log.error("SECRET_LEAKAGE_ATTEMPT | endpoint={} | ip={} | {}",
            request.getRequestURI(),
            maskIp(request.getRemoteAddr()),
            ex.toSecurityLogEntry()
        );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "INTERNAL_ERROR");
        body.put("message", "An internal error occurred.");
        body.put("timestamp", Instant.now().toString());
        body.put("requestId", generateSafeRequestId(request));

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex,
            HttpServletRequest request) {

        String requestId = generateSafeRequestId(request);

        log.error("UNEXPECTED_ERROR | requestId={} | endpoint={} | {}",
            requestId,
            request.getRequestURI(),
            ex.getMessage(),
            ex
        );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "INTERNAL_ERROR");
        body.put("message", "An unexpected error occurred.");
        body.put("timestamp", Instant.now().toString());
        body.put("requestId", requestId);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    private String generateSafeRequestId(HttpServletRequest request) {
        String existing = request.getHeader("X-Request-Id");
        if (existing != null && existing.matches("^[a-zA-Z0-9\\-]{8,64}$")) {
            return existing;
        }
        return java.util.UUID.randomUUID().toString().substring(0, 8);
    }

    private String maskIp(String ip) {
        if (ip == null) return "unknown";
        if (ip.contains(".")) {
            int lastDot = ip.lastIndexOf('.');
            return lastDot > 0 ? ip.substring(0, lastDot) + ".xxx" : "xxx.xxx.xxx.xxx";
        }
        return "[IPv6_MASKED]";
    }
}
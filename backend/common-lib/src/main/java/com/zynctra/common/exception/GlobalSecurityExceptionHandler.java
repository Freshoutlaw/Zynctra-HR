package com.zynctra.common.exception;

import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalSecurityExceptionHandler {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, Object>> handleSecurityException(SecurityException ex) {
        SEC_LOG.warn("SECURITY_EVENT: security_exception message={}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 403,
                "error", "Security violation",
                "message", "Request blocked by security controls"
            ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        SEC_LOG.warn("SECURITY_EVENT: access_denied message={}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 403,
                "error", "Access denied",
                "message", "Insufficient privileges"
            ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        SEC_LOG.warn("SECURITY_EVENT: bad_credentials message={}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 401,
                "error", "Authentication failed",
                "message", "Invalid credentials"
            ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        // NEVER expose stack traces or internal details
        SEC_LOG.error("SECURITY_EVENT: unhandled_exception type={} message={}", 
            ex.getClass().getSimpleName(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 500,
                "error", "Internal error",
                "message", "An unexpected error occurred"
            ));
    }
}
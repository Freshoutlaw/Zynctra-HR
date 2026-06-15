package com.zynctra.securityadmin.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(basePackages = "com.zynctra.securityadmin")
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(SecurityPolicyException.class)
    public ResponseEntity<ErrorResponse> handleSecurityPolicyException(SecurityPolicyException ex) {
        logger.warn("Security policy error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Security Policy Error", ex.getMessage(), Instant.now()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        logger.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(HttpStatus.FORBIDDEN.value(), "Access Denied", "You do not have permission to perform this operation.", Instant.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> { String fieldName = ((FieldError) error).getField(); errors.put(fieldName, error.getDefaultMessage()); });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Validation Failed", "Request validation failed. Check field errors.", Instant.now(), errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Error", "An unexpected error occurred. Please contact support.", Instant.now()));
    }

    public static class ErrorResponse {
        private final int status; private final String error; private final String message; private final Instant timestamp; private final Map<String, String> fieldErrors;
        public ErrorResponse(int status, String error, String message, Instant timestamp) { this(status, error, message, timestamp, null); }
        public ErrorResponse(int status, String error, String message, Instant timestamp, Map<String, String> fieldErrors) { this.status = status; this.error = error; this.message = message; this.timestamp = timestamp; this.fieldErrors = fieldErrors; }
        public int getStatus() { return status; } public String getError() { return error; } public String getMessage() { return message; } public Instant getTimestamp() { return timestamp; } public Map<String, String> getFieldErrors() { return fieldErrors; }
    }
}
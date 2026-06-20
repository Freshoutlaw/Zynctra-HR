package com.zynctra.benefits.exception;

public class SuspiciousActivityException extends SecurityException {

    private final String message;

    public SuspiciousActivityException(String message) {
        super(message);
        this.message = message;
    }

    public static SuspiciousActivityException promptInjection(String tenantId, String userId, String patternName) {
        String msg = "Suspicious activity detected: prompt injection pattern '" + patternName
                + "' for tenant " + tenantId + ", user " + userId;
        return new SuspiciousActivityException(msg);
    }

    @Override
    public String getMessage() {
        return message;
    }
}
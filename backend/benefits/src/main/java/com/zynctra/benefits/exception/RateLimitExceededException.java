package com.zynctra.benefits.exception;

public class RateLimitExceededException extends RuntimeException {

    private final String message;
    private final String tenantId;
    private final String userId;
    private final int retryAfterSeconds;

    public RateLimitExceededException(String message, String tenantId, String userId, int retryAfterSeconds) {
        super(message);
        this.message = message;
        this.tenantId = tenantId;
        this.userId = userId;
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public String getTenantId() {
        return tenantId;
    }

    public String getUserId() {
        return userId;
    }

    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
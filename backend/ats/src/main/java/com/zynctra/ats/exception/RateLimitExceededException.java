package com.zynctra.ats.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a client exceeds the configured rate limit.
 *
 * <p>Maps to HTTP 429 Too Many Requests. Includes a {@code retryAfter}
 * hint for well-behaved clients.</p>
 */
public class RateLimitExceededException extends SecurityException {

    private static final HttpStatus STATUS = HttpStatus.TOO_MANY_REQUESTS;
    private static final String CODE = "ATS-RATE-001";
    private static final String PUBLIC_MSG = "Rate limit exceeded. Please slow down your requests.";

    private final int retryAfterSeconds;

    public RateLimitExceededException(String internalDetail,
                                       String tenantId,
                                       String userId,
                                       int retryAfterSeconds) {
        super(STATUS, CODE, PUBLIC_MSG, internalDetail, tenantId, userId);
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }

    public static RateLimitExceededException forEndpoint(String endpoint,
                                                          String tenantId,
                                                          String userId,
                                                          int retryAfter) {
        return new RateLimitExceededException(
            String.format("Rate limit exceeded on endpoint=%s", endpoint),
            tenantId,
            userId,
            retryAfter
        );
    }
}
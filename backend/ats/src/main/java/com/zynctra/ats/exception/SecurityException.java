package com.zynctra.ats.exception;

import org.springframework.http.HttpStatus;

/**
 * Base exception for all security-related errors in the ATS module.
 * All security exceptions extend this to enable unified handling in
 * {@link com.zynctra.ats.exception.GlobalSecurityExceptionHandler}.
 *
 * <p>Design principle: Never leak internal details to the client.
 * The {@code publicMessage} is safe to return in API responses;
 * {@code internalDetail} is for logs only.</p>
 */
public abstract class SecurityException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String publicMessage;
    private final String internalDetail;
    private final String tenantId;
    private final String userId;
    private final long timestamp;

    protected SecurityException(HttpStatus httpStatus,
                                String errorCode,
                                String publicMessage,
                                String internalDetail,
                                String tenantId,
                                String userId) {
        super(internalDetail);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.publicMessage = publicMessage;
        this.internalDetail = internalDetail;
        this.tenantId = tenantId;
        this.userId = userId;
        this.timestamp = System.currentTimeMillis();
    }

    protected SecurityException(HttpStatus httpStatus,
                                String errorCode,
                                String publicMessage,
                                String internalDetail,
                                String tenantId,
                                String userId,
                                Throwable cause) {
        super(internalDetail, cause);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.publicMessage = publicMessage;
        this.internalDetail = internalDetail;
        this.tenantId = tenantId;
        this.userId = userId;
        this.timestamp = System.currentTimeMillis();
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getPublicMessage() {
        return publicMessage;
    }

    public String getInternalDetail() {
        return internalDetail;
    }

    public String getTenantId() {
        return tenantId;
    }

    public String getUserId() {
        return userId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    /**
     * Returns a structured log entry suitable for SIEM ingestion.
     * NEVER log raw PII or secrets.
     */
    public String toSecurityLogEntry() {
        return String.format(
            "SECURITY_EVENT | code=%s | status=%d | tenant=%s | user=%s | ts=%d | detail=%s",
            errorCode,
            httpStatus.value(),
            tenantId != null ? tenantId : "unknown",
            userId != null ? "[REDACTED]" : "anonymous",
            timestamp,
            internalDetail
        );
    }
}
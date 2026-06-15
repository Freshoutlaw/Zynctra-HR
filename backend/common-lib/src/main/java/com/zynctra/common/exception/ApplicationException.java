package com.zynctra.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base application exception for all Zynctra exceptions
 */
public class ApplicationException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus status;
    private final Object details;

    public ApplicationException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
        this.details = null;
    }

    public ApplicationException(String message, String errorCode, HttpStatus status, Object details) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
        this.details = details;
    }

    public ApplicationException(String message, String errorCode, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.status = status;
        this.details = null;
    }

    // Getters
    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Object getDetails() {
        return details;
    }
}


package com.zynctra.common.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends ApplicationException {
    public ConflictException(String message) {
        super(message, "CONFLICT", HttpStatus.CONFLICT);
    }

    public ConflictException(String message, Object details) {
        super(message, "CONFLICT", HttpStatus.CONFLICT, details);
    }
}

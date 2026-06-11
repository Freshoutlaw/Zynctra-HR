package com.zynctra.common.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends ApplicationException {
    public ForbiddenException(String message) {
        super(message, "FORBIDDEN", HttpStatus.FORBIDDEN);
    }

    public ForbiddenException() {
        super("Access forbidden", "FORBIDDEN", HttpStatus.FORBIDDEN);
    }
}

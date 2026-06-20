package com.zynctra.ats.exception;

import org.springframework.http.HttpStatus;

public class InputValidationException extends SecurityException {

    public InputValidationException(String publicMessage, String internalDetail, String tenantId, String userId) {
        super(HttpStatus.BAD_REQUEST, "INPUT_VALIDATION_ERROR", publicMessage, internalDetail, tenantId, userId);
    }

    public InputValidationException(String publicMessage, String internalDetail, String tenantId, String userId, Throwable cause) {
        super(HttpStatus.BAD_REQUEST, "INPUT_VALIDATION_ERROR", publicMessage, internalDetail, tenantId, userId, cause);
    }
}

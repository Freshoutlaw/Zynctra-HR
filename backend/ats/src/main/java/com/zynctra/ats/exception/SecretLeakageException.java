package com.zynctra.ats.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when the system detects an attempt to exfiltrate secrets,
 * API keys, passwords, or other sensitive configuration via user input
 * or error message probing.
 *
 * <p>Maps to HTTP 500 Internal Server Error to mask the detection.
 * This is a DEFCON-1 level event that must trigger immediate admin alerts.</p>
 */
public class SecretLeakageException extends SecurityException {

    private static final HttpStatus STATUS = HttpStatus.INTERNAL_SERVER_ERROR;
    private static final String CODE = "ATS-SECRET-001";
    private static final String PUBLIC_MSG = "An internal error occurred.";

    public SecretLeakageException(String internalDetail, String tenantId, String userId) {
        super(STATUS, CODE, PUBLIC_MSG, internalDetail, tenantId, userId);
    }

    public static SecretLeakageException detectedInInput(String fieldName,
                                                          String tenantId,
                                                          String userId) {
        return new SecretLeakageException(
            String.format("Potential secret leakage detected in field='%s'", fieldName),
            tenantId,
            userId
        );
    }
}
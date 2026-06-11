package com.zynctra.ats.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an authenticated user lacks permission for an action.
 *
 * <p>Maps to HTTP 403 Forbidden. The public message is generic to avoid
 * revealing role hierarchy or which specific permission was missing.</p>
 */
public class AuthorizationException extends SecurityException {

    private static final HttpStatus STATUS = HttpStatus.FORBIDDEN;
    private static final String CODE = "ATS-AUTHZ-001";
    private static final String PUBLIC_MSG = "You do not have permission to perform this action.";

    public AuthorizationException(String internalDetail, String tenantId, String userId) {
        super(STATUS, CODE, PUBLIC_MSG, internalDetail, tenantId, userId);
    }

    public AuthorizationException(String requiredRole,
                                   String actualRole,
                                   String tenantId,
                                   String userId) {
        super(
            STATUS,
            CODE,
            PUBLIC_MSG,
            String.format(
                "AUTHORIZATION DENIED: Required role=%s, actual role=%s",
                requiredRole, actualRole
            ),
            tenantId,
            userId
        );
    }
}
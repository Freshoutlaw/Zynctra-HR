package com.zynctra.ats.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a request attempts to access data outside its tenant boundary.
 *
 * <p>This is a CRITICAL security exception. It maps to HTTP 404 (not 403)
 * to avoid revealing the existence of cross-tenant resources.</p>
 */
public class TenantIsolationException extends SecurityException {

    private static final HttpStatus STATUS = HttpStatus.NOT_FOUND;
    private static final String CODE = "ATS-TENANT-001";
    private static final String PUBLIC_MSG = "The requested resource was not found.";

    public TenantIsolationException(String internalDetail, String tenantId, String userId) {
        super(STATUS, CODE, PUBLIC_MSG, internalDetail, tenantId, userId);
    }

    public TenantIsolationException(String resourceType,
                                     String resourceId,
                                     String requestTenantId,
                                     String actualTenantId,
                                     String userId) {
        super(
            STATUS,
            CODE,
            PUBLIC_MSG,
            String.format(
                "TENANT ISOLATION BREACH: User from tenant=%s attempted access to %s[id=%s] owned by tenant=%s",
                requestTenantId, resourceType, resourceId, actualTenantId
            ),
            requestTenantId,
            userId
        );
    }
}
package com.zynctra.timeattendance.security;

/**
 * Holds the current tenant ID for the request thread.
 * Set by the security filter before requests reach controllers/services.
 */
public final class TenantContext {

    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {}

    public static String getCurrentTenant() {
        String tenant = CURRENT_TENANT.get();
        if (tenant == null) {
            throw new IllegalStateException("No tenant context found. Tenant ID must be set per request.");
        }
        return tenant;
    }

    public static void setCurrentTenant(String tenantId) {
        if (tenantId == null || tenantId.isBlank()) {
            throw new IllegalArgumentException("Tenant ID must not be null or blank");
        }
        CURRENT_TENANT.set(tenantId);
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}

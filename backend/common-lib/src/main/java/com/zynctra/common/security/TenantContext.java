package com.zynctra.common.security;

public class TenantContext {
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_REQUEST_ID = new ThreadLocal<>();

    public static void setCurrentTenant(String tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static String getCurrentTenant() {
        return CURRENT_TENANT.get();
    }

    // Additional setters used by TenantResolverFilter
    public static void setTenant(String tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static void setUserId(String userId) {
        CURRENT_USER_ID.set(userId);
    }

    public static String getUserId() {
        return CURRENT_USER_ID.get();
    }

    public static void setRequestId(String requestId) {
        CURRENT_REQUEST_ID.set(requestId);
    }

    public static String getRequestId() {
        return CURRENT_REQUEST_ID.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
        CURRENT_USER_ID.remove();
        CURRENT_REQUEST_ID.remove();
    }
}
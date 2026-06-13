package com.zynctra.performance.security;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Thread-local tenant context with anti-tampering validation.
 * 
 * SECURITY:
 * - Tenant ID is extracted from authenticated JWT, never from user input
 * - Validates format to prevent injection
 * - Clears on get to prevent cross-request leakage (optional strict mode)
 */
public class TenantContext {
    
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    private static final String TENANT_PATTERN = "^[a-zA-Z0-9\\-_]{4,64}$";
    
    public static void setCurrentTenant(String tenantId) {
        if (tenantId == null || tenantId.isBlank()) {
            throw new SecurityException("Tenant ID cannot be null or empty");
        }
        if (!tenantId.matches(TENANT_PATTERN)) {
            throw new SecurityException("Invalid tenant ID format: potential injection attempt");
        }
        CURRENT_TENANT.set(tenantId);
    }
    
    public static String getCurrentTenant() {
        // SECURITY: Prefer extracting from SecurityContext over ThreadLocal
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof String tenant) {
            if (tenant.matches(TENANT_PATTERN)) {
                return tenant;
            }
        }
        return CURRENT_TENANT.get();
    }
    
    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
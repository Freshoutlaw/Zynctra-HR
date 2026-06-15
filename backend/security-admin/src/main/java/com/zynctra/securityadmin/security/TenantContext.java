// package com.zynctra.securityadmin.security;

// import org.springframework.security.core.context.SecurityContextHolder;

// public class TenantContext {
    
//     private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
//     private static final String TENANT_PATTERN = "^[a-zA-Z0-9\\-_]{4,64}$";
    
//     public static void setCurrentTenant(String tenantId) {
//         if (tenantId == null || tenantId.isBlank()) {
//             throw new SecurityException("Tenant ID cannot be null or empty");
//         }
//         if (!tenantId.matches(TENANT_PATTERN)) {
//             throw new SecurityException("Invalid tenant ID format: potential injection attempt");
//         }
//         CURRENT_TENANT.set(tenantId);
//     }
    
//     public static String getCurrentTenant() {
//         var auth = SecurityContextHolder.getContext().getAuthentication();
//         if (auth != null && auth.getDetails() instanceof String tenant) {
//             if (tenant.matches(TENANT_PATTERN)) {
//                 return tenant;
//             }
//         }
//         return CURRENT_TENANT.get();
//     }
    
//     public static void clear() {
//         CURRENT_TENANT.remove();
//     }
// }

package com.zynctra.securityadmin.security;

public final class TenantContext {
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    private TenantContext() {}
    public static void setCurrentTenant(String tenantId) {
        if (tenantId == null || tenantId.isBlank()) throw new IllegalArgumentException("Tenant ID cannot be null or blank");
        CURRENT_TENANT.set(tenantId);
    }
    public static String getCurrentTenant() { return CURRENT_TENANT.get(); }
    public static void clear() { CURRENT_TENANT.remove(); }
}
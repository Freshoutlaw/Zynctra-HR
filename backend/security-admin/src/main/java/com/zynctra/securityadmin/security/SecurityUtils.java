package com.zynctra.securityadmin.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) return "anonymous";
        return auth.getName();
    }
    public static boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).anyMatch(roleWithPrefix::equals);
    }
    public static boolean isSuperAdmin() { return hasRole("SUPER_ADMIN"); }
    public static boolean isSecurityAdmin() { return hasRole("SECURITY_ADMIN"); }
    public static String getCurrentTenantId() { return TenantContext.getCurrentTenant(); }
}
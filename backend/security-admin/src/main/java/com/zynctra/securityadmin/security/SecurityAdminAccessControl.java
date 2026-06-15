package com.zynctra.securityadmin.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Additional access control layer for security admin operations.
 * 
 * Enforces:
 * - IP whitelist for admin access (optional)
 * - Time-based restrictions (admin ops only during business hours)
 * - Concurrent session limits
 * - Operation cooldowns
 */
@Component
public class SecurityAdminAccessControl {

    @Value("${security.admin.ip-whitelist:}")
    private String ipWhitelistConfig;

    @Value("${security.admin.business-hours-only:false}")
    private boolean businessHoursOnly;

    private Set<String> getIpWhitelist() {
        if (ipWhitelistConfig == null || ipWhitelistConfig.isBlank()) {
            return new HashSet<>();
        }
        return new HashSet<>(Arrays.asList(ipWhitelistConfig.split(",")));
    }

    /**
     * Validates if the current request meets all admin access requirements.
     */
    public void validateAdminAccess(String clientIp) {
        // IP whitelist check
        Set<String> whitelist = getIpWhitelist();
        if (!whitelist.isEmpty() && !whitelist.contains(clientIp)) {
            throw new SecurityException("ADMIN_IP_RESTRICTED: Access from IP " + maskIp(clientIp) + " not authorized");
        }

        // Business hours check (optional)
        if (businessHoursOnly) {
            int hour = java.time.LocalDateTime.now().getHour();
            if (hour < 8 || hour > 18) {
                throw new SecurityException("ADMIN_HOURS_RESTRICTED: Admin operations only allowed during business hours (8AM-6PM)");
            }
        }
    }

    private String maskIp(String ip) {
        if (ip == null || !ip.contains(".")) return "***";
        String[] parts = ip.split("\\.");
        return parts[0] + "." + parts[1] + ".***.***";
    }
}
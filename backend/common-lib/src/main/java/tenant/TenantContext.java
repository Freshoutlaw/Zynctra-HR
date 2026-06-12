package com.zynctra.common.tenant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

public final class TenantContext {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Pattern TENANT_ID_PATTERN = Pattern.compile("^[a-z0-9][-a-z0-9]{2,62}$");
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    
    private TenantContext() {}

    public static void setCurrentTenant(String tenantId) {
        if (!StringUtils.hasText(tenantId)) {
            throw new IllegalArgumentException("Tenant ID cannot be empty");
        }
        if (!TENANT_ID_PATTERN.matcher(tenantId).matches()) {
            SEC_LOG.error("SECURITY_EVENT: invalid_tenant_id_format attempted_id={}", tenantId);
            throw new SecurityException("Invalid tenant ID format");
        }
        CURRENT_TENANT.set(tenantId);
    }

    public static String getCurrentTenant() {
        String tenant = CURRENT_TENANT.get();
        if (tenant == null) {
            throw new IllegalStateException("No tenant context set - possible security bypass");
        }
        return tenant;
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
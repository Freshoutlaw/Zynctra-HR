package com.zynctra.corehr.security;

import com.zynctra.common.tenant.TenantContext;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Aspect that enforces tenant context presence on ALL repository calls.
 * Prevents cross-tenant data leakage from missing context.
 */
@Aspect
@Component
public class TenantSecurityAspect {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");

    @Around("execution(* com.zynctra.corehr.repository.*.*(..))")
    public Object enforceTenantContext(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            String tenantId = TenantContext.getCurrentTenant();
            if (tenantId == null || tenantId.isBlank()) {
                SEC_LOG.error("SECURITY_EVENT: missing_tenant_context method={}", 
                    joinPoint.getSignature().getName());
                throw new SecurityException("Tenant context required for database access");
            }
            return joinPoint.proceed();
        } catch (IllegalStateException e) {
            SEC_LOG.error("SECURITY_EVENT: tenant_context_error method={} error={}", 
                joinPoint.getSignature().getName(), e.getMessage());
            throw new SecurityException("Invalid tenant context", e);
        }
    }
}
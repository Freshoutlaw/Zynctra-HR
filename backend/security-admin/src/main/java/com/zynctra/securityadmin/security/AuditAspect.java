package com.zynctra.securityadmin.security;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;

@Aspect
public class AuditAspect {
    
    private static final Logger AUDIT_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Logger FRAUD_LOG = LoggerFactory.getLogger("FRAUD_DETECTION");
    
    @Before("@annotation(com.zynctra.securityadmin.security.Audited)")
    public void logBefore(JoinPoint joinPoint) {
        String user = getCurrentUser();
        String method = joinPoint.getSignature().toShortString();
        String tenant = TenantContext.getCurrentTenant();
        String clientIp = getClientIp();
        
        AUDIT_LOG.info("AUDIT|action=ENTER|user={}|tenant={}|method={}|ip={}|timestamp={}",
            maskUserId(user), tenant, method, clientIp, Instant.now());
    }
    
    @AfterReturning("@annotation(com.zynctra.securityadmin.security.Audited)")
    public void logAfterReturning(JoinPoint joinPoint) {
        String user = getCurrentUser();
        String method = joinPoint.getSignature().toShortString();
        
        AUDIT_LOG.info("AUDIT|action=SUCCESS|user={}|method={}|timestamp={}",
            maskUserId(user), method, Instant.now());
    }
    
    @AfterThrowing(pointcut = "@annotation(com.zynctra.securityadmin.security.Audited)", throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Exception ex) {
        String user = getCurrentUser();
        String method = joinPoint.getSignature().toShortString();
        
        if (ex instanceof SecurityException) {
            FRAUD_LOG.warn("FRAUD_ALERT|user={}|method={}|reason={}|timestamp={}",
                maskUserId(user), method, ex.getClass().getSimpleName(), Instant.now());
        }
        
        AUDIT_LOG.warn("AUDIT|action=FAILURE|user={}|method={}|exception={}|timestamp={}",
            maskUserId(user), method, ex.getClass().getSimpleName(), Instant.now());
    }
    
    private String getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? auth.getName() : "ANONYMOUS";
    }
    
    private String getClientIp() {
        var attrs = RequestContextHolder.getRequestAttributes();
        if (attrs instanceof ServletRequestAttributes servletAttrs) {
            var request = servletAttrs.getRequest();
            String xfwd = request.getHeader("X-Forwarded-For");
            if (xfwd != null && !xfwd.isBlank()) {
                return xfwd.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }
        return "unknown";
    }
    
    private String maskUserId(String userId) {
        if (userId == null || userId.length() < 8) return "***";
        return userId.substring(0, 3) + "****" + userId.substring(userId.length() - 2);
    }
}
package com.zynctra.performance.security;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Security Audit Aspect — Logs all security-relevant operations
 * 
 * SECURITY:
 * - Never logs sensitive data (passwords, SSNs, salaries)
 * - Masks user IDs in logs
 * - Structured logging for SIEM ingestion
 * - Tracks performance for anomaly detection
 */
@Aspect
public class AuditAspect {
    
    private static final Logger AUDIT_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Logger PERF_LOG = LoggerFactory.getLogger("PERFORMANCE_METRIC");
    
    @Before("@annotation(com.zynctra.performance.security.Audited) && args(..)")
    public void logBefore(JoinPoint joinPoint) {
        String user = getCurrentUser();
        String method = joinPoint.getSignature().toShortString();
        String tenant = TenantContext.getCurrentTenant();
        
        AUDIT_LOG.info("AUDIT|action=ENTER|user={}|tenant={}|method={}|timestamp={}",
            maskUserId(user), tenant, method, Instant.now());
    }
    
    @AfterReturning("@annotation(com.zynctra.performance.security.Audited)")
    public void logAfterReturning(JoinPoint joinPoint) {
        String user = getCurrentUser();
        String method = joinPoint.getSignature().toShortString();
        
        AUDIT_LOG.info("AUDIT|action=SUCCESS|user={}|method={}|timestamp={}",
            maskUserId(user), method, Instant.now());
    }
    
    @AfterThrowing(pointcut = "@annotation(com.zynctra.performance.security.Audited)", throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Exception ex) {
        String user = getCurrentUser();
        String method = joinPoint.getSignature().toShortString();
        
        // Log exception type but NOT message (may contain sensitive data)
        AUDIT_LOG.warn("AUDIT|action=FAILURE|user={}|method={}|exception={}|timestamp={}",
            maskUserId(user), method, ex.getClass().getSimpleName(), Instant.now());
    }
    
    private String getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? auth.getName() : "ANONYMOUS";
    }
    
    private String maskUserId(String userId) {
        if (userId == null || userId.length() < 8) return "***";
        return userId.substring(0, 3) + "****" + userId.substring(userId.length() - 2);
    }
}
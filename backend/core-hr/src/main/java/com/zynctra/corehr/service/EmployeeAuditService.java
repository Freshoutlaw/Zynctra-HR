package com.zynctra.corehr.service;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.corehr.entity.EmployeeAuditLog;
import com.zynctra.corehr.repository.EmployeeAuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

/**
 * Centralized audit logging for ALL employee operations.
 * 
 * SECURITY INVARIANTS:
 * - NEVER fails the main transaction (REQUIRES_NEW)
 * - NEVER stores raw PII in audit records
 * - ALWAYS captures actor, IP, role, correlation ID
 * - Append-only, immutable
 */
@Service
public class EmployeeAuditService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private final EmployeeAuditLogRepository auditLogRepository;

    public EmployeeAuditService(EmployeeAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String employeeId, EmployeeAuditLog.AuditAction action,
                    String fieldChanged, String oldValue, String newValue,
                    String changeReason, String actor, String actorIp, String actorRole) {
        try {
            String correlationId = UUID.randomUUID().toString();
            String oldHash = hashValue(oldValue);
            String newHash = hashValue(newValue);

            EmployeeAuditLog log = EmployeeAuditLog.create(
                employeeId, action, fieldChanged, oldHash, newHash,
                changeReason, actor, actorIp, actorRole, correlationId
            );

            auditLogRepository.save(log);
            SEC_LOG.info("AUDIT: action={} employee={} actor={} field={}", 
                action, employeeId, actor, fieldChanged);
        } catch (Exception e) {
            // Audit failure must not break business logic, but MUST alert
            SEC_LOG.error("SECURITY_EVENT: audit_log_failure employee={} action={} error={}", 
                employeeId, action, e.getMessage());
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logSensitiveView(String employeeId, String field, String actor, 
                                  String actorIp, String actorRole) {
        log(employeeId, EmployeeAuditLog.AuditAction.VIEWED_SENSITIVE, 
            field, null, null, "Sensitive field accessed", actor, actorIp, actorRole);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logExport(String employeeId, String actor, String actorIp, String actorRole) {
        log(employeeId, EmployeeAuditLog.AuditAction.EXPORTED, 
            null, null, null, "Employee data exported", actor, actorIp, actorRole);
    }

    private String hashValue(String value) {
        if (value == null) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            return "HASH_ERROR";
        }
    }
}
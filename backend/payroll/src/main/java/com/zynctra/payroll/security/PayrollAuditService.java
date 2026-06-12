package com.zynctra.payroll.security;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zynctra.payroll.entity.PayrollAuditLog;
import com.zynctra.payroll.repository.PayrollAuditLogRepository;

@Service
public class PayrollAuditService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private final PayrollAuditLogRepository auditLogRepository;

    private String lastChainHash = null; // In production: store in Redis/DB

    public PayrollAuditService(PayrollAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String payrollRunId, String employeeId, PayrollAuditLog.AuditAction action,
                    String fieldChanged, String oldValue, String newValue,
                    BigDecimal amount, String actor, String actorIp, String actorRole) {
        try {
            String correlationId = UUID.randomUUID().toString();
            String oldHash = hashValue(oldValue);
            String newHash = hashValue(newValue);

            PayrollAuditLog log = PayrollAuditLog.create(
                payrollRunId, employeeId, action, fieldChanged, oldHash, newHash,
                amount, actor, actorIp, actorRole, correlationId, lastChainHash
            );

            auditLogRepository.save(log);
            lastChainHash = log.getIntegrityHash();

            SEC_LOG.info("PAYROLL_AUDIT: action={} run={} actor={} amount={}",
                action, payrollRunId, actor, amount);
        } catch (Exception e) {
            SEC_LOG.error("SECURITY_EVENT: payroll_audit_failure action={}", action, e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAnomaly(PayrollAuditLog.AuditAction action, String actor, String details) {
        log(null, null, action, null, null, details, null, actor, "unknown", "SYSTEM");
    }

    private String hashValue(String value) {
        if (value == null) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Base64.getEncoder().encodeToString(
                digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            return "HASH_ERROR";
        }
    }
}
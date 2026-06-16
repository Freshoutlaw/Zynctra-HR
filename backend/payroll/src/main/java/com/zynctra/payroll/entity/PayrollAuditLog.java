package com.zynctra.payroll.entity;

import jakarta.persistence.*;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Table(name = "payroll_audit_logs", schema = "payroll_schema")
public class PayrollAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    @Column(name = "payroll_run_id", length = 64)
    private String payrollRunId;

    @Column(name = "employee_id", length = 64)
    private String employeeId;

    @Column(name = "action", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Column(name = "field_changed", length = 64)
    private String fieldChanged;

    @Column(name = "old_value_hash", length = 64)
    private String oldValueHash;

    @Column(name = "new_value_hash", length = 64)
    private String newValueHash;

    @Column(name = "amount", precision = 15, scale = 2)
    private java.math.BigDecimal amount;

    @Column(name = "actor", nullable = false, length = 128)
    private String actor;

    @Column(name = "actor_ip", length = 45)
    private String actorIp;

    @Column(name = "actor_role", length = 32)
    private String actorRole;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private Instant timestamp;

    @Column(name = "correlation_id", length = 64)
    private String correlationId;

    @Column(name = "integrity_hash", nullable = false, length = 64)
    private String integrityHash; // Chain of custody

    public enum AuditAction {
        PAYROLL_CREATED, PAYROLL_CALCULATED, PAYROLL_APPROVED, PAYROLL_DISBURSED,
        PAYROLL_CANCELLED, PAYROLL_RECONCILED, PAYROLL_HASH_VERIFIED,
        PAY_RECORD_CREATED, PAY_RECORD_MODIFIED_ATTEMPT, PAY_RECORD_HASH_MISMATCH,
        BANK_ACCOUNT_ADDED, BANK_ACCOUNT_CHANGED, BANK_ACCOUNT_VERIFIED,
        TAX_RECORD_CREATED, TAX_ADJUSTMENT, DEDUCTION_CHANGED,
        AMOUNT_ANOMALY, AFTER_HOURS_ACCESS, BULK_EXPORT
    }

    protected PayrollAuditLog() {}

    public static PayrollAuditLog create(
            String payrollRunId, String employeeId, AuditAction action,
            String fieldChanged, String oldValueHash, String newValueHash,
            java.math.BigDecimal amount, String actor, String actorIp,
            String actorRole, String correlationId, String previousHash) {
        
        PayrollAuditLog log = new PayrollAuditLog();
        log.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        log.payrollRunId = payrollRunId;
        log.employeeId = employeeId;
        log.action = action;
        log.fieldChanged = fieldChanged;
        log.oldValueHash = oldValueHash;
        log.newValueHash = newValueHash;
        log.amount = amount;
        log.actor = actor;
        log.actorIp = actorIp;
        log.actorRole = actorRole;
        log.timestamp = Instant.now();
        log.correlationId = correlationId;
        log.integrityHash = computeChainHash(previousHash, log);
        return log;
    }

    private static String computeChainHash(String previousHash, PayrollAuditLog log) {
        String data = (previousHash != null ? previousHash : "GENESIS") + "|" +
                      log.tenantId + "|" + log.action + "|" + log.timestamp.toString();
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            return java.util.Base64.getEncoder().encodeToString(
                digest.digest(data.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        } catch (Exception e) {
            return "HASH_ERROR";
        }
    }

    // Getters only
    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getPayrollRunId() { return payrollRunId; }
    public String getEmployeeId() { return employeeId; }
    public AuditAction getAction() { return action; }
    public String getFieldChanged() { return fieldChanged; }
    public String getOldValueHash() { return oldValueHash; }
    public String getNewValueHash() { return newValueHash; }
    public java.math.BigDecimal getAmount() { return amount; }
    public String getActor() { return actor; }
    public String getActorIp() { return actorIp; }
    public String getActorRole() { return actorRole; }
    public Instant getTimestamp() { return timestamp; }
    public String getCorrelationId() { return correlationId; }
    public String getIntegrityHash() { return integrityHash; }
}

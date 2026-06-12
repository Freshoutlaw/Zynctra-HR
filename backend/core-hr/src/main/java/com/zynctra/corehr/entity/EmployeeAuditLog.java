package com.zynctra.corehr.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Immutable audit log for ALL employee data changes.
 * Required for SOC2, GDPR, and forensic investigation.
 * 
 * SECURITY INVARIANTS:
 * - Append-only (no updates, no deletes)
 * - Change diffs stored as hashed references (not raw values)
 * - Actor + IP + timestamp for every change
 */
@Entity
@Table(name = "employee_audit_logs", schema = "core_hr_schema")
public class EmployeeAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    @Column(name = "employee_id", nullable = false, length = 64)
    private String employeeId;

    @Column(name = "action", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Column(name = "field_changed", length = 64)
    private String fieldChanged;

    @Column(name = "old_value_hash", length = 64)
    private String oldValueHash; // SHA-256 of old value (never store raw PII in audit)

    @Column(name = "new_value_hash", length = 64)
    private String newValueHash; // SHA-256 of new value

    @Column(name = "change_reason", length = 512)
    private String changeReason; // Required for sensitive changes

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

    public enum AuditAction {
        CREATED, UPDATED, DELETED, VIEWED_SENSITIVE, EXPORTED, TERMINATED, REHIRED
    }

    protected EmployeeAuditLog() {}

    public static EmployeeAuditLog create(
            String employeeId,
            AuditAction action,
            String fieldChanged,
            String oldValueHash,
            String newValueHash,
            String changeReason,
            String actor,
            String actorIp,
            String actorRole,
            String correlationId) {
        
        EmployeeAuditLog log = new EmployeeAuditLog();
        log.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        log.employeeId = employeeId;
        log.action = action;
        log.fieldChanged = fieldChanged;
        log.oldValueHash = oldValueHash;
        log.newValueHash = newValueHash;
        log.changeReason = changeReason;
        log.actor = actor;
        log.actorIp = actorIp;
        log.actorRole = actorRole;
        log.timestamp = Instant.now();
        log.correlationId = correlationId;
        return log;
    }

    // GETTERS ONLY
    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public String getEmployeeId() { return employeeId; }
    public AuditAction getAction() { return action; }
    public String getFieldChanged() { return fieldChanged; }
    public String getOldValueHash() { return oldValueHash; }
    public String getNewValueHash() { return newValueHash; }
    public String getChangeReason() { return changeReason; }
    public String getActor() { return actor; }
    public String getActorIp() { return actorIp; }
    public String getActorRole() { return actorRole; }
    public Instant getTimestamp() { return timestamp; }
    public String getCorrelationId() { return correlationId; }
}
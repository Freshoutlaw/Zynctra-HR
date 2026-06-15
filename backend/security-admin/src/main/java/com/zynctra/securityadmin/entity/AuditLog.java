package com.zynctra.securityadmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Audit Log Entity — IMMUTABLE security audit trail.
 * 
 * CRITICAL SECURITY PROPERTIES:
 * - NO update method (immutable after creation)
 * - NO delete method (permanent retention)
 * - NO soft delete (must survive forever)
 * - Encrypted at rest (configured in application.yml)
 * - Tamper-evident (hash chain could be added)
 */
@Entity
@Table(
    name = "audit_logs",
    schema = "securityadmin_schema",
    indexes = {
        @Index(name = "idx_audit_user", columnList = "user_id, timestamp"),
        @Index(name = "idx_audit_action", columnList = "action_type, timestamp"),
        @Index(name = "idx_audit_tenant", columnList = "tenant_id, timestamp")
    }
)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @NotBlank
    @Size(max = 64)
    @Column(name = "action_type", nullable = false, length = 64)
    private String actionType;

    @NotBlank
    @Size(max = 128)
    @Column(name = "resource_type", nullable = false, length = 128)
    private String resourceType;

    @Size(max = 36)
    @Column(name = "resource_id", length = 36)
    private String resourceId;

    @Size(max = 1000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "details", length = 1000)
    private String details;

    @NotBlank
    @Pattern(regexp = "^(\\d{1,3}\\.){3}\\d{1,3}$|^[0-9a-fA-F:]+$")
    @Column(name = "client_ip", nullable = false, length = 45)
    private String clientIp;

    @Size(max = 64)
    @Column(name = "session_id", length = 64)
    private String sessionId;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private java.time.Instant timestamp;

    @Column(name = "success", nullable = false)
    private Boolean success = true;

    @Size(max = 500)
    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId;

    // NO @PreUpdate — this entity is IMMUTABLE
    // NO setters for critical fields after creation
    // NO delete operation

    public static AuditLog create(String userId, String actionType, String resourceType,
                                   String resourceId, String details, String clientIp,
                                   String sessionId, boolean success, String tenantId) {
        AuditLog log = new AuditLog();
        log.userId = userId;
        log.actionType = actionType;
        log.resourceType = resourceType;
        log.resourceId = resourceId;
        log.details = details;
        log.clientIp = clientIp;
        log.sessionId = sessionId;
        log.timestamp = java.time.Instant.now();
        log.success = success;
        log.tenantId = tenantId;
        return log;
    }

    public static AuditLog createFailure(String userId, String actionType, String resourceType,
                                          String resourceId, String failureReason, 
                                          String clientIp, String tenantId) {
        AuditLog log = create(userId, actionType, resourceType, resourceId, 
            null, clientIp, null, false, tenantId);
        log.failureReason = failureReason;
        return log;
    }

    // Getters ONLY — no setters for immutable fields
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getActionType() { return actionType; }
    public String getResourceType() { return resourceType; }
    public String getResourceId() { return resourceId; }
    public String getDetails() { return details; }
    public String getClientIp() { return clientIp; }
    public String getSessionId() { return sessionId; }
    public java.time.Instant getTimestamp() { return timestamp; }
    public Boolean getSuccess() { return success; }
    public String getFailureReason() { return failureReason; }
    public String getTenantId() { return tenantId; }
}
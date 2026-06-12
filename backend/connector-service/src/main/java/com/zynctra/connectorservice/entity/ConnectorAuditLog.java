package com.zynctra.connector.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.Instant;

/**
 * Security-focused audit log for connector operations.
 * 
 * SECURITY INVARIANTS:
 * - Append-only, never updated
 * - All security events logged (auth failures, config changes, anomalies)
 * - No sensitive data in log entries (hashed/omitted)
 */
@Entity
@Table(name = "connector_audit_logs", schema = "connector_schema")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class ConnectorAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    @Column(name = "event_type", nullable = false, length = 64)
    @Enumerated(EnumType.STRING)
    private AuditEventType eventType;

    @Column(name = "connector_type", length = 32)
    @Enumerated(EnumType.STRING)
    private ConnectorType connectorType;

    @Column(name = "actor", nullable = false, length = 128)
    private String actor;

    @Column(name = "actor_ip", length = 45)
    private String actorIp;

    @Column(name = "action_description", nullable = false, length = 512)
    private String actionDescription;

    /**
     * SHA-256 hash of any sensitive identifiers in the event.
     * Never store raw IDs, emails, or names.
     */
    @Column(name = "resource_hash", length = 64)
    private String resourceHash;

    @Column(name = "success", nullable = false)
    private Boolean success;

    @Column(name = "failure_reason", length = 512)
    private String failureReason;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private Instant timestamp;

    @Column(name = "correlation_id", length = 64)
    private String correlationId;

    public enum AuditEventType {
        CONNECTOR_CREATED,
        CONNECTOR_UPDATED,
        CONNECTOR_DELETED,
        CONNECTOR_ACTIVATED,
        CONNECTOR_DEACTIVATED,
        WEBHOOK_RECEIVED,
        WEBHOOK_VALIDATION_FAILED,
        WEBHOOK_SIGNATURE_INVALID,
        WEBHOOK_RATE_LIMITED,
        OAUTH_AUTHORIZATION_STARTED,
        OAUTH_AUTHORIZATION_COMPLETED,
        OAUTH_AUTHORIZATION_FAILED,
        OAUTH_STATE_REUSED,
        OUTBOUND_API_CALLED,
        OUTBOUND_API_FAILED,
        OUTBOUND_API_TIMEOUT,
        CONFIGURATION_CHANGED,
        SECRET_ROTATED,
        ANOMALY_DETECTED
    }

    protected ConnectorAuditLog() {}

    public static ConnectorAuditLog create(
            AuditEventType eventType,
            ConnectorType connectorType,
            String actor,
            String actorIp,
            String actionDescription,
            String resourceHash,
            Boolean success,
            String correlationId) {
        
        ConnectorAuditLog log = new ConnectorAuditLog();
        log.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        log.eventType = eventType;
        log.connectorType = connectorType;
        log.actor = actor;
        log.actorIp = actorIp;
        log.actionDescription = actionDescription;
        log.resourceHash = resourceHash;
        log.success = success;
        log.timestamp = Instant.now();
        log.correlationId = correlationId;
        return log;
    }

    @PrePersist
    private void onCreate() {
        if (this.timestamp == null) this.timestamp = Instant.now();
        if (this.tenantId == null) {
            this.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        }
    }

    // GETTERS ONLY — Immutable
    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public AuditEventType getEventType() { return eventType; }
    public ConnectorType getConnectorType() { return connectorType; }
    public String getActor() { return actor; }
    public String getActorIp() { return actorIp; }
    public String getActionDescription() { return actionDescription; }
    public String getResourceHash() { return resourceHash; }
    public Boolean getSuccess() { return success; }
    public String getFailureReason() { return failureReason; }
    public Instant getTimestamp() { return timestamp; }
    public String getCorrelationId() { return correlationId; }

    // NO setters — append-only audit log
}
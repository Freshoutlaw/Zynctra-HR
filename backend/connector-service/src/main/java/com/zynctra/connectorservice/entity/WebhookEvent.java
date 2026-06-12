package com.zynctra.connector.entity;

import java.time.Instant;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * Immutable audit log of all webhook events received.
 * 
 * SECURITY INVARIANTS:
 * - NEVER updated after creation (append-only audit log)
 * - tenantId scoped for cross-tenant isolation
 * - Signature and hash stored for tamper evidence
 * - Raw payload truncated to prevent storage exhaustion
 */
@Entity
@Table(name = "webhook_events", schema = "connector_schema")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class WebhookEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    @Column(name = "connector_type", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private ConnectorType connectorType;

    @Column(name = "event_id", nullable = false, length = 128)
    private String eventId;

    @Column(name = "event_type", nullable = false, length = 128)
    private String eventType;

    /**
     * SHA-256 hash of the raw payload.
     * Used for tamper detection and deduplication.
     */
    @Column(name = "payload_hash", nullable = false, length = 64)
    private String payloadHash;

    /**
     * Truncated raw payload for forensic analysis.
     * MAX 10KB to prevent storage exhaustion.
     */
    @Column(name = "payload_preview", columnDefinition = "TEXT")
    private String payloadPreview;

    @Column(name = "signature_valid", nullable = false)
    private Boolean signatureValid;

    @Column(name = "processing_status", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private ProcessingStatus processingStatus;

    @Column(name = "processing_result", length = 512)
    private String processingResult;

    @Column(name = "source_ip", nullable = false, length = 45)
    private String sourceIp;

    @Column(name = "received_at", nullable = false, updatable = false)
    private Instant receivedAt;

    @Column(name = "processed_at")
    private Instant processedAt;

    // NO updatedAt — this is append-only

    @Column(name = "created_by", nullable = false, updatable = false, length = 128)
    private String createdBy; // System user for automated events

    // Enum for processing status
    public enum ProcessingStatus {
        RECEIVED,
        VALIDATED,
        PROCESSING,
        COMPLETED,
        FAILED,
        QUARANTINED
    }

    protected WebhookEvent() {}

    public static WebhookEvent create(
            ConnectorType connectorType,
            String eventId,
            String eventType,
            String payloadHash,
            String payloadPreview,
            Boolean signatureValid,
            String sourceIp) {
        
        WebhookEvent event = new WebhookEvent();
        event.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        event.connectorType = connectorType;
        event.eventId = eventId;
        event.eventType = eventType;
        event.payloadHash = payloadHash;
        event.payloadPreview = truncatePayload(payloadPreview);
        event.signatureValid = signatureValid;
        event.processingStatus = ProcessingStatus.RECEIVED;
        event.sourceIp = sourceIp;
        event.receivedAt = Instant.now();
        event.createdBy = "SYSTEM_WEBHOOK";
        return event;
    }

    @PrePersist
    private void onCreate() {
        if (this.receivedAt == null) this.receivedAt = Instant.now();
        if (this.tenantId == null) {
            this.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        }
    }

    private static String truncatePayload(String payload) {
        if (payload == null) return null;
        int maxLength = 10240; // 10KB max
        return payload.length() > maxLength 
            ? payload.substring(0, maxLength) + "...[truncated]" 
            : payload;
    }

    // GETTERS ONLY — Immutable after creation
    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public ConnectorType getConnectorType() { return connectorType; }
    public String getEventId() { return eventId; }
    public String getEventType() { return eventType; }
    public String getPayloadHash() { return payloadHash; }
    public String getPayloadPreview() { return payloadPreview; }
    public Boolean getSignatureValid() { return signatureValid; }
    public ProcessingStatus getProcessingStatus() { return processingStatus; }
    public String getProcessingResult() { return processingResult; }
    public String getSourceIp() { return sourceIp; }
    public Instant getReceivedAt() { return receivedAt; }
    public Instant getProcessedAt() { return processedAt; }
    public String getCreatedBy() { return createdBy; }

    // LIMITED SETTERS — Only status transitions allowed
    public void setProcessingStatus(ProcessingStatus status) { 
        this.processingStatus = status; 
    }
    public void setProcessingResult(String result) { 
        this.processingResult = result; 
    }
    public void setProcessedAt(Instant processedAt) { 
        this.processedAt = processedAt; 
    }

    // NO setters for: id, tenantId, eventId, payloadHash, receivedAt, createdBy
}
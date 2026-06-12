package com.zynctra.connector.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.Instant;

/**
 * Immutable audit log of all outbound API calls.
 * 
 * SECURITY INVARIANTS:
 * - Append-only (never updated after creation)
 * - Request/response hashes for integrity verification
 * - No raw secrets or tokens stored
 * - Tenant-scoped for isolation
 */
@Entity
@Table(name = "outbound_api_calls", schema = "connector_schema")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class OutboundApiCall {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    @Column(name = "connector_type", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private ConnectorType connectorType;

    @Column(name = "request_url", nullable = false, length = 2048)
    private String requestUrl;

    @Column(name = "request_method", nullable = false, length = 10)
    private String requestMethod;

    /**
     * SHA-256 hash of request body.
     * Never stores raw request body (may contain tokens).
     */
    @Column(name = "request_body_hash", length = 64)
    private String requestBodyHash;

    @Column(name = "response_status_code")
    private Integer responseStatusCode;

    /**
     * SHA-256 hash of response body.
     */
    @Column(name = "response_body_hash", length = 64)
    private String responseBodyHash;

    @Column(name = "response_error_message", length = 512)
    private String responseErrorMessage;

    @Column(name = "request_signature", length = 256)
    private String requestSignature;

    @Column(name = "call_status", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private CallStatus callStatus;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "called_at", nullable = false, updatable = false)
    private Instant calledAt;

    @Column(name = "created_by", nullable = false, updatable = false, length = 128)
    private String createdBy;

    public enum CallStatus {
        PENDING,
        SUCCESS,
        FAILED,
        TIMEOUT,
        CIRCUIT_OPEN,
        RATE_LIMITED
    }

    protected OutboundApiCall() {}

    public static OutboundApiCall create(
            ConnectorType connectorType,
            String requestUrl,
            String requestMethod,
            String requestBodyHash,
            String requestSignature) {
        
        OutboundApiCall call = new OutboundApiCall();
        call.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        call.connectorType = connectorType;
        call.requestUrl = requestUrl;
        call.requestMethod = requestMethod;
        call.requestBodyHash = requestBodyHash;
        call.requestSignature = requestSignature;
        call.callStatus = CallStatus.PENDING;
        call.calledAt = Instant.now();
        call.createdBy = "SYSTEM_CONNECTOR";
        return call;
    }

    @PrePersist
    private void onCreate() {
        if (this.calledAt == null) this.calledAt = Instant.now();
        if (this.tenantId == null) {
            this.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        }
    }

    // GETTERS
    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public ConnectorType getConnectorType() { return connectorType; }
    public String getRequestUrl() { return requestUrl; }
    public String getRequestMethod() { return requestMethod; }
    public String getRequestBodyHash() { return requestBodyHash; }
    public Integer getResponseStatusCode() { return responseStatusCode; }
    public String getResponseBodyHash() { return responseBodyHash; }
    public String getResponseErrorMessage() { return responseErrorMessage; }
    public String getRequestSignature() { return requestSignature; }
    public CallStatus getCallStatus() { return callStatus; }
    public Long getDurationMs() { return durationMs; }
    public Instant getCalledAt() { return calledAt; }
    public String getCreatedBy() { return createdBy; }

    // SETTERS — Only for completion fields
    public void setResponseStatusCode(Integer code) { this.responseStatusCode = code; }
    public void setResponseBodyHash(String hash) { this.responseBodyHash = hash; }
    public void setResponseErrorMessage(String msg) { this.responseErrorMessage = msg; }
    public void setCallStatus(CallStatus status) { this.callStatus = status; }
    public void setDurationMs(Long ms) { this.durationMs = ms; }

    // NO setters for: id, tenantId, requestUrl, requestMethod, requestBodyHash, calledAt, createdBy
}
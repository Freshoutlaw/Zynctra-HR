package com.zynctra.connector.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.Instant;

/**
 * Secure OAuth state token storage.
 * 
 * SECURITY INVARIANTS:
 * - State tokens are cryptographically random (256-bit)
 * - Single-use only (deleted after validation)
 * - Time-bound expiration (10 minutes default)
 * - Tenant-scoped to prevent cross-tenant CSRF
 */
@Entity
@Table(name = "oauth_state_tokens", schema = "connector_schema")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class OAuthStateToken {

    @Id
    @Column(name = "state_token", nullable = false, length = 64)
    private String stateToken;

    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    @Column(name = "connector_type", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private ConnectorType connectorType;

    @Column(name = "redirect_uri", nullable = false, length = 2048)
    private String redirectUri;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false, updatable = false)
    private Instant expiresAt;

    @Column(name = "used", nullable = false)
    private Boolean used = false;

    @Column(name = "used_at")
    private Instant usedAt;

    @Column(name = "created_by", nullable = false, updatable = false, length = 128)
    private String createdBy;

    protected OAuthStateToken() {}

    public static OAuthStateToken create(
            ConnectorType connectorType,
            String redirectUri,
            long expiryMinutes,
            String createdBy) {
        
        OAuthStateToken token = new OAuthStateToken();
        // Cryptographically secure random token
        token.stateToken = generateSecureToken();
        token.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        token.connectorType = connectorType;
        token.redirectUri = redirectUri;
        token.createdAt = Instant.now();
        token.expiresAt = Instant.now().plusSeconds(expiryMinutes * 60);
        token.createdBy = createdBy;
        return token;
    }

    @PrePersist
    private void onCreate() {
        if (this.createdAt == null) this.createdAt = Instant.now();
        if (this.tenantId == null) {
            this.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        }
    }

    private static String generateSecureToken() {
        byte[] bytes = new byte[32]; // 256 bits
        new java.security.SecureRandom().nextBytes(bytes);
        return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public boolean isValid() {
        return !used && Instant.now().isBefore(expiresAt);
    }

    public void markUsed() {
        this.used = true;
        this.usedAt = Instant.now();
    }

    // GETTERS
    public String getStateToken() { return stateToken; }
    public String getTenantId() { return tenantId; }
    public ConnectorType getConnectorType() { return connectorType; }
    public String getRedirectUri() { return redirectUri; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public Boolean getUsed() { return used; }
    public Instant getUsedAt() { return usedAt; }
    public String getCreatedBy() { return createdBy; }

    // NO setters — immutable after creation except markUsed()
}
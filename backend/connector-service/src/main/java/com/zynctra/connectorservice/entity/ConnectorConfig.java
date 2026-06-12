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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

/**
 * Secure connector configuration entity.
 * 
 * SECURITY INVARIANTS:
 * - tenantId is IMMUTABLE after creation (prevents tenant migration attacks)
 * - secrets are NEVER stored in plaintext (encrypted at application layer)
 * - Only SELECT/INSERT/UPDATE allowed at DB level (no DROP/TRUNCATE)
 * - All queries are tenant-scoped via Hibernate Filter
 */
@Entity
@Table(name = "connector_configs", schema = "connector_schema")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class ConnectorConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    /**
     * IMMUTABLE tenant identifier.
     * Set once at creation, never updated.
     * Enforced by: no setter, @PrePersist only, DB column NOT NULL
     */
    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;

    @Column(name = "connector_type", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private ConnectorType connectorType;

    @Column(name = "display_name", nullable = false, length = 128)
    private String displayName;

    /**
     * Encrypted configuration payload.
     * Stored as AES-256-GCM ciphertext (Base64 encoded).
     * Encryption key derived from tenant-specific master key.
     */
    @Column(name = "encrypted_config", nullable = false, columnDefinition = "TEXT")
    private String encryptedConfig;

    /**
     * Whether this connector is active.
     * Disabled connectors cannot process webhooks or make outbound calls.
     */
    @Column(name = "active", nullable = false)
    private Boolean active = false;

    /**
     * Allowed outbound domains for this connector.
     * JSON array stored as text, validated at application layer.
     */
    @Column(name = "allowed_domains", nullable = false, columnDefinition = "TEXT")
    private String allowedDomains;

    /**
     * Webhook secret reference (NOT the actual secret).
     * Points to environment variable or Vault path.
     * Actual secret NEVER stored in database.
     */
    @Column(name = "webhook_secret_ref", length = 256)
    private String webhookSecretRef;

    /**
     * OAuth credentials reference (NOT the actual tokens).
     * Encrypted refresh token stored separately in secure token vault.
     */
    @Column(name = "oauth_token_ref", length = 256)
    private String oauthTokenRef;

    // AUDIT FIELDS — Immutable after creation
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "created_by", nullable = false, updatable = false, length = 128)
    private String createdBy;

    @Column(name = "updated_by", nullable = false, length = 128)
    private String updatedBy;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    // CONSTRUCTOR — Package-private to force factory usage
    protected ConnectorConfig() {}

    /**
     * Factory method for secure creation.
     * Ensures tenant context is set and audit fields populated.
     */
    public static ConnectorConfig create(
            ConnectorType type,
            String displayName,
            String encryptedConfig,
            String allowedDomains,
            String createdBy) {
        
        ConnectorConfig config = new ConnectorConfig();
        config.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        config.connectorType = type;
        config.displayName = displayName;
        config.encryptedConfig = encryptedConfig;
        config.allowedDomains = allowedDomains;
        config.createdBy = createdBy;
        config.updatedBy = createdBy;
        config.createdAt = Instant.now();
        config.updatedAt = Instant.now();
        return config;
    }

    // PRE-PERSIST / PRE-UPDATE
    @PrePersist
    private void onCreate() {
        if (this.createdAt == null) this.createdAt = Instant.now();
        if (this.updatedAt == null) this.updatedAt = Instant.now();
        if (this.version == null) this.version = 0L;
        if (this.deleted == null) this.deleted = false;
        if (this.active == null) this.active = false;
        
        // CRITICAL: Ensure tenant is set from context if not already
        if (this.tenantId == null) {
            this.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        }
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = Instant.now();
        // tenantId CANNOT change — enforced by no setter and updatable=false
    }

    // GETTERS — All fields readable
    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public ConnectorType getConnectorType() { return connectorType; }
    public String getDisplayName() { return displayName; }
    public String getEncryptedConfig() { return encryptedConfig; }
    public Boolean getActive() { return active; }
    public String getAllowedDomains() { return allowedDomains; }
    public String getWebhookSecretRef() { return webhookSecretRef; }
    public String getOauthTokenRef() { return oauthTokenRef; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getCreatedBy() { return createdBy; }
    public String getUpdatedBy() { return updatedBy; }
    public Long getVersion() { return version; }
    public Boolean getDeleted() { return deleted; }

    // SETTERS — Only mutable fields
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public void setEncryptedConfig(String encryptedConfig) { this.encryptedConfig = encryptedConfig; }
    public void setActive(Boolean active) { this.active = active; }
    public void setAllowedDomains(String allowedDomains) { this.allowedDomains = allowedDomains; }
    public void setWebhookSecretRef(String webhookSecretRef) { this.webhookSecretRef = webhookSecretRef; }
    public void setOauthTokenRef(String oauthTokenRef) { this.oauthTokenRef = oauthTokenRef; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    // NO setter for: id, tenantId, createdAt, createdBy, version
    // These are immutable after creation
}
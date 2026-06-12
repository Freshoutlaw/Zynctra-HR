package com.zynctra.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.Instant;

@MappedSuperclass
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public abstract class SecureBaseEntity {
    
    @Column(name = "tenant_id", nullable = false, updatable = false, length = 64)
    private String tenantId;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @Column(name = "created_by", nullable = false, updatable = false, length = 128)
    private String createdBy;
    
    @Column(name = "updated_by", nullable = false, length = 128)
    private String updatedBy;
    
    @Column(name = "version", nullable = false)
    private Long version = 0L;
    
    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        // createdBy set by service layer from SecurityContext
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
        // tenantId is IMMUTABLE - prevents tenant migration attacks
    }

    // Getters only for immutable fields to prevent tampering
    public String getTenantId() { return tenantId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getCreatedBy() { return createdBy; }
    public String getUpdatedBy() { return updatedBy; }
    public Long getVersion() { return version; }
    public Boolean getDeleted() { return deleted; }
    
    // Setters only for mutable fields
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
    
    // NO setter for tenantId - immutable after creation
}
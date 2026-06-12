package com.zynctra.payroll.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.Instant;
import java.time.LocalDate;

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

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @Column(name = "data_retention_until")
    private LocalDate dataRetentionUntil;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.version == null) this.version = 0L;
        if (this.deleted == null) this.deleted = false;
        if (this.tenantId == null) {
            this.tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters
    public String getTenantId() { return tenantId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getCreatedBy() { return createdBy; }
    public String getUpdatedBy() { return updatedBy; }
    public Long getVersion() { return version; }
    public Boolean getDeleted() { return deleted; }
    public LocalDate getDataRetentionUntil() { return dataRetentionUntil; }

    // Setters (mutable only)
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
    public void setDataRetentionUntil(LocalDate date) { this.dataRetentionUntil = date; }
}
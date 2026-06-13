package com.zynctra.performance.entity;

import com.zynctra.performance.security.TenantContext;
import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.Instant;

/**
 * Secure Base Entity — Multi-tenant foundation with audit and soft-delete
 * 
 * SECURITY:
 * - Tenant ID auto-populated from authenticated context (NOT user input)
 * - Optimistic locking prevents concurrent modification attacks
 * - Soft delete preserves audit trail
 * - Hibernate filter enforces tenant isolation at query level
 */
@MappedSuperclass
@FilterDef(
    name = "tenantFilter", 
    parameters = @ParamDef(name = "tenantId", type = String.class)
)
@Filter(
    name = "tenantFilter", 
    condition = "tenant_id = :tenantId"
)
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

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        
        if (this.version == null) this.version = 0L;
        if (this.deleted == null) this.deleted = false;
        
        // CRITICAL: Extract tenant from security context, validate format
        String currentTenant = TenantContext.getCurrentTenant();
        if (currentTenant == null || currentTenant.isBlank()) {
            throw new SecurityException("Tenant context missing — possible authentication bypass");
        }
        // Validate tenant ID format (alphanumeric, hyphens, underscores only)
        if (!currentTenant.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            throw new SecurityException("Invalid tenant ID format detected: " + currentTenant.substring(0, Math.min(10, currentTenant.length())));
        }
        this.tenantId = currentTenant;
        
        // Set createdBy from authenticated principal
        String principal = getCurrentPrincipal();
        if (principal != null && !principal.isBlank()) {
            this.createdBy = principal;
            this.updatedBy = principal;
        } else {
            throw new SecurityException("Cannot create entity without authenticated principal");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
        String principal = getCurrentPrincipal();
        if (principal != null) {
            this.updatedBy = principal;
        }
    }

    private String getCurrentPrincipal() {
        var auth = org.springframework.security.core.context.SecurityContextHolder
            .getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated()) ? auth.getName() : null;
    }

    // Getters only for audit fields — no setters to prevent tampering
    public String getTenantId() { return tenantId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getCreatedBy() { return createdBy; }
    public String getUpdatedBy() { return updatedBy; }
    public Long getVersion() { return version; }
    public Boolean getDeleted() { return deleted; }
    
    // Controlled setters
    public void setUpdatedBy(String updatedBy) { 
        if (updatedBy != null && !updatedBy.isBlank()) {
            this.updatedBy = updatedBy; 
        }
    }
    public void setDeleted(Boolean deleted) { 
        this.deleted = deleted != null ? deleted : false; 
    }
}
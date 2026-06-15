package com.zynctra.securityadmin.audit;

import java.time.Instant;

public final class AuditLogEntry {
    private final AuditAction action;
    private final String resourceType;
    private final String resourceId;
    private final String tenantId;
    private final String performedBy;
    private final String details;
    private final Instant timestamp;

    private AuditLogEntry(Builder builder) {
        this.action = builder.action; this.resourceType = builder.resourceType;
        this.resourceId = builder.resourceId; this.tenantId = builder.tenantId;
        this.performedBy = builder.performedBy; this.details = builder.details;
        this.timestamp = builder.timestamp != null ? builder.timestamp : Instant.now();
    }
    public AuditAction getAction() { return action; }
    public String getResourceType() { return resourceType; }
    public String getResourceId() { return resourceId; }
    public String getTenantId() { return tenantId; }
    public String getPerformedBy() { return performedBy; }
    public String getDetails() { return details; }
    public Instant getTimestamp() { return timestamp; }
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private AuditAction action; private String resourceType; private String resourceId;
        private String tenantId; private String performedBy; private String details; private Instant timestamp;
        public Builder action(AuditAction action) { this.action = action; return this; }
        public Builder resourceType(String resourceType) { this.resourceType = resourceType; return this; }
        public Builder resourceId(String resourceId) { this.resourceId = resourceId; return this; }
        public Builder tenantId(String tenantId) { this.tenantId = tenantId; return this; }
        public Builder performedBy(String performedBy) { this.performedBy = performedBy; return this; }
        public Builder details(String details) { this.details = details; return this; }
        public Builder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }
        public AuditLogEntry build() {
            if (action == null || resourceType == null || performedBy == null) throw new IllegalStateException("Action, resourceType, and performedBy are required");
            return new AuditLogEntry(this);
        }
    }
}
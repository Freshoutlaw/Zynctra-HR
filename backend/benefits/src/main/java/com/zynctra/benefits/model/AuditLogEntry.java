package com.zynctra.benefits.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Immutable audit log entry recording a domain action with contextual metadata.
 * Provides a JSON-formatted structured log output via {@link #toStructuredLog()}.
 */
public class AuditLogEntry {

    public enum ActionOutcome {
        SUCCESS,
        FAILURE,
        DENIED,
        ERROR
    }

    private final UUID entryId;
    private final Instant timestamp;
    private final AuditAction action;
    private final UUID tenantId;
    private final UUID actorUserId;
    private final String actorRole;
    private final String actorIpAddress;
    private final UUID targetResourceId;
    private final String targetResourceType;
    private final ActionOutcome outcome;
    private final String details;
    private final UUID correlationId;

    private AuditLogEntry(Builder builder) {
        this.entryId = builder.entryId;
        this.timestamp = builder.timestamp;
        this.action = builder.action;
        this.tenantId = builder.tenantId;
        this.actorUserId = builder.actorUserId;
        this.actorRole = builder.actorRole;
        this.actorIpAddress = builder.actorIpAddress;
        this.targetResourceId = builder.targetResourceId;
        this.targetResourceType = builder.targetResourceType;
        this.outcome = builder.outcome;
        this.details = builder.details;
        this.correlationId = builder.correlationId;
    }

    public static Builder builder() {
        return new Builder();
    }

    // --- Getters ---

    public UUID getEntryId() {
        return entryId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public AuditAction getAction() {
        return action;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public UUID getActorUserId() {
        return actorUserId;
    }

    public String getActorRole() {
        return actorRole;
    }

    public String getActorIpAddress() {
        return actorIpAddress;
    }

    public UUID getTargetResourceId() {
        return targetResourceId;
    }

    public String getTargetResourceType() {
        return targetResourceType;
    }

    public ActionOutcome getOutcome() {
        return outcome;
    }

    public String getDetails() {
        return details;
    }

    public UUID getCorrelationId() {
        return correlationId;
    }

    /**
     * Returns a JSON-formatted string representation of this audit log entry.
     * All string values are properly escaped for JSON.
     */
    public String toStructuredLog() {
        StringBuilder sb = new StringBuilder();
        sb.append('{');
        appendJsonField(sb, "entryId", entryId != null ? entryId.toString() : null);
        sb.append(',');
        appendJsonField(sb, "timestamp", timestamp != null ? timestamp.toString() : null);
        sb.append(',');
        appendJsonField(sb, "action", action != null ? action.name() : null);
        sb.append(',');
        appendJsonField(sb, "tenantId", tenantId != null ? tenantId.toString() : null);
        sb.append(',');
        appendJsonField(sb, "actorUserId", actorUserId != null ? actorUserId.toString() : null);
        sb.append(',');
        appendJsonField(sb, "actorRole", actorRole);
        sb.append(',');
        appendJsonField(sb, "actorIpAddress", actorIpAddress);
        sb.append(',');
        appendJsonField(sb, "targetResourceId", targetResourceId != null ? targetResourceId.toString() : null);
        sb.append(',');
        appendJsonField(sb, "targetResourceType", targetResourceType);
        sb.append(',');
        appendJsonField(sb, "outcome", outcome != null ? outcome.name() : null);
        sb.append(',');
        appendJsonField(sb, "details", details);
        sb.append(',');
        appendJsonField(sb, "correlationId", correlationId != null ? correlationId.toString() : null);
        sb.append('}');
        return sb.toString();
    }

    private static void appendJsonField(StringBuilder sb, String name, String value) {
        sb.append('"');
        escapeJson(sb, name);
        sb.append("":");
        if (value == null) {
            sb.append("null");
        } else {
            sb.append('"');
            escapeJson(sb, value);
            sb.append('"');
        }
    }

    private static void escapeJson(StringBuilder sb, String s) {
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"':
                    sb.append("\\"");
                    break;
                case '\\':
                    sb.append("\\\");
                    break;
                case '\b':
                    sb.append("\\b");
                    break;
                case '\f':
                    sb.append("\\f");
                    break;
                case '\n':
                    sb.append("\\n");
                    break;
                case '\r':
                    sb.append("\\r");
                    break;
                case '\t':
                    sb.append("\\t");
                    break;
                default:
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                    break;
            }
        }
    }

    // --- Builder ---

    public static final class Builder {
        private UUID entryId;
        private Instant timestamp;
        private AuditAction action;
        private UUID tenantId;
        private UUID actorUserId;
        private String actorRole;
        private String actorIpAddress;
        private UUID targetResourceId;
        private String targetResourceType;
        private ActionOutcome outcome;
        private String details;
        private UUID correlationId;

        private Builder() {
        }

        public Builder entryId(UUID entryId) {
            this.entryId = entryId;
            return this;
        }

        public Builder timestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder action(AuditAction action) {
            this.action = action;
            return this;
        }

        public Builder tenantId(UUID tenantId) {
            this.tenantId = tenantId;
            return this;
        }

        public Builder actorUserId(UUID actorUserId) {
            this.actorUserId = actorUserId;
            return this;
        }

        public Builder actorRole(String actorRole) {
            this.actorRole = actorRole;
            return this;
        }

        public Builder actorIpAddress(String actorIpAddress) {
            this.actorIpAddress = actorIpAddress;
            return this;
        }

        public Builder targetResourceId(UUID targetResourceId) {
            this.targetResourceId = targetResourceId;
            return this;
        }

        public Builder targetResourceType(String targetResourceType) {
            this.targetResourceType = targetResourceType;
            return this;
        }

        public Builder outcome(ActionOutcome outcome) {
            this.outcome = outcome;
            return this;
        }

        public Builder details(String details) {
            this.details = details;
            return this;
        }

        public Builder correlationId(UUID correlationId) {
            this.correlationId = correlationId;
            return this;
        }

        public AuditLogEntry build() {
            return new AuditLogEntry(this);
        }
    }
}
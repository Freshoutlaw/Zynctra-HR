package com.zynctra.ats.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * Immutable record of an auditable action in the ATS module.
 *
 * <p>Written to a tamper-resistant audit store (separate from application logs).
 * Each entry captures: who, what, when, on which tenant, and the outcome.</p>
 *
 * <p><strong>Privacy:</strong> The {@code details} field must never contain
 * PII, passwords, tokens, or raw request bodies. Store only UUID references
 * and action summaries.</p>
 */
@Getter 
@Builder(toBuilder = true)
public final class AuditLogEntry {

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
    private final Long executionTimeMs;

    public enum ActionOutcome {
        SUCCESS,
        FAILURE,
        DENIED,
        ERROR
    }

    public String toStructuredLog() {
        return String.format(
            "AUDIT | ts=%s | action=%s | tenant=%s | actor=%s | target=%s:%s | outcome=%s | details=%s",
            timestamp,
            action,
            tenantId,
            actorUserId,
            targetResourceType,
            targetResourceId,
            outcome,
            details != null ? details.substring(0, Math.min(details.length(), 100)) : ""
        );
    }
}

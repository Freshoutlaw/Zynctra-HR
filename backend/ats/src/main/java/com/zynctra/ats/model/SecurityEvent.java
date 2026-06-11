package com.zynctra.ats.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * Immutable model representing a security-relevant event in the ATS module.
 *
 * <p>Instances of this class are written to the security audit log
 * (separate from application logs) and are designed for SIEM ingestion.</p>
 *
 * <p><strong>Privacy:</strong> Never store raw PII, passwords, tokens, or
 * query parameters in the {@code details} field.</p>
 */
@Getter
@Builder(toBuilder = true) 
public final class SecurityEvent {

    private final UUID eventId;
    private final Instant timestamp;
    private final EventType eventType;
    private final Severity severity;
    private final String tenantId;
    private final String userId;
    private final String sessionId;
    private final String ipAddress;
    private final String userAgentHash;
    private final String endpoint;
    private final String httpMethod;
    private final String resourceType;
    private final String resourceId;
    private final String action;
    private final Outcome outcome;
    private final String details;
    private final String correlationId;

    public enum EventType {
        AUTHENTICATION_SUCCESS,
        AUTHENTICATION_FAILURE,
        AUTHORIZATION_DENIED,
        TENANT_ISOLATION_BREACH,
        INPUT_VALIDATION_FAILURE,
        RATE_LIMIT_EXCEEDED,
        SUSPICIOUS_ACTIVITY_DETECTED,
        SECRET_LEAKAGE_ATTEMPT,
        DATA_EXPORT,
        PRIVILEGE_ESCALATION_ATTEMPT,
        SESSION_INVALIDATED,
        ACCOUNT_LOCKED
    }

    public enum Severity {
        INFO,
        WARNING,
        HIGH,
        CRITICAL
    }

    public enum Outcome {
        SUCCESS,
        FAILURE,
        BLOCKED,
        QUARANTINED
    }

    @Override
    public String toString() {
        return String.format(
            "SecurityEvent{eventId=%s, type=%s, severity=%s, tenant=%s, outcome=%s, endpoint=%s, action=%s}",
            eventId, eventType, severity, tenantId, outcome, endpoint, action
        );
    }
}

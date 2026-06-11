package com.zynctra.ats.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when the security middleware detects suspicious input patterns
 * such as prompt injection attempts, command injection strings, or
 * obfuscation patterns.
 *
 * <p>Maps to HTTP 400 Bad Request. This exception triggers an immediate
 * security event log and may result in IP/temporary account quarantine.</p>
 */
public class SuspiciousActivityException extends SecurityException {

    private static final HttpStatus STATUS = HttpStatus.BAD_REQUEST;
    private static final String CODE = "ATS-THREAT-001";
    private static final String PUBLIC_MSG = "Request could not be processed.";

    private final ThreatSeverity severity;
    private final String detectionRule;

    public enum ThreatSeverity {
        LOW,      // Logged, request rejected
        MEDIUM,   // Logged, request rejected, user flagged
        HIGH,     // Logged, request rejected, user session invalidated
        CRITICAL  // Logged, request rejected, account locked, admin alert
    }

    public SuspiciousActivityException(String internalDetail,
                                        String tenantId,
                                        String userId,
                                        ThreatSeverity severity,
                                        String detectionRule) {
        super(STATUS, CODE, PUBLIC_MSG, internalDetail, tenantId, userId);
        this.severity = severity;
        this.detectionRule = detectionRule;
    }

    public ThreatSeverity getSeverity() {
        return severity;
    }

    public String getDetectionRule() {
        return detectionRule;
    }

    public boolean requiresSessionInvalidation() {
        return severity == ThreatSeverity.HIGH || severity == ThreatSeverity.CRITICAL;
    }

    public boolean requiresAccountLock() {
        return severity == ThreatSeverity.CRITICAL;
    }

    public static SuspiciousActivityException promptInjection(String tenantId,
                                                               String userId,
                                                               String pattern) {
        return new SuspiciousActivityException(
            "Prompt injection pattern detected: " + pattern,
            tenantId,
            userId,
            ThreatSeverity.HIGH,
            "PROMPT_INJECTION"
        );
    }

    public static SuspiciousActivityException commandInjection(String tenantId,
                                                                String userId,
                                                                String payload) {
        return new SuspiciousActivityException(
            "Command injection attempt detected",
            tenantId,
            userId,
            ThreatSeverity.CRITICAL,
            "COMMAND_INJECTION"
        );
    }
}
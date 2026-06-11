package com.zynctra.ats.model;

/**
 * Severity levels for detected security threats.
 *
 * <p>Determines the response action:
 * <ul>
 *   <li>{@code LOW} — Log and reject request</li>
 *   <li>{@code MEDIUM} — Log, reject, flag user for review</li>
 *   <li>{@code HIGH} — Log, reject, invalidate session</li>
 *   <li>{@code CRITICAL} — Log, reject, lock account, alert admin</li>
 * </ul>
 */
public enum ThreatSeverity {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}

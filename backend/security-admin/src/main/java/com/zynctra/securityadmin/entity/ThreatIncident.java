package com.zynctra.securityadmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Threat Incident Entity — Security threat tracking.
 * 
 * SECURITY:
 * - Severity is ENUM (prevents invalid severity levels)
 * - Status workflow enforced (OPEN → INVESTIGATING → RESOLVED/CLOSED)
 * - Resolution requires justification
 */
@Entity
@Table(
    name = "threat_incidents",
    schema = "securityadmin_schema",
    indexes = {
        @Index(name = "idx_threats_severity", columnList = "severity, status"),
        @Index(name = "idx_threats_timestamp", columnList = "detected_at")
    }
)
public class ThreatIncident extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Size(max = 64)
    @Column(name = "threat_type", nullable = false, length = 64)
    private String threatType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false, length = 16)
    private ThreatSeverity severity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private ThreatStatus status = ThreatStatus.OPEN;

    @Size(max = 2000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Size(max = 1000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "indicators", columnDefinition = "TEXT")
    private String indicators;

    @Size(max = 1000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "affected_resources", columnDefinition = "TEXT")
    private String affectedResources;

    @Size(max = 1000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "resolved_by", length = 64)
    private String resolvedBy;

    @Column(name = "resolved_at")
    private java.time.Instant resolvedAt;

    public enum ThreatSeverity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum ThreatStatus {
        OPEN, INVESTIGATING, CONTAINED, RESOLVED, CLOSED, FALSE_POSITIVE
    }

    public static ThreatIncident create(String threatType, ThreatSeverity severity,
                                         String description, String indicators,
                                         String affectedResources, String createdBy) {
        ThreatIncident incident = new ThreatIncident();
        incident.setThreatType(threatType);
        incident.setSeverity(severity);
        incident.setDescription(description);
        incident.setIndicators(indicators);
        incident.setAffectedResources(affectedResources);
        incident.setUpdatedBy(createdBy);
        return incident;
    }

    public void resolve(String resolutionNotes, String resolvedByUser) {
        if (this.status == ThreatStatus.RESOLVED || this.status == ThreatStatus.CLOSED) {
            throw new IllegalStateException("Incident already resolved");
        }
        if (resolutionNotes == null || resolutionNotes.isBlank()) {
            throw new IllegalArgumentException("Resolution notes required");
        }
        this.status = ThreatStatus.RESOLVED;
        this.resolutionNotes = resolutionNotes;
        this.resolvedBy = resolvedByUser;
        this.resolvedAt = java.time.Instant.now();
    }

    public void setThreatType(String threatType) {
        if (threatType == null || threatType.isBlank()) {
            throw new IllegalArgumentException("Threat type required");
        }
        this.threatType = threatType;
    }

    public void setSeverity(ThreatSeverity severity) {
        if (severity == null) throw new IllegalArgumentException("Severity required");
        this.severity = severity;
    }

    // Getters
    public String getId() { return id; }
    public String getThreatType() { return threatType; }
    public ThreatSeverity getSeverity() { return severity; }
    public ThreatStatus getStatus() { return status; }
    public void setStatus(ThreatStatus status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIndicators() { return indicators; }
    public void setIndicators(String indicators) { this.indicators = indicators; }
    public String getAffectedResources() { return affectedResources; }
    public void setAffectedResources(String affectedResources) { this.affectedResources = affectedResources; }
    public String getResolutionNotes() { return resolutionNotes; }
    public String getResolvedBy() { return resolvedBy; }
    public java.time.Instant getResolvedAt() { return resolvedAt; }
}
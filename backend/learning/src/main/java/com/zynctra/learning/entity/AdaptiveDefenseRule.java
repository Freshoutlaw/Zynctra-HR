package com.zynctra.learning.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "adaptive_defense_rules", schema = "learning_schema")
public class AdaptiveDefenseRule extends SecureBaseEntity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "pattern", nullable = false, columnDefinition = "TEXT")
    private String pattern;

    @Column(name = "source", nullable = false, length = 32)
    private String source; // AUTO_EXTRACTED, MANUAL, IMPORTED

    @Column(name = "confidence", nullable = false, precision = 5, scale = 4)
    private Double confidence;

    @Column(name = "match_count", nullable = false)
    private Integer matchCount = 0;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // Getters/setters
    public String getId() { return id; }
    public void setId(String v) { this.id = v; }
    public String getPattern() { return pattern; }
    public void setPattern(String v) { this.pattern = v; }
    public String getSource() { return source; }
    public void setSource(String v) { this.source = v; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double v) { this.confidence = v; }
    public Integer getMatchCount() { return matchCount; }
    public void setMatchCount(Integer v) { this.matchCount = v; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant v) { this.expiresAt = v; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean v) { this.active = v; }
}
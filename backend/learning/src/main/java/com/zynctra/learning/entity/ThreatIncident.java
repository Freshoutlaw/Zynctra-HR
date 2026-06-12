package com.zynctra.learning.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "threat_incidents", schema = "learning_schema")
public class ThreatIncident extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(name = "decision", nullable = false, length = 16)
    private String decision;

    @Column(name = "reason", nullable = false, length = 256)
    private String reason;

    @Column(name = "heuristic_score", precision = 5, scale = 4)
    private Double heuristicScore;

    @Column(name = "normalized_content", columnDefinition = "TEXT")
    private String normalizedContent;

    @Column(name = "endpoint", length = 128)
    private String endpoint;

    @Column(name = "http_method", length = 8)
    private String httpMethod;

    @Column(name = "client_ip", length = 45)
    private String clientIp;

    @Column(name = "pattern_matches", columnDefinition = "TEXT")
    private String patternMatches;

    @Column(name = "learned_from", length = 64)
    private String learnedFrom; // ID of incident this was learned from

    @Column(name = "processed_for_learning", nullable = false)
    private Boolean processedForLearning = false;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    // Getters/setters
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public void setUserId(String v) { this.userId = v; }
    public String getDecision() { return decision; }
    public void setDecision(String v) { this.decision = v; }
    public String getReason() { return reason; }
    public void setReason(String v) { this.reason = v; }
    public Double getHeuristicScore() { return heuristicScore; }
    public void setHeuristicScore(Double v) { this.heuristicScore = v; }
    public String getNormalizedContent() { return normalizedContent; }
    public void setNormalizedContent(String v) { this.normalizedContent = v; }
    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String v) { this.endpoint = v; }
    public String getHttpMethod() { return httpMethod; }
    public void setHttpMethod(String v) { this.httpMethod = v; }
    public String getClientIp() { return clientIp; }
    public void setClientIp(String v) { this.clientIp = v; }
    public String getPatternMatches() { return patternMatches; }
    public void setPatternMatches(String v) { this.patternMatches = v; }
    public String getLearnedFrom() { return learnedFrom; }
    public void setLearnedFrom(String v) { this.learnedFrom = v; }
    public Boolean getProcessedForLearning() { return processedForLearning; }
    public void setProcessedForLearning(Boolean v) { this.processedForLearning = v; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant v) { this.timestamp = v; }
}
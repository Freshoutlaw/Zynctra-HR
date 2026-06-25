package com.zynctra.learning.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ai_messages", schema = "learning_schema")
public class AiMessage extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(name = "role", nullable = false, length = 16)
    @Enumerated(EnumType.STRING)
    private MessageRole role;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "ai_response", columnDefinition = "TEXT")
    private String aiResponse;

    @Column(name = "correlation_id", length = 64)
    private String correlationId;

    @Column(name = "threat_score", precision = 5, scale = 4)
    private Double threatScore = 0.0;

    @Column(name = "threat_reason", length = 256)
    private String threatReason;

    @Column(name = "response_time_ms")
    private Long responseTimeMs;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    public enum MessageRole { USER, ASSISTANT, SYSTEM, QUARANTINED }

    // Getters/setters
    public String getId() { return id; }
    public void setId(String v) { this.id = v; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String v) { this.sessionId = v; }
    public String getUserId() { return userId; }
    public void setUserId(String v) { this.userId = v; }
    public MessageRole getRole() { return role; }
    public void setRole(MessageRole v) { this.role = v; }
    public void setRole(String v) { this.role = MessageRole.valueOf(v); }
    public String getContent() { return content; }
    public void setContent(String v) { this.content = v; }
    public String getAiResponse() { return aiResponse; }
    public void setAiResponse(String v) { this.aiResponse = v; }
    public String getCorrelationId() { return correlationId; }
    public void setCorrelationId(String v) { this.correlationId = v; }
    public Double getThreatScore() { return threatScore; }
    public void setThreatScore(Double v) { this.threatScore = v; }
    public String getThreatReason() { return threatReason; }
    public void setThreatReason(String v) { this.threatReason = v; }
    public Long getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(Long v) { this.responseTimeMs = v; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant v) { this.timestamp = v; }
}
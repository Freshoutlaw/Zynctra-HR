package com.zynctra.learning.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ai_tutoring_sessions", schema = "learning_schema")
public class AiTutoringSession extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(name = "course_id", length = 64)
    private String courseId;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Column(name = "message_count", nullable = false)
    private Integer messageCount = 0;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "threat_score_max", precision = 5, scale = 4)
    private Double threatScoreMax = 0.0;

    // Getters/setters
    public String getId() { return id; }
    public void setId(String v) { this.id = v; }
    public String getUserId() { return userId; }
    public void setUserId(String v) { this.userId = v; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String v) { this.courseId = v; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant v) { this.startedAt = v; }
    public Instant getEndedAt() { return endedAt; }
    public void setEndedAt(Instant v) { this.endedAt = v; }
    public Integer getMessageCount() { return messageCount; }
    public void setMessageCount(Integer v) { this.messageCount = v; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean v) { this.active = v; }
    public Double getThreatScoreMax() { return threatScoreMax; }
    public void setThreatScoreMax(Double v) { this.threatScoreMax = v; }
}
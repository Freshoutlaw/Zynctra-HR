package com.zynctra.ats.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interviews", schema = "ats", indexes = {
    @Index(name = "idx_interviews_tenant", columnList = "tenant_id"),
    @Index(name = "idx_interviews_app", columnList = "application_id"),
    @Index(name = "idx_interviews_scheduled", columnList = "scheduled_at")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Interview extends TenantBaseEntity {

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "interviewer_id", nullable = false)
    private UUID interviewerId;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 60;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private InterviewType type;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "recommendation", length = 20)
    @Enumerated(EnumType.STRING)
    private Recommendation recommendation;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "weaknesses", columnDefinition = "TEXT")
    private String weaknesses;

    @Column(name = "technical_score")
    private Integer technicalScore;

    @Column(name = "communication_score")
    private Integer communicationScore;

    @Column(name = "culture_fit_score")
    private Integer cultureFitScore;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    public enum InterviewType {
        PHONE,
        VIDEO,
        ONSITE,
        PANEL,
        TECHNICAL,
        CULTURE_FIT,
        FINAL
    }

    public enum InterviewStatus {
        SCHEDULED,
        CONFIRMED,
        RESCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        NO_SHOW
    }

    public enum Recommendation {
        STRONG_HIRE,
        HIRE,
        LEAN_HIRE,
        LEAN_NO_HIRE,
        NO_HIRE,
        STRONG_NO_HIRE
    }
}
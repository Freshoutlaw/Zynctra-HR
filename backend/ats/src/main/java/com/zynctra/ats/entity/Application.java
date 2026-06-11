package com.zynctra.ats.entity;

import java.time.Instant;
import java.util.UUID;

import com.zynctra.shared.entity.TenantBaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "applications", schema = "ats", indexes = {
    @Index(name = "idx_apps_tenant", columnList = "tenant_id"),
    @Index(name = "idx_apps_job", columnList = "job_requisition_id"),
    @Index(name = "idx_apps_candidate", columnList = "candidate_id"),
    @Index(name = "idx_apps_status", columnList = "status"),
    @Index(name = "idx_apps_stage", columnList = "stage")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Application extends TenantBaseEntity {

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "job_requisition_id", nullable = false)
    private UUID jobRequisitionId;

    @Column(name = "candidate_id", nullable = false)
    private UUID candidateId;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(name = "stage", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private PipelineStage stage;

    @Column(name = "applied_at", nullable = false)
    private Instant appliedAt;

    @Column(name = "source", length = 50)
    @Enumerated(EnumType.STRING)
    private Candidate.CandidateSource source;

    @Column(name = "referrer_id")
    private UUID referrerId;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "resume_version", length = 50)
    private String resumeVersion;

    @Column(name = "screening_score")
    private Integer screeningScore;

    @Column(name = "disposition_reason", length = 200)
    private String dispositionReason;

    @Column(name = "disposition_notes", columnDefinition = "TEXT")
    private String dispositionNotes;

    @Column(name = "dispositioned_at")
    private Instant dispositionedAt;

    @Column(name = "dispositioned_by")
    private UUID dispositionedBy;

    @Column(name = "is_internal", nullable = false)
    private Boolean isInternal = false;

    @Column(name = "previous_application_id")
    private UUID previousApplicationId;

    public enum ApplicationStatus {
        ACTIVE,
        WITHDRAWN,
        REJECTED,
        OFFERED,
        HIRED,
        ON_HOLD
    }

    public enum PipelineStage {
        NEW,
        SCREENING,
        PHONE_INTERVIEW,
        TECHNICAL_ASSESSMENT,
        MANAGER_INTERVIEW,
        PANEL_INTERVIEW,
        FINAL_INTERVIEW,
        OFFER_PENDING,
        OFFER_ACCEPTED,
        OFFER_DECLINED,
        BACKGROUND_CHECK,
        REFERENCE_CHECK,
        HIRED,
        REJECTED
    }
}
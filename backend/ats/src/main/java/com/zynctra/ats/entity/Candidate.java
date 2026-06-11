package com.zynctra.ats.entity;

import java.time.Instant;
import java.util.UUID;

import com.zynctra.shared.entity.TenantBaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidates", schema = "ats", indexes = {
    @Index(name = "idx_candidates_tenant", columnList = "tenant_id"),
    @Index(name = "idx_candidates_email", columnList = "email"),
    @Index(name = "idx_candidates_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Candidate extends TenantBaseEntity {

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", nullable = false, length = 254)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "resume_storage_key", length = 500)
    private String resumeStorageKey;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @Column(name = "source", length = 50)
    @Enumerated(EnumType.STRING)
    private CandidateSource source;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CandidateStatus status;

    @Column(name = "current_company", length = 200)
    private String currentCompany;

    @Column(name = "current_title", length = 200)
    private String currentTitle;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "salary_expectation", precision = 15, scale = 2)
    private java.math.BigDecimal salaryExpectation;

    @Column(name = "salary_currency", length = 3)
    private String salaryCurrency;

    @Column(name = "notice_period_days")
    private Integer noticePeriodDays;

    @Column(name = "availability_date")
    private java.time.LocalDate availabilityDate;

    @Column(name = "referred_by")
    private UUID referredBy;

    @Column(name = "custom_fields", columnDefinition = "JSONB")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private java.util.Map<String, Object> customFields;

    @Column(name = "gdpr_consent", nullable = false)
    private Boolean gdprConsent = false;

    @Column(name = "gdpr_consent_date")
    private Instant gdprConsentDate;

    @Column(name = "is_anonymized", nullable = false)
    private Boolean isAnonymized = false;

    @Column(name = "anonymized_at")
    private Instant anonymizedAt;

    public enum CandidateSource {
        CAREERS_PAGE,
        LINKEDIN,
        REFERRAL,
        AGENCY,
        JOB_BOARD,
        SOCIAL_MEDIA,
        DIRECT_APPLICATION,
        INTERNAL
    }

    public enum CandidateStatus {
        NEW,
        REVIEWING,
        PHONE_SCREEN,
        INTERVIEW,
        OFFER,
        HIRED,
        REJECTED,
        WITHDRAWN,
        ON_HOLD,
        BLACKLISTED
    }
}
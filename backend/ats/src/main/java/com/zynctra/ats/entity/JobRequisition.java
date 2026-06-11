package com.zynctra.ats.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.zynctra.shared.entity.TenantBaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_requisitions", schema = "ats", indexes = {
    @Index(name = "idx_jobs_tenant", columnList = "tenant_id"),
    @Index(name = "idx_jobs_status", columnList = "status"),
    @Index(name = "idx_jobs_department", columnList = "department_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobRequisition extends TenantBaseEntity {

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "responsibilities", columnDefinition = "TEXT")
    private String responsibilities;

    @Column(name = "department_id")
    private UUID departmentId;

    @Column(name = "hiring_manager_id", nullable = false)
    private UUID hiringManagerId;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Column(name = "employment_type", length = 20)
    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    @Column(name = "experience_level", length = 20)
    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel;

    @Column(name = "min_salary", precision = 15, scale = 2)
    private BigDecimal minSalary;

    @Column(name = "max_salary", precision = 15, scale = 2)
    private BigDecimal maxSalary;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "remote_allowed", nullable = false)
    private Boolean remoteAllowed = false;

    @Column(name = "posted_at")
    private Instant postedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "target_start_date")
    private LocalDate targetStartDate;

    @Column(name = "openings_count", nullable = false)
    private Integer openingsCount = 1;

    @Column(name = "filled_count", nullable = false)
    private Integer filledCount = 0;

    @Column(name = "external_posting_url", length = 500)
    private String externalPostingUrl;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    public enum JobStatus {
        DRAFT,
        OPEN,
        ON_HOLD,
        CLOSED,
        CANCELLED,
        FILLED
    }

    public enum EmploymentType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        INTERNSHIP,
        TEMPORARY
    }

    public enum ExperienceLevel {
        ENTRY,
        MID,
        SENIOR,
        LEAD,
        EXECUTIVE
    }
}
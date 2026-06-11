package com.zynctra.analytics.entity;

import com.zynctra.shared.entity.TenantBaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Scheduled Report Entity
 * 
 * Tracks scheduled report executions and their delivery status.
 */
@Entity
@Table(name = "scheduled_reports", schema = "analytics", indexes = {
    @Index(name = "idx_scheduled_tenant", columnList = "tenant_id"),
    @Index(name = "idx_scheduled_next_run", columnList = "next_run_at")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ScheduledReport extends TenantBaseEntity {

    @Column(name = "report_id", nullable = false)
    private UUID reportId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "cron_expression", nullable = false, length = 100)
    private String cronExpression;

    @Column(name = "recipients", nullable = false, length = 1000)
    private String recipients; // Comma-separated emails

    @Column(name = "next_run_at")
    private Instant nextRunAt;

    @Column(name = "last_run_at")
    private Instant lastRunAt;

    @Column(name = "last_run_status", length = 20)
    @Enumerated(EnumType.STRING)
    private RunStatus lastRunStatus;

    @Column(name = "last_run_error", length = 2000)
    private String lastRunError;

    @Column(name = "run_count", nullable = false)
    private Integer runCount = 0;

    @Column(name = "failure_count", nullable = false)
    private Integer failureCount = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    public enum RunStatus {
        SCHEDULED,
        RUNNING,
        COMPLETED,
        FAILED,
        DISABLED
    }
}
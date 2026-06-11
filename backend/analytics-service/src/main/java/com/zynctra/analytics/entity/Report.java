package com.zynctra.analytics.entity;

import com.zynctra.shared.entity.TenantBaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Report Entity
 * 
 * Represents a saved report configuration that can be executed
 * on-demand or on a schedule.
 */
@Entity
@Table(name = "reports", schema = "analytics", indexes = {
    @Index(name = "idx_reports_tenant", columnList = "tenant_id"),
    @Index(name = "idx_reports_category", columnList = "category"),
    @Index(name = "idx_reports_created_by", columnList = "created_by")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Report extends TenantBaseEntity {

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "category", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ReportCategory category;

    @Column(name = "query_definition", columnDefinition = "JSONB", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> queryDefinition;

    @Column(name = "parameters", columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> parameters;

    @Column(name = "output_format", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private OutputFormat outputFormat;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "last_executed_at")
    private Instant lastExecutedAt;

    @Column(name = "last_execution_status", length = 20)
    @Enumerated(EnumType.STRING)
    private ExecutionStatus lastExecutionStatus;

    @Column(name = "execution_count", nullable = false)
    private Integer executionCount = 0;

    @Column(name = "is_scheduled", nullable = false)
    private Boolean isScheduled = false;

    @Column(name = "schedule_cron", length = 100)
    private String scheduleCron;

    @Column(name = "is_shared", nullable = false)
    private Boolean isShared = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum ReportCategory {
        HR_OVERVIEW,
        RECRUITING,
        PAYROLL,
        ATTENDANCE,
        PERFORMANCE,
        COMPLIANCE,
        CUSTOM
    }

    public enum OutputFormat {
        JSON,
        CSV,
        EXCEL,
        PDF
    }

    public enum ExecutionStatus {
        PENDING,
        RUNNING,
        COMPLETED,
        FAILED,
        CANCELLED
    }
}
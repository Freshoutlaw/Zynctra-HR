package com.zynctra.analytics.entity;

import com.zynctra.shared.entity.TenantBaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Export Job Entity
 * 
 * Tracks asynchronous data export jobs with their status
 * and output file location.
 */
@Entity
@Table(name = "export_jobs", schema = "analytics", indexes = {
    @Index(name = "idx_exports_tenant", columnList = "tenant_id"),
    @Index(name = "idx_exports_status", columnList = "status"),
    @Index(name = "idx_exports_created_by", columnList = "created_by")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExportJob extends TenantBaseEntity {

    @Column(name = "report_id")
    private UUID reportId;

    @Column(name = "export_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ExportType exportType;

    @Column(name = "format", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ExportFormat format;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "storage_key", length = 500)
    private String storageKey;

    @Column(name = "row_count")
    private Integer rowCount;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ExportStatus status;

    @Column(name = "error_message", length = 2000)
    private String errorMessage;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "download_count", nullable = false)
    private Integer downloadCount = 0;

    public enum ExportType {
        REPORT,
        DASHBOARD,
        EMPLOYEES,
        PAYROLL,
        ATTENDANCE,
        CUSTOM
    }

    public enum ExportFormat {
        CSV,
        EXCEL,
        PDF,
        JSON
    }

    public enum ExportStatus {
        QUEUED,
        PROCESSING,
        COMPLETED,
        FAILED,
        EXPIRED
    }
}
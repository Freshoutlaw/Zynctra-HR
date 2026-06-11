package com.zynctra.analytics.service;

import com.zynctra.analytics.dto.ReportRequest;
import com.zynctra.analytics.entity.Report;
import com.zynctra.analytics.repository.ReportRepository;
import com.zynctra.analytics.security.TenantAuthenticationToken;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Report Service
 * 
 * Manages report configurations with role-based access control.
 * Supports CRUD operations and report execution tracking.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    /**
     * Creates a new report configuration.
     */
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    @Transactional
    public Report createReport(ReportRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        Report report = Report.builder()
            .tenantId(tenantId)
            .name(request.getName())
            .description(request.getDescription())
            .category(request.getCategory())
            .queryDefinition(request.getQueryDefinition())
            .parameters(request.getParameters())
            .outputFormat(request.getOutputFormat())
            .createdBy(userId)
            .isScheduled(request.getIsScheduled() != null ? request.getIsScheduled() : false)
            .scheduleCron(request.getScheduleCron())
            .isShared(request.getIsShared() != null ? request.getIsShared() : false)
            .isActive(true)
            .executionCount(0)
            .build();

        Report saved = reportRepository.save(report);
        log.info("Created report: {} for tenant: {}", saved.getId(), tenantId);
        return saved;
    }

    /**
     * Gets a report by ID with tenant validation.
     */
    @Transactional(readOnly = true)
    public Report getReport(UUID reportId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();

        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new EntityNotFoundException("Report not found: " + reportId));

        if (!report.getTenantId().equals(tenantId)) {
            throw new SecurityException("Access denied: report belongs to different tenant");
        }

        return report;
    }

    /**
     * Lists active reports for the current tenant.
     */
    @Transactional(readOnly = true)
    public Page<Report> listReports(Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return reportRepository.findByTenantIdAndIsActiveTrue(auth.getTenantId(), pageable);
    }

    /**
     * Lists reports by category.
     */
    @Transactional(readOnly = true)
    public List<Report> listReportsByCategory(Report.ReportCategory category) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return reportRepository.findByTenantIdAndCategoryAndIsActiveTrue(auth.getTenantId(), category);
    }

    /**
     * Updates an existing report.
     */
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    @Transactional
    public Report updateReport(UUID reportId, ReportRequest request) {
        Report report = getReport(reportId);
        
        report.setName(request.getName());
        report.setDescription(request.getDescription());
        report.setCategory(request.getCategory());
        report.setQueryDefinition(request.getQueryDefinition());
        report.setParameters(request.getParameters());
        report.setOutputFormat(request.getOutputFormat());
        report.setIsScheduled(request.getIsScheduled());
        report.setScheduleCron(request.getScheduleCron());
        report.setIsShared(request.getIsShared());

        return reportRepository.save(report);
    }

    /**
     * Soft-deletes a report.
     */
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    @Transactional
    public void deleteReport(UUID reportId) {
        Report report = getReport(reportId);
        report.setIsActive(false);
        reportRepository.save(report);
        log.info("Deleted report: {} for tenant: {}", reportId, report.getTenantId());
    }

    /**
     * Records a report execution.
     */
    @Transactional
    public void recordExecution(UUID reportId, Report.ExecutionStatus status) {
        Report report = reportRepository.findById(reportId).orElseThrow();
        report.setLastExecutedAt(Instant.now());
        report.setLastExecutionStatus(status);
        report.setExecutionCount(report.getExecutionCount() + 1);
        reportRepository.save(report);
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}
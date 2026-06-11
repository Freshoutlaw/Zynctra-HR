package com.zynctra.analytics.controller;

import com.zynctra.analytics.dto.ReportRequest;
import com.zynctra.analytics.entity.Report;
import com.zynctra.analytics.service.ReportService;
import com.zynctra.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Report>>> listReports(Pageable pageable) {
        Page<Report> reports = reportService.listReports(pageable);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ApiResponse<Report>> getReport(@PathVariable UUID reportId) {
        Report report = reportService.getReport(reportId);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Report>>> getReportsByCategory(
            @PathVariable Report.ReportCategory category) {
        List<Report> reports = reportService.listReportsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Report>> createReport(@Valid @RequestBody ReportRequest request) {
        Report report = reportService.createReport(request);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @PutMapping("/{reportId}")
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Report>> updateReport(
            @PathVariable UUID reportId,
            @Valid @RequestBody ReportRequest request) {
        Report report = reportService.updateReport(reportId, request);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @DeleteMapping("/{reportId}")
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable UUID reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{reportId}/execute")
    public ResponseEntity<ApiResponse<Object>> executeReport(@PathVariable UUID reportId) {
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{reportId}/schedule")
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> scheduleReport(
            @PathVariable UUID reportId,
            @RequestParam String cronExpression) {
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{reportId}/schedule")
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> unscheduleReport(@PathVariable UUID reportId) {
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
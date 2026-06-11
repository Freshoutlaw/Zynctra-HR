package com.zynctra.analytics.controller;

import com.zynctra.analytics.dto.ExportRequest;
import com.zynctra.analytics.entity.ExportJob;
import com.zynctra.analytics.service.ExportService;
import com.zynctra.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics/exports")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExportJob>>> listExports(Pageable pageable) {
        Page<ExportJob> exports = exportService.listExports(pageable);
        return ResponseEntity.ok(ApiResponse.success(exports));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExportJob>> createExport(@Valid @RequestBody ExportRequest request) {
        ExportJob job = exportService.createExportJob(request);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @GetMapping("/{exportId}")
    public ResponseEntity<ApiResponse<ExportJob>> getExport(@PathVariable UUID exportId) {
        ExportJob job = exportService.getExport(exportId);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @GetMapping("/{exportId}/download")
    public ResponseEntity<Resource> downloadExport(@PathVariable UUID exportId) {
        ExportJob job = exportService.getExport(exportId);
        Resource file = exportService.downloadExportFile(exportId);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(getContentType(job.getFormat())))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + job.getFileName() + "\"")
            .body(file);
    }

    @DeleteMapping("/{exportId}")
    public ResponseEntity<ApiResponse<Void>> deleteExport(@PathVariable UUID exportId) {
        exportService.deleteExport(exportId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private String getContentType(ExportJob.ExportFormat format) {
        return switch (format) {
            case CSV -> "text/csv";
            case EXCEL -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case PDF -> "application/pdf";
            case JSON -> "application/json";
        };
    }
}
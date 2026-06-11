package com.zynctra.analytics.service;

import com.zynctra.analytics.config.AnalyticsConfig;
import com.zynctra.analytics.dto.ExportRequest;
import com.zynctra.analytics.entity.ExportJob;
import com.zynctra.analytics.repository.ExportJobRepository;
import com.zynctra.analytics.security.TenantAuthenticationToken;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService {

    private final ExportJobRepository exportJobRepository;
    private final AnalyticsConfig analyticsConfig;

    @Transactional
    public ExportJob createExportJob(ExportRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        String fileName = generateFileName(request);

        ExportJob job = ExportJob.builder()
            .tenantId(tenantId)
            .reportId(request.getReportId())
            .exportType(request.getExportType())
            .format(request.getFormat())
            .fileName(fileName)
            .status(ExportJob.ExportStatus.QUEUED)
            .createdBy(userId)
            .downloadCount(0)
            .build();

        ExportJob saved = exportJobRepository.save(job);
        log.info("Created export job: {} for tenant: {}", saved.getId(), tenantId);

        processExportAsync(saved.getId());

        return saved;
    }

    @Async("exportExecutor")
    public void processExportAsync(UUID exportId) {
        ExportJob job = exportJobRepository.findById(exportId).orElse(null);
        if (job == null) return;

        try {
            job.setStatus(ExportJob.ExportStatus.PROCESSING);
            job.setStartedAt(Instant.now());
            exportJobRepository.save(job);

            Path exportPath = generateExportFile(job);

            job.setStatus(ExportJob.ExportStatus.COMPLETED);
            job.setCompletedAt(Instant.now());
            job.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
            job.setStorageKey(exportPath.toString());
            job.setFileSizeBytes(Files.size(exportPath));

            exportJobRepository.save(job);
            log.info("Completed export job: {}", exportId);

        } catch (Exception e) {
            log.error("Export job {} failed: {}", exportId, e.getMessage());
            job.setStatus(ExportJob.ExportStatus.FAILED);
            job.setErrorMessage(e.getMessage());
            job.setCompletedAt(Instant.now());
            exportJobRepository.save(job);
        }
    }

    @Transactional(readOnly = true)
    public Page<ExportJob> listExports(Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return exportJobRepository.findByTenantIdOrderByCreatedAtDesc(auth.getTenantId(), pageable);
    }

    @Transactional(readOnly = true)
    public ExportJob getExport(UUID exportId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        ExportJob job = exportJobRepository.findByIdAndTenantIdAndCreatedBy(exportId, tenantId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Export not found: " + exportId));

        if (job.getStatus() == ExportJob.ExportStatus.EXPIRED) {
            throw new IllegalStateException("Export has expired");
        }

        job.setDownloadCount(job.getDownloadCount() + 1);
        exportJobRepository.save(job);

        return job;
    }

    public Resource downloadExportFile(UUID exportId) {
        ExportJob job = getExport(exportId);
        return new FileSystemResource(job.getStorageKey());
    }

    @Transactional
    public void deleteExport(UUID exportId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        ExportJob job = exportJobRepository.findByIdAndTenantIdAndCreatedBy(exportId, tenantId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Export not found: " + exportId));

        try {
            if (job.getStorageKey() != null) {
                Files.deleteIfExists(Path.of(job.getStorageKey()));
            }
        } catch (IOException e) {
            log.warn("Failed to delete export file: {}", job.getStorageKey());
        }

        exportJobRepository.delete(job);
    }

    @Transactional
    public void cleanupExpiredExports() {
        Instant now = Instant.now();
        List<ExportJob> expired = exportJobRepository.findExpiredExports(now);

        for (ExportJob job : expired) {
            try {
                if (job.getStorageKey() != null) {
                    Files.deleteIfExists(Path.of(job.getStorageKey()));
                }
            } catch (IOException e) {
                log.warn("Failed to delete expired export file: {}", job.getStorageKey());
            }
        }

        int count = exportJobRepository.markExpiredExports(now);
        log.info("Cleaned up {} expired exports", count);
    }

    private String generateFileName(ExportRequest request) {
        String timestamp = java.time.LocalDateTime.now()
            .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String extension = switch (request.getFormat()) {
            case CSV -> "csv";
            case EXCEL -> "xlsx";
            case PDF -> "pdf";
            case JSON -> "json";
        };
        return String.format("zynctra_export_%s_%s.%s",
            request.getExportType().name().toLowerCase(), timestamp, extension);
    }

    private Path generateExportFile(ExportJob job) throws IOException {
        Path tempDir = analyticsConfig.getExport().getTempDirPath();
        Files.createDirectories(tempDir);
        Path filePath = tempDir.resolve(job.getFileName());

        switch (job.getFormat()) {
            case CSV -> generateCsvExport(job, filePath);
            case EXCEL -> generateExcelExport(job, filePath);
            case PDF -> generatePdfExport(job, filePath);
            case JSON -> generateJsonExport(job, filePath);
        }

        return filePath;
    }

    private void generateCsvExport(ExportJob job, Path path) throws IOException {
        List<String> lines = List.of("id,name,value", "1,Sample,100");
        Files.write(path, lines);
    }

    private void generateExcelExport(ExportJob job, Path path) throws IOException {
        org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
        org.apache.poi.xssf.usermodel.XSSFSheet sheet = workbook.createSheet("Export");
        org.apache.poi.xssf.usermodel.XSSFRow row = sheet.createRow(0);
        row.createCell(0).setCellValue("Sample Data");
        try (java.io.FileOutputStream fos = new java.io.FileOutputStream(path.toFile())) {
            workbook.write(fos);
        }
        workbook.close();
    }

    private void generatePdfExport(ExportJob job, Path path) throws IOException {
        com.lowagie.text.Document document = new com.lowagie.text.Document();
        try {
            com.lowagie.text.pdf.PdfWriter.getInstance(document, new java.io.FileOutputStream(path.toFile()));
            document.open();
            document.add(new com.lowagie.text.Paragraph("Zynctra HR Export"));
            document.add(new com.lowagie.text.Paragraph("Generated: " + Instant.now()));
            document.close();
        } catch (com.lowagie.text.DocumentException e) {
            throw new IOException("Failed to generate PDF", e);
        }
    }

    private void generateJsonExport(ExportJob job, Path path) throws IOException {
        String json = "{\"exportId\":\"" + job.getId() + "\",\"status\":\"completed\"}";
        Files.writeString(path, json);
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}
package com.zynctra.analytics.dto;

import com.zynctra.analytics.entity.ExportJob;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;
import java.util.UUID;

/**
 * Export Request
 * 
 * DTO for initiating a data export job.
 */
@Data
public class ExportRequest {

    private UUID reportId;

    @NotNull
    private ExportJob.ExportType exportType;

    @NotNull
    private ExportJob.ExportFormat format;

    private Map<String, Object> filters;

    private String dateRangeStart;

    private String dateRangeEnd;
}
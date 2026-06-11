package com.zynctra.analytics.dto;

import com.zynctra.analytics.entity.Report;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Map;

/**
 * Report Request
 * 
 * DTO for creating or updating a report configuration.
 */
@Data
public class ReportRequest {

    @NotBlank
    @Size(max = 200)
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull
    private Report.ReportCategory category;

    @NotNull
    private Map<String, Object> queryDefinition;

    private Map<String, Object> parameters;

    @NotNull
    private Report.OutputFormat outputFormat;

    private Boolean isScheduled = false;

    private String scheduleCron;

    private Boolean isShared = false;
}
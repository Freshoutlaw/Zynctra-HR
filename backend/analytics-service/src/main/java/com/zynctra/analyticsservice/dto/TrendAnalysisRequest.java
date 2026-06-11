package com.zynctra.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * Trend Analysis Request
 * 
 * DTO for requesting trend analysis over a time period.
 */
@Data
public class TrendAnalysisRequest {

    @NotBlank
    private String metric; // e.g., "attrition", "hiring", "attendance", "payroll"

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private String groupBy; // "day", "week", "month", "quarter", "year"

    private String departmentId;

    private String compareToPreviousPeriod = "false";
}
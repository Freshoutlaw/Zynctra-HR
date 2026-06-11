package com.zynctra.benefits.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.zynctra.benefits.entity.Enrollment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EnrollmentRequest {

    @NotNull
    private UUID employeeId;

    @NotNull
    private UUID planId;

    @NotNull
    private Enrollment.EnrollmentStatus status;

    @NotNull
    @FutureOrPresent
    private LocalDate effectiveDate;

    @Size(max = 30)
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-]+$", message = "Invalid coverage level format")
    private String coverageLevel;

    @Min(0)
    @Max(20)
    private Integer dependentCount;

    @DecimalMin("0.00")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal employeeContribution;

    @DecimalMin("0.00")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal employerContribution;
}
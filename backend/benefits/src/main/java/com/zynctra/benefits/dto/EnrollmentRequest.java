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

    // Getters and setters
    public UUID getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(UUID employeeId) {
        this.employeeId = employeeId;
    }

    public UUID getPlanId() {
        return planId;
    }

    public void setPlanId(UUID planId) {
        this.planId = planId;
    }

    public Enrollment.EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(Enrollment.EnrollmentStatus status) {
        this.status = status;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getCoverageLevel() {
        return coverageLevel;
    }

    public void setCoverageLevel(String coverageLevel) {
        this.coverageLevel = coverageLevel;
    }

    public Integer getDependentCount() {
        return dependentCount;
    }

    public void setDependentCount(Integer dependentCount) {
        this.dependentCount = dependentCount;
    }

    public BigDecimal getEmployeeContribution() {
        return employeeContribution;
    }

    public void setEmployeeContribution(BigDecimal employeeContribution) {
        this.employeeContribution = employeeContribution;
    }

    public BigDecimal getEmployerContribution() {
        return employerContribution;
    }

    public void setEmployerContribution(BigDecimal employerContribution) {
        this.employerContribution = employerContribution;
    }
}
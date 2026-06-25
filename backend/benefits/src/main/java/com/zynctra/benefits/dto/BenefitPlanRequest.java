package com.zynctra.benefits.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.zynctra.benefits.entity.BenefitPlan;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class BenefitPlanRequest {

    @NotBlank
    @Size(min = 2, max = 200)
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-'.&()]+$", message = "Plan name contains invalid characters")
    private String name;

    @NotBlank
    @Size(max = 50)
    @Pattern(regexp = "^[A-Z0-9\\-]+$", message = "Plan code must be uppercase alphanumeric with hyphens")
    private String planCode;

    @NotNull
    private BenefitPlan.PlanType type;

    @Size(max = 5000)
    private String description;

    @Size(max = 10000)
    private String coverageDetails;

    @DecimalMin("0.00")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal employerContribution;

    @DecimalMin("0.00")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal employeeContribution;

    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be 3-letter ISO code")
    private String currency;

    @FutureOrPresent
    private LocalDate effectiveDate;

    @Future
    private LocalDate expirationDate;

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlanCode() {
        return planCode;
    }

    public void setPlanCode(String planCode) {
        this.planCode = planCode;
    }

    public BenefitPlan.PlanType getType() {
        return type;
    }

    public void setType(BenefitPlan.PlanType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverageDetails() {
        return coverageDetails;
    }

    public void setCoverageDetails(String coverageDetails) {
        this.coverageDetails = coverageDetails;
    }

    public BigDecimal getEmployerContribution() {
        return employerContribution;
    }

    public void setEmployerContribution(BigDecimal employerContribution) {
        this.employerContribution = employerContribution;
    }

    public BigDecimal getEmployeeContribution() {
        return employeeContribution;
    }

    public void setEmployeeContribution(BigDecimal employeeContribution) {
        this.employeeContribution = employeeContribution;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
}
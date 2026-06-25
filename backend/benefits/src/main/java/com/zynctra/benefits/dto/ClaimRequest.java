package com.zynctra.benefits.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.zynctra.benefits.entity.Claim;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

public class ClaimRequest {

    @NotNull
    private UUID employeeId;

    @NotNull
    private UUID enrollmentId;

    @NotNull
    private Claim.ClaimType type;

    @NotNull
    @PastOrPresent
    private LocalDate serviceDate;

    @NotNull
    @DecimalMin("0.01")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal amountClaimed;

    @NotBlank
    @Size(min = 3, max = 3)
    private String currency;

    @NotBlank
    @Size(max = 5000)
    private String description;

    @NotBlank
    @Size(max = 200)
    private String providerName;

    @Size(max = 20)
    private String providerTaxId;

    @NotBlank
    @Size(max = 50)
    private String reimbursementMethod;

    // Getters and setters
    public UUID getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(UUID employeeId) {
        this.employeeId = employeeId;
    }

    public UUID getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(UUID enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Claim.ClaimType getType() {
        return type;
    }

    public void setType(Claim.ClaimType type) {
        this.type = type;
    }

    public LocalDate getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDate serviceDate) {
        this.serviceDate = serviceDate;
    }

    public BigDecimal getAmountClaimed() {
        return amountClaimed;
    }

    public void setAmountClaimed(BigDecimal amountClaimed) {
        this.amountClaimed = amountClaimed;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getProviderTaxId() {
        return providerTaxId;
    }

    public void setProviderTaxId(String providerTaxId) {
        this.providerTaxId = providerTaxId;
    }

    public String getReimbursementMethod() {
        return reimbursementMethod;
    }

    public void setReimbursementMethod(String reimbursementMethod) {
        this.reimbursementMethod = reimbursementMethod;
    }
}

package com.zynctra.benefits.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "claims")
public class Claim extends BaseEntity {

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "enrollment_id", nullable = false)
    private UUID enrollmentId;

    @Column(name = "claim_number", nullable = false, length = 50, unique = true)
    private String claimNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClaimType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClaimStatus status = ClaimStatus.SUBMITTED;

    @Column(name = "service_date")
    private LocalDate serviceDate;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "reimbursement_date")
    private LocalDate reimbursementDate;

    @Column(name = "amount_claimed", precision = 15, scale = 2)
    private BigDecimal amountClaimed;

    @Column(name = "amount_approved", precision = 15, scale = 2)
    private BigDecimal amountApproved;

    @Column(length = 3)
    private String currency;

    @Column(length = 5000)
    private String description;

    @Column(name = "provider_name", length = 200)
    private String providerName;

    @Column(name = "provider_tax_id", length = 20)
    private String providerTaxId;

    @Column(name = "reimbursement_method", length = 50)
    private String reimbursementMethod;

    @Column(name = "denial_reason", length = 5000)
    private String denialReason;

    @Column(name = "review_notes", length = 10000)
    private String reviewNotes;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public enum ClaimType {
        MEDICAL, DENTAL, VISION, PRESCRIPTION, HOSPITAL, OTHER
    }

    public enum ClaimStatus {
        SUBMITTED, IN_REVIEW, APPROVED, REIMBURSED, DENIED, CANCELLED
    }

    public Claim() {}

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }
    public UUID getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(UUID enrollmentId) { this.enrollmentId = enrollmentId; }
    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }
    public ClaimType getType() { return type; }
    public void setType(ClaimType type) { this.type = type; }
    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }
    public LocalDate getServiceDate() { return serviceDate; }
    public void setServiceDate(LocalDate serviceDate) { this.serviceDate = serviceDate; }
    public LocalDate getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDate submissionDate) { this.submissionDate = submissionDate; }
    public LocalDate getReimbursementDate() { return reimbursementDate; }
    public void setReimbursementDate(LocalDate reimbursementDate) { this.reimbursementDate = reimbursementDate; }
    public BigDecimal getAmountClaimed() { return amountClaimed; }
    public void setAmountClaimed(BigDecimal amountClaimed) { this.amountClaimed = amountClaimed; }
    public BigDecimal getAmountApproved() { return amountApproved; }
    public void setAmountApproved(BigDecimal amountApproved) { this.amountApproved = amountApproved; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getProviderTaxId() { return providerTaxId; }
    public void setProviderTaxId(String providerTaxId) { this.providerTaxId = providerTaxId; }
    public String getReimbursementMethod() { return reimbursementMethod; }
    public void setReimbursementMethod(String reimbursementMethod) { this.reimbursementMethod = reimbursementMethod; }
    public String getDenialReason() { return denialReason; }
    public void setDenialReason(String denialReason) { this.denialReason = denialReason; }
    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Claim claim = new Claim();
        public Builder tenantId(UUID id) { claim.setTenantId(id != null ? id.toString() : null); return this; }
        public Builder employeeId(UUID id) { claim.employeeId = id; return this; }
        public Builder enrollmentId(UUID id) { claim.enrollmentId = id; return this; }
        public Builder claimNumber(String n) { claim.claimNumber = n; return this; }
        public Builder type(ClaimType t) { claim.type = t; return this; }
        public Builder status(ClaimStatus s) { claim.status = s; return this; }
        public Builder serviceDate(LocalDate d) { claim.serviceDate = d; return this; }
        public Builder submissionDate(LocalDate d) { claim.submissionDate = d; return this; }
        public Builder reimbursementDate(LocalDate d) { claim.reimbursementDate = d; return this; }
        public Builder amountClaimed(BigDecimal v) { claim.amountClaimed = v; return this; }
        public Builder amountApproved(BigDecimal v) { claim.amountApproved = v; return this; }
        public Builder currency(String c) { claim.currency = c; return this; }
        public Builder description(String d) { claim.description = d; return this; }
        public Builder providerName(String n) { claim.providerName = n; return this; }
        public Builder providerTaxId(String id) { claim.providerTaxId = id; return this; }
        public Builder reimbursementMethod(String m) { claim.reimbursementMethod = m; return this; }
        public Builder denialReason(String r) { claim.denialReason = r; return this; }
        public Builder reviewNotes(String n) { claim.reviewNotes = n; return this; }
        public Builder createdBy(UUID id) { claim.createdBy = id; return this; }
        public Builder updatedBy(UUID id) { claim.updatedBy = id; return this; }
        public Claim build() { return claim; }
    }
}
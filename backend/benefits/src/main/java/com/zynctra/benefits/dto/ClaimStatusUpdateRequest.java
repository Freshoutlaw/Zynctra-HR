package com.zynctra.benefits.dto;

import com.zynctra.benefits.entity.Claim;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class ClaimStatusUpdateRequest {

    @NotNull
    private Claim.ClaimStatus newStatus;

    @DecimalMin("0.00")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal amountApproved;

    @Size(max = 2000)
    private String denialReason;

    @Size(max = 2000)
    private String reviewNotes;

    // Getters and setters
    public Claim.ClaimStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(Claim.ClaimStatus newStatus) {
        this.newStatus = newStatus;
    }

    public BigDecimal getAmountApproved() {
        return amountApproved;
    }

    public void setAmountApproved(BigDecimal amountApproved) {
        this.amountApproved = amountApproved;
    }

    public String getDenialReason() {
        return denialReason;
    }

    public void setDenialReason(String denialReason) {
        this.denialReason = denialReason;
    }

    public String getReviewNotes() {
        return reviewNotes;
    }

    public void setReviewNotes(String reviewNotes) {
        this.reviewNotes = reviewNotes;
    }
}
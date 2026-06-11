package com.zynctra.benefits.dto;

import com.zynctra.benefits.entity.Claim;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
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
}
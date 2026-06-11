package com.zynctra.ats.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OfferRequest {

    @NotNull
    private UUID applicationId;

    @NotNull
    @Positive
    private BigDecimal salary;

    @NotNull
    private String currency;

    private BigDecimal bonus;

    private BigDecimal equity;

    private String equityType;

    private String benefitsSummary;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate expiryDate;
}
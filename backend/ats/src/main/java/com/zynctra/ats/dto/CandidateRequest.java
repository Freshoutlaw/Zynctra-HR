package com.zynctra.ats.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import com.zynctra.ats.entity.Candidate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CandidateRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    private String phone;

    private String linkedinUrl;

    private String portfolioUrl;

    @NotNull
    private Candidate.CandidateSource source;

    private String currentCompany;

    private String currentTitle;

    private Integer yearsOfExperience;

    private BigDecimal salaryExpectation;

    private String salaryCurrency;

    private Integer noticePeriodDays;

    private LocalDate availabilityDate;

    private UUID referredBy;

    private Map<String, Object> customFields;

    private Boolean gdprConsent = false;
}
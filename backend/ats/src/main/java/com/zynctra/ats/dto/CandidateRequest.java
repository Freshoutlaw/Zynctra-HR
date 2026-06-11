package com.zynctra.ats.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import com.zynctra.ats.entity.Candidate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CandidateRequest {

    @NotBlank
    @Size(min = 1, max = 100)
    @Pattern(regexp = "^[a-zA-Z\\s\\-'.]+$", message = "First name contains invalid characters")
    private String firstName;

    @NotBlank
    @Size(min = 1, max = 100)
    @Pattern(regexp = "^[a-zA-Z\\s\\-'.]+$", message = "Last name contains invalid characters")
    private String lastName;

    @NotBlank
    @Email
    @Size(max = 254)
    private String email;

    @Pattern(regexp = "^[\\d\\s\\-+()]+$", message = "Invalid phone number format")
    @Size(max = 20)
    private String phone;

    @Size(max = 500)
    @Pattern(regexp = "^(https?://)?([\\w\\-]+\\.)+[\\w\\-]+(/[\\w\\-./?%&=]*)?$", message = "Invalid URL format")
    private String linkedinUrl;

    @Size(max = 500)
    @Pattern(regexp = "^(https?://)?([\\w\\-]+\\.)+[\\w\\-]+(/[\\w\\-./?%&=]*)?$", message = "Invalid URL format")
    private String portfolioUrl;

    @NotNull
    private Candidate.CandidateSource source;

    @Size(max = 200)
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-.,'&()]+$", message = "Invalid company name")
    private String currentCompany;

    @Size(max = 200)
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-.,'&()/]+$", message = "Invalid title")
    private String currentTitle;

    @Min(0)
    @Max(60)
    private Integer yearsOfExperience;

    @Min(0)
    private BigDecimal salaryExpectation;

    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be 3-letter ISO code")
    @Size(max = 3)
    private String salaryCurrency;

    @Min(0)
    @Max(365)
    private Integer noticePeriodDays;

    private LocalDate availabilityDate;

    private UUID referredBy;

    @Size(max = 50)
    private Map<String, String> customFields;

    private Boolean gdprConsent = false;
}
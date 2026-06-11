package com.zynctra.ats.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.zynctra.ats.entity.JobRequisition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class JobRequisitionRequest {

    @NotBlank
    private String title;

    private String description;

    private String requirements;

    private String responsibilities;

    private UUID departmentId;

    @NotNull
    private UUID hiringManagerId;

    @NotNull
    private JobRequisition.EmploymentType employmentType;

    private JobRequisition.ExperienceLevel experienceLevel;

    private BigDecimal minSalary;

    private BigDecimal maxSalary;

    private String currency;

    private String location;

    private Boolean remoteAllowed = false;

    private LocalDate targetStartDate;

    @Positive
    private Integer openingsCount = 1;
}
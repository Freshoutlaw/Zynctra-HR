package com.zynctra.ats.dto;

import java.util.UUID;

import com.zynctra.ats.entity.Candidate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {

    @NotNull
    private UUID jobRequisitionId;

    @NotNull
    private UUID candidateId;

    private Candidate.CandidateSource source;

    private UUID referrerId;

    private String coverLetter;

    private String resumeVersion;

    private Boolean isInternal = false;

    private UUID previousApplicationId;
}
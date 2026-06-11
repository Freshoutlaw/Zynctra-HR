package com.zynctra.ats.dto;

import com.zynctra.ats.entity.Interview;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewFeedbackRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String feedback;

    @NotNull
    private Interview.Recommendation recommendation;

    private String strengths;

    private String weaknesses;

    @Min(1)
    @Max(10)
    private Integer technicalScore;

    @Min(1)
    @Max(10)
    private Integer communicationScore;

    @Min(1)
    @Max(10)
    private Integer cultureFitScore;
}
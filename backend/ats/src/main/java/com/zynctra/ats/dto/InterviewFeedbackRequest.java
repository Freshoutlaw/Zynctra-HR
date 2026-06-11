package com.zynctra.ats.dto;

import com.zynctra.ats.entity.Interview;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InterviewFeedbackRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @Size(max = 5000)
    private String feedback;

    @NotNull
    private Interview.Recommendation recommendation;

    @Size(max = 2000)
    private String strengths;

    @Size(max = 2000)
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
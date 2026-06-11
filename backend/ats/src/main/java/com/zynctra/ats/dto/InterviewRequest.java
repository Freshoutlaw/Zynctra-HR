package com.zynctra.ats.dto;

import java.time.Instant;
import java.util.UUID;

import com.zynctra.ats.entity.Interview;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class InterviewRequest {

    @NotNull
    private UUID applicationId;

    @NotNull
    private UUID interviewerId;

    @NotNull
    private Instant scheduledAt;

    @Positive
    private Integer durationMinutes = 60;

    @NotNull
    private Interview.InterviewType type;

    private String location;

    private String meetingLink;
}
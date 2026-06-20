package com.zynctra.ats.dto;

import com.zynctra.ats.entity.Application;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PipelineUpdateRequest {
    @NotNull
    private Application.PipelineStage newStage;

    private String dispositionReason;

    private String dispositionNotes;
}

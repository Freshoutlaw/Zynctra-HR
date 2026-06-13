package com.zynctra.performance.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * DTO for Goal operations
 */
public class GoalDTO {

    private String id;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    private String employeeId;

    @NotBlank
    @Size(min = 2, max = 200)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()]+$")
    private String title;

    @Size(max = 3000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String description;

    @Min(0) @Max(100)
    private Integer progressPercent = 0;

    @NotNull
    private LocalDate dueDate;

    @Min(0) @Max(100)
    private Integer weightPercent; // Stored as percent (0-100), converted to 0.0-1.0

    // Getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Integer getWeightPercent() { return weightPercent; }
    public void setWeightPercent(Integer weightPercent) { this.weightPercent = weightPercent; }
}
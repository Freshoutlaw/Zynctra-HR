package com.zynctra.performance.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO for Performance Review operations
 * 
 * SECURITY:
 * - All fields validated before reaching entity layer
 * - No direct entity mapping to prevent mass assignment
 * - IDs validated for format
 */
public class PerformanceReviewDTO {

    private String id; // Null for create operations

    @NotBlank(message = "Employee ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$", message = "Invalid employee ID format")
    private String employeeId;

    @NotBlank(message = "Reviewer ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$", message = "Invalid reviewer ID format")
    private String reviewerId;

    @NotNull(message = "Review period start is required")
    private LocalDate reviewPeriodStart;

    @NotNull(message = "Review period end is required")
    private LocalDate reviewPeriodEnd;

    @Min(1) @Max(5)
    private Integer overallRating;

    @Size(max = 2000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Invalid characters in strengths")
    private String strengths;

    @Size(max = 2000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Invalid characters in areas for improvement")
    private String areasForImprovement;

    @Size(max = 2000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Invalid characters in goals")
    private String goals;

    @Size(max = 1000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Invalid characters in comments")
    private String reviewerComments;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getReviewerId() { return reviewerId; }
    public void setReviewerId(String reviewerId) { this.reviewerId = reviewerId; }
    public LocalDate getReviewPeriodStart() { return reviewPeriodStart; }
    public void setReviewPeriodStart(LocalDate reviewPeriodStart) { this.reviewPeriodStart = reviewPeriodStart; }
    public LocalDate getReviewPeriodEnd() { return reviewPeriodEnd; }
    public void setReviewPeriodEnd(LocalDate reviewPeriodEnd) { this.reviewPeriodEnd = reviewPeriodEnd; }
    public Integer getOverallRating() { return overallRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    public String getAreasForImprovement() { return areasForImprovement; }
    public void setAreasForImprovement(String areasForImprovement) { this.areasForImprovement = areasForImprovement; }
    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }
    public String getReviewerComments() { return reviewerComments; }
    public void setReviewerComments(String reviewerComments) { this.reviewerComments = reviewerComments; }
}
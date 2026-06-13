package com.zynctra.performance.entity;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Performance Review Entity
 * 
 * SECURITY:
 * - All text fields have strict length limits (DoS prevention)
 * - Regex patterns prevent injection in review comments
 * - Salary/compensation data is NOT stored here (separate encrypted service)
 * - Tenant isolation inherited from SecureBaseEntity
 */
@Entity
@Table(
    name = "performance_reviews",
    schema = "performance_schema",
    indexes = {
        @Index(name = "idx_reviews_employee_tenant", columnList = "employee_id, tenant_id"),
        @Index(name = "idx_reviews_period", columnList = "review_period_start, review_period_end"),
        @Index(name = "idx_reviews_status", columnList = "status, tenant_id")
    }
)
public class PerformanceReview extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank(message = "Employee ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$", message = "Invalid employee ID format")
    @Column(name = "employee_id", nullable = false, length = 64)
    private String employeeId;

    @NotBlank(message = "Reviewer ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$", message = "Invalid reviewer ID format")
    @Column(name = "reviewer_id", nullable = false, length = 64)
    private String reviewerId;

    @NotNull(message = "Review period start is required")
    @Column(name = "review_period_start", nullable = false)
    private LocalDate reviewPeriodStart;

    @NotNull(message = "Review period end is required")
    @Column(name = "review_period_end", nullable = false)
    private LocalDate reviewPeriodEnd;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private ReviewStatus status = ReviewStatus.DRAFT;

    @Min(1) @Max(5)
    @Column(name = "overall_rating")
    private Integer overallRating;

    @Size(max = 2000, message = "Strengths comment cannot exceed 2000 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Strengths contains invalid characters")
    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Size(max = 2000, message = "Areas for improvement cannot exceed 2000 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Areas for improvement contains invalid characters")
    @Column(name = "areas_for_improvement", columnDefinition = "TEXT")
    private String areasForImprovement;

    @Size(max = 2000, message = "Goals comment cannot exceed 2000 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Goals contains invalid characters")
    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;

    @Size(max = 1000, message = "Reviewer comments cannot exceed 1000 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Comments contains invalid characters")
    @Column(name = "reviewer_comments", columnDefinition = "TEXT")
    private String reviewerComments;

    @Column(name = "employee_acknowledged", nullable = false)
    private Boolean employeeAcknowledged = false;

    @Column(name = "acknowledged_at")
    private Instant acknowledgedAt;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "finalized_at")
    private Instant finalizedAt;

    public enum ReviewStatus {
        DRAFT,          // Being written by manager
        SUBMITTED,      // Submitted to employee for review
        ACKNOWLEDGED,   // Employee has seen it
        DISPUTED,       // Employee has disputed
        FINALIZED,      // Complete, locked
        CANCELLED       // Administratively cancelled
    }

    // Secure factory method
    public static PerformanceReview create(
            String employeeId, 
            String reviewerId,
            LocalDate periodStart,
            LocalDate periodEnd,
            String createdBy) {
        
        PerformanceReview review = new PerformanceReview();
        review.setEmployeeId(employeeId);
        review.setReviewerId(reviewerId);
        review.setReviewPeriodStart(periodStart);
        review.setReviewPeriodEnd(periodEnd);
        review.setStatus(ReviewStatus.DRAFT);
        review.setUpdatedBy(createdBy);
        return review;
    }

    // Security-hardened setters
    public void setEmployeeId(String employeeId) {
        validateIdFormat(employeeId, "Employee ID");
        this.employeeId = employeeId;
    }

    public void setReviewerId(String reviewerId) {
        validateIdFormat(reviewerId, "Reviewer ID");
        this.reviewerId = reviewerId;
    }

    public void setStatus(ReviewStatus status) {
        if (status == null) throw new IllegalArgumentException("Status cannot be null");
        // State machine validation
        if (this.status == ReviewStatus.FINALIZED && status != ReviewStatus.FINALIZED) {
            throw new IllegalStateException("Cannot modify a finalized review");
        }
        this.status = status;
        if (status == ReviewStatus.SUBMITTED) this.submittedAt = Instant.now();
        if (status == ReviewStatus.FINALIZED) this.finalizedAt = Instant.now();
    }

    public void setOverallRating(Integer rating) {
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.overallRating = rating;
    }

    public void setStrengths(String strengths) {
        this.strengths = sanitizeText(strengths, 2000);
    }

    public void setAreasForImprovement(String areas) {
        this.areasForImprovement = sanitizeText(areas, 2000);
    }

    public void setGoals(String goals) {
        this.goals = sanitizeText(goals, 2000);
    }

    public void setReviewerComments(String comments) {
        this.reviewerComments = sanitizeText(comments, 1000);
    }

    public void acknowledge(String employeeId) {
        if (!this.employeeId.equals(employeeId)) {
            throw new SecurityException("Only the review subject can acknowledge");
        }
        if (this.status != ReviewStatus.SUBMITTED && this.status != ReviewStatus.DISPUTED) {
            throw new IllegalStateException("Can only acknowledge submitted or disputed reviews");
        }
        this.employeeAcknowledged = true;
        this.acknowledgedAt = Instant.now();
        this.status = ReviewStatus.ACKNOWLEDGED;
    }

    // Helper methods
    private void validateIdFormat(String id, String fieldName) {
        if (id == null || !id.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            throw new IllegalArgumentException(fieldName + " has invalid format");
        }
    }

    private String sanitizeText(String text, int maxLength) {
        if (text == null) return null;
        String trimmed = text.trim();
        if (trimmed.length() > maxLength) {
            throw new IllegalArgumentException("Text exceeds maximum length of " + maxLength);
        }
        // Remove control characters except newlines
        return trimmed.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
    }

    // Getters
    public String getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public String getReviewerId() { return reviewerId; }
    public LocalDate getReviewPeriodStart() { return reviewPeriodStart; }
    public LocalDate getReviewPeriodEnd() { return reviewPeriodEnd; }
    public ReviewStatus getStatus() { return status; }
    public Integer getOverallRating() { return overallRating; }
    public String getStrengths() { return strengths; }
    public String getAreasForImprovement() { return areasForImprovement; }
    public String getGoals() { return goals; }
    public String getReviewerComments() { return reviewerComments; }
    public Boolean getEmployeeAcknowledged() { return employeeAcknowledged; }
    public Instant getAcknowledgedAt() { return acknowledgedAt; }
    public Instant getSubmittedAt() { return submittedAt; }
    public Instant getFinalizedAt() { return finalizedAt; }
}
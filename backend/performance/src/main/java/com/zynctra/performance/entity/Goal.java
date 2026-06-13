package com.zynctra.performance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * Employee Goal Entity
 * 
 * SECURITY:
 * - Goal descriptions sanitized to prevent injection
 * - Progress bounded (0-100)
 * - Tenant isolation via SecureBaseEntity
 */
@Entity
@Table(
    name = "goals",
    schema = "performance_schema",
    indexes = {
        @Index(name = "idx_goals_employee", columnList = "employee_id, tenant_id"),
        @Index(name = "idx_goals_status", columnList = "status, due_date")
    }
)
public class Goal extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    @Column(name = "employee_id", nullable = false, length = 64)
    private String employeeId;

    @NotBlank(message = "Goal title is required")
    @Size(min = 2, max = 200, message = "Title must be 2-200 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()]+$", message = "Title contains invalid characters")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Size(max = 3000, message = "Description cannot exceed 3000 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Description contains invalid characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private GoalStatus status = GoalStatus.ACTIVE;

    @Min(0) @Max(100)
    @Column(name = "progress_percent", nullable = false)
    private Integer progressPercent = 0;

    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "completed_at")
    private java.time.Instant completedAt;

    @Column(name = "weight", precision = 3, scale = 2)
    private Double weight; // 0.0 to 1.0, for weighted goal calculations

    public enum GoalStatus {
        ACTIVE,
        ON_HOLD,
        COMPLETED,
        CANCELLED,
        OVERDUE
    }

    // Factory method
    public static Goal create(String employeeId, String title, String description, 
                               LocalDate dueDate, Double weight, String createdBy) {
        Goal goal = new Goal();
        goal.setEmployeeId(employeeId);
        goal.setTitle(title);
        goal.setDescription(description);
        goal.setDueDate(dueDate);
        goal.setWeight(weight);
        goal.setUpdatedBy(createdBy);
        return goal;
    }

    public void setEmployeeId(String employeeId) {
        validateId(employeeId);
        this.employeeId = employeeId;
    }

    public void setTitle(String title) {
        if (title == null || !title.matches("^[\\p{L}\\p{N}\\s\\-_:,.()]+$")) {
            throw new IllegalArgumentException("Invalid title format");
        }
        if (title.length() > 200) {
            throw new IllegalArgumentException("Title too long");
        }
        this.title = title.trim();
    }

    public void setDescription(String description) {
        this.description = sanitizeText(description, 3000);
    }

    public void setProgressPercent(Integer progress) {
        if (progress == null || progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be 0-100");
        }
        this.progressPercent = progress;
        if (progress == 100 && this.status != GoalStatus.COMPLETED) {
            this.status = GoalStatus.COMPLETED;
            this.completedAt = java.time.Instant.now();
        }
    }

    public void setDueDate(LocalDate dueDate) {
        if (dueDate == null) throw new IllegalArgumentException("Due date required");
        if (dueDate.isBefore(LocalDate.now().minusYears(1))) {
            throw new IllegalArgumentException("Due date too far in past");
        }
        if (dueDate.isAfter(LocalDate.now().plusYears(5))) {
            throw new IllegalArgumentException("Due date too far in future");
        }
        this.dueDate = dueDate;
    }

    public void setWeight(Double weight) {
        if (weight != null && (weight < 0.0 || weight > 1.0)) {
            throw new IllegalArgumentException("Weight must be 0.0 to 1.0");
        }
        this.weight = weight;
    }

    public void updateStatus(GoalStatus newStatus) {
        if (this.status == GoalStatus.COMPLETED && newStatus != GoalStatus.COMPLETED) {
            throw new IllegalStateException("Completed goals cannot be reopened");
        }
        this.status = newStatus;
        if (newStatus == GoalStatus.COMPLETED) {
            this.completedAt = java.time.Instant.now();
            this.progressPercent = 100;
        }
    }

    // Helpers
    private void validateId(String id) {
        if (id == null || !id.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            throw new IllegalArgumentException("Invalid ID format");
        }
    }

    private String sanitizeText(String text, int maxLen) {
        if (text == null) return null;
        String t = text.trim();
        if (t.length() > maxLen) throw new IllegalArgumentException("Text too long");
        return t.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
    }

    // Getters
    public String getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public GoalStatus getStatus() { return status; }
    public Integer getProgressPercent() { return progressPercent; }
    public LocalDate getDueDate() { return dueDate; }
    public java.time.Instant getCompletedAt() { return completedAt; }
    public Double getWeight() { return weight; }
}
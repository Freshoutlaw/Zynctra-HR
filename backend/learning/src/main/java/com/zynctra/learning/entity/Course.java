package com.zynctra.learning.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Course entity for the Learning Management System (LMS).
 * Extends SecureBaseEntity for multi-tenant isolation, audit fields, and optimistic locking.
 * 
 * SECURITY NOTES:
 * - All string fields have strict length limits to prevent DB bloat and DoS
 * - Enum is STRING-mapped to prevent ordinal manipulation attacks
 * - No @Lob or large unbounded text fields without validation
 * - tenant_id inherited from SecureBaseEntity enforces row-level isolation
 */
@Entity
@Table(
    name = "courses", 
    schema = "learning_schema",
    indexes = {
        @Index(name = "idx_courses_tenant_active", columnList = "tenant_id, active"),
        @Index(name = "idx_courses_category", columnList = "category"),
        @Index(name = "idx_courses_difficulty", columnList = "difficulty")
    }
)
public class Course extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank(message = "Course title is required")
    @Size(min = 2, max = 256, message = "Title must be between 2 and 256 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()]+$", message = "Title contains invalid characters")
    @Column(name = "title", nullable = false, length = 256)
    private String title;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?\\[\\]{}@#$%&*\\n\\r]*$", message = "Description contains potentially dangerous characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Difficulty level is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 16)
    private Difficulty difficulty = Difficulty.BEGINNER;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 10080, message = "Duration cannot exceed 1 week (10080 minutes)")
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @NotBlank(message = "Category is required")
    @Size(min = 1, max = 64, message = "Category must be between 1 and 64 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_]+$", message = "Category contains invalid characters")
    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @NotNull
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @NotNull
    @Column(name = "requires_certification", nullable = false)
    private Boolean requiresCertification = false;

    /**
     * Difficulty levels for courses.
     * STRING enum mapping prevents ordinal-based injection attacks.
     */
    public enum Difficulty {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }

    // ==================== SECURITY-HARDENED CONSTRUCTORS ====================

    protected Course() {
        // JPA protected no-arg constructor
    }

    public static Course create(String title, String description, Difficulty difficulty, 
                                 Integer durationMinutes, String category, String createdBy) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setDifficulty(difficulty);
        course.setDurationMinutes(durationMinutes);
        course.setCategory(category);
        course.setUpdatedBy(createdBy);
        return course;
    }

    // ==================== GETTERS & SETTERS WITH VALIDATION ====================

    public String getId() { return id; }

    public String getTitle() { return title; }

    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        if (title.length() > 256) {
            throw new IllegalArgumentException("Title exceeds maximum length of 256");
        }
        this.title = title.trim();
    }

    public String getDescription() { return description; }

    public void setDescription(String description) {
        if (description != null && description.length() > 5000) {
            throw new IllegalArgumentException("Description exceeds maximum length of 5000");
        }
        this.description = description != null ? description.trim() : null;
    }

    public Difficulty getDifficulty() { return difficulty; }

    public void setDifficulty(Difficulty difficulty) {
        if (difficulty == null) {
            throw new IllegalArgumentException("Difficulty cannot be null");
        }
        this.difficulty = difficulty;
    }

    public Integer getDurationMinutes() { return durationMinutes; }

    public void setDurationMinutes(Integer durationMinutes) {
        if (durationMinutes == null || durationMinutes < 1 || durationMinutes > 10080) {
            throw new IllegalArgumentException("Duration must be between 1 and 10080 minutes");
        }
        this.durationMinutes = durationMinutes;
    }

    public String getCategory() { return category; }

    public void setCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        if (category.length() > 64) {
            throw new IllegalArgumentException("Category exceeds maximum length of 64");
        }
        this.category = category.trim();
    }

    public Boolean getActive() { return active; }

    public void setActive(Boolean active) {
        this.active = active != null ? active : true;
    }

    public Boolean getRequiresCertification() { return requiresCertification; }

    public void setRequiresCertification(Boolean requiresCertification) {
        this.requiresCertification = requiresCertification != null ? requiresCertification : false;
    }

    // ==================== SECURITY METHODS ====================

    /**
     * Soft-delete this course. Inherited deleted flag from SecureBaseEntity.
     */
    public void deactivate(String updatedBy) {
        this.setActive(false);
        this.setDeleted(true);
        this.setUpdatedBy(updatedBy);
    }

    /**
     * Sanitize title for display in logs/exports to prevent log injection.
     */
    public String getSanitizedTitle() {
        if (this.title == null) return "";
        return this.title
            .replaceAll("[\\r\\n]", " ")
            .replaceAll("[\\x00-\\x1F\\x7F]", "");
    }

    @Override
    public String toString() {
        return "Course{" +
            "id='" + (id != null ? id.substring(0, Math.min(8, id.length())) + "..." : "null") + '\'' +
            ", title='" + getSanitizedTitle() + '\'' +
            ", difficulty=" + difficulty +
            ", category='" + category + '\'' +
            ", active=" + active +
            ", tenantId='" + getTenantId() + '\'' +
            '}';
    }
}
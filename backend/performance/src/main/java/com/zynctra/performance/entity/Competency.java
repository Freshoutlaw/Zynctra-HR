package com.zynctra.performance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Competency Framework Entity
 * 
 * Defines skills/competencies that can be rated in performance reviews.
 * SECURITY: Tenant-isolated, admin-managed only.
 */
@Entity
@Table(
    name = "competencies",
    schema = "performance_schema",
    indexes = {
        @Index(name = "idx_competencies_tenant", columnList = "tenant_id, active")
    }
)
public class Competency extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()]+$")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 1000)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 32)
    private CompetencyCategory category;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public enum CompetencyCategory {
        TECHNICAL,
        BEHAVIORAL,
        LEADERSHIP,
        BUSINESS_ACUMEN,
        COMMUNICATION,
        PROBLEM_SOLVING
    }

    // Factory
    public static Competency create(String name, String description, 
                                     CompetencyCategory category, String createdBy) {
        Competency c = new Competency();
        c.setName(name);
        c.setDescription(description);
        c.setCategory(category);
        c.setUpdatedBy(createdBy);
        return c;
    }

    public void setName(String name) {
        if (name == null || !name.matches("^[\\p{L}\\p{N}\\s\\-_:,.()]+$")) {
            throw new IllegalArgumentException("Invalid competency name");
        }
        this.name = name.trim();
    }

    public void setDescription(String desc) {
        if (desc != null) {
            String t = desc.trim();
            if (t.length() > 1000) throw new IllegalArgumentException("Description too long");
            this.description = t.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
        }
    }

    public void setCategory(CompetencyCategory category) {
        if (category == null) throw new IllegalArgumentException("Category required");
        this.category = category;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public CompetencyCategory getCategory() { return category; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active != null ? active : true; }
}
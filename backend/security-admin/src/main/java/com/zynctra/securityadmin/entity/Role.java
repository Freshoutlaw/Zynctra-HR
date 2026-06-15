package com.zynctra.securityadmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Role Entity — Security-hardened with hierarchy validation.
 * 
 * SECURITY:
 * - Role name is ENUM-like (restricted values) but stored as STRING for extensibility
 * - Level enforces hierarchy (lower number = higher privilege)
 * - Protected flag prevents deletion of system-critical roles
 * - No circular hierarchy possible (level is numeric, not relational)
 */
@Entity
@Table(
    name = "roles",
    schema = "securityadmin_schema",
    indexes = {
        @Index(name = "idx_roles_name_tenant", columnList = "name, tenant_id", unique = true),
        @Index(name = "idx_roles_level", columnList = "level")
    }
)
public class Role extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank(message = "Role name is required")
    @Size(min = 2, max = 64, message = "Role name must be 2-64 characters")
    @Pattern(regexp = "^[A-Z][A-Z_0-9]*$", message = "Role name must be UPPER_SNAKE_CASE starting with uppercase")
    @Column(name = "name", nullable = false, length = 64)
    private String name;

    @Size(max = 256)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "description", length = 256)
    private String description;

    @NotNull
    @Min(1) @Max(10)
    @Column(name = "level", nullable = false)
    private Integer level;

    @Column(name = "protected", nullable = false)
    private Boolean isProtected = false;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissions",
        schema = "securityadmin_schema",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<<Permission> permissions = new HashSet<>();

    public static Role create(String name, String description, int level, boolean isProtected, String createdBy) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        role.setLevel(level);
        role.setIsProtected(isProtected);
        role.setUpdatedBy(createdBy);
        return role;
    }

    public void setName(String name) {
        if (name == null || !name.matches("^[A-Z][A-Z_0-9]*$")) {
            throw new IllegalArgumentException("Role name must be UPPER_SNAKE_CASE");
        }
        if (name.length() > 64) {
            throw new IllegalArgumentException("Role name too long");
        }
        // Block dangerous role names
        if (name.contains("ADMIN") && !name.matches("^(SUPER_ADMIN|SECURITY_ADMIN|HR_ADMIN|TIME_ADMIN|PERFORMANCE_ADMIN)$")) {
            throw new IllegalArgumentException("Invalid admin role name pattern");
        }
        this.name = name;
    }

    public void setLevel(Integer level) {
        if (level == null || level < 1 || level > 10) {
            throw new IllegalArgumentException("Role level must be 1-10");
        }
        this.level = level;
    }

    public void setIsProtected(Boolean isProtected) {
        this.isProtected = isProtected != null ? isProtected : false;
    }

    public void addPermission(Permission permission) {
        if (permission == null) throw new IllegalArgumentException("Permission cannot be null");
        this.permissions.add(permission);
    }

    public void removePermission(Permission permission) {
        this.permissions.remove(permission);
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getLevel() { return level; }
    public Boolean getIsProtected() { return isProtected; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Set<<Permission> getPermissions() { return permissions; }
}
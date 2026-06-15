package com.zynctra.securityadmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Permission Entity — Granular access control.
 * 
 * SECURITY:
 * - Scope restricts permission to specific modules/resources
 * - Action is ENUM (READ, WRITE, DELETE, EXECUTE, ADMIN)
 * - Resource pattern prevents wildcard abuse
 */
@Entity
@Table(
    name = "permissions",
    schema = "securityadmin_schema",
    indexes = {
        @Index(name = "idx_permissions_scope_action", columnList = "scope, action, resource", unique = true)
    }
)
public class Permission extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Size(min = 2, max = 64)
    @Pattern(regexp = "^[A-Z][A-Z_0-9]*$")
    @Column(name = "name", nullable = false, length = 64)
    private String name;

    @Size(max = 256)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "description", length = 256)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 16)
    private PermissionAction action;

    @NotBlank
    @Size(max = 128)
    @Pattern(regexp = "^[a-z][a-z0-9_/.]*$")
    @Column(name = "resource", nullable = false, length = 128)
    private String resource;

    @NotBlank
    @Size(max = 32)
    @Pattern(regexp = "^[a-z][a-z0-9_]*$")
    @Column(name = "scope", nullable = false, length = 32)
    private String scope;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public enum PermissionAction {
        READ,      // View data
        WRITE,     // Create/modify data
        DELETE,    // Soft delete
        EXECUTE,   // Run operations (reports, exports)
        ADMIN      // Full control including hard delete, policy changes
    }

    public static Permission create(String name, String description, PermissionAction action,
                                     String resource, String scope, String createdBy) {
        Permission perm = new Permission();
        perm.setName(name);
        perm.setDescription(description);
        perm.setAction(action);
        perm.setResource(resource);
        perm.setScope(scope);
        perm.setUpdatedBy(createdBy);
        return perm;
    }

    public void setName(String name) {
        if (name == null || !name.matches("^[A-Z][A-Z_0-9]*$")) {
            throw new IllegalArgumentException("Permission name must be UPPER_SNAKE_CASE");
        }
        this.name = name;
    }

    public void setAction(PermissionAction action) {
        if (action == null) throw new IllegalArgumentException("Action required");
        this.action = action;
    }

    public void setResource(String resource) {
        if (resource == null || !resource.matches("^[a-z][a-z0-9_/.]*$")) {
            throw new IllegalArgumentException("Invalid resource pattern");
        }
        this.resource = resource;
    }

    public void setScope(String scope) {
        if (scope == null || !scope.matches("^[a-z][a-z0-9_]*$")) {
            throw new IllegalArgumentException("Invalid scope");
        }
        this.scope = scope;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public PermissionAction getAction() { return action; }
    public String getResource() { return resource; }
    public String getScope() { return scope; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
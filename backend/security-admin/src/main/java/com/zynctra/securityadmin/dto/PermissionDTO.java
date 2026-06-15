package com.zynctra.securityadmin.dto;

import com.zynctra.securityadmin.entity.Permission;
import jakarta.validation.constraints.*;

public class PermissionDTO {

    private String id;

    @NotBlank
    @Size(min = 2, max = 64)
    @Pattern(regexp = "^[A-Z][A-Z_0-9]*$")
    private String name;

    @Size(max = 256)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String description;

    @NotNull
    private Permission.PermissionAction action;

    @NotBlank
    @Size(max = 128)
    @Pattern(regexp = "^[a-z][a-z0-9_/.]*$")
    private String resource;

    @NotBlank
    @Size(max = 32)
    @Pattern(regexp = "^[a-z][a-z0-9_]*$")
    private String scope;

    private Boolean active = true;

    // Getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Permission.PermissionAction getAction() { return action; }
    public void setAction(Permission.PermissionAction action) { this.action = action; }
    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }
    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
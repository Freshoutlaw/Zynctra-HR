package com.zynctra.securityadmin.dto;

import jakarta.validation.constraints.*;

public class RoleDTO {

    private String id;

    @NotBlank(message = "Role name is required")
    @Size(min = 2, max = 64, message = "Role name must be 2-64 characters")
    @Pattern(regexp = "^[A-Z][A-Z_0-9]*$", message = "Role name must be UPPER_SNAKE_CASE")
    private String name;

    @Size(max = 256)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String description;

    @NotNull(message = "Role level is required")
    @Min(1) @Max(10)
    private Integer level;

    private Boolean isProtected = false;
    private Boolean active = true;

    // Getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public Boolean getIsProtected() { return isProtected; }
    public void setIsProtected(Boolean isProtected) { this.isProtected = isProtected; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
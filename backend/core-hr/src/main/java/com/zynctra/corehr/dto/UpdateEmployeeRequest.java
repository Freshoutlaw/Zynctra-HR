package com.zynctra.corehr.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Update DTO with WHITELISTED fields only.
 * Prevents mass assignment of sensitive fields like salary, accessLevel, tenantId.
 */
public class UpdateEmployeeRequest {

    @Size(max = 64)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$")
    private String firstName;

    @Size(max = 64)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$")
    private String lastName;

    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(\\)]{10,20}$")
    @Size(max = 32)
    private String phone;

    @Size(max = 128)
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-/&]+$")
    private String jobTitle;

    @Size(max = 64)
    @Pattern(regexp = "^[a-zA-Z0-9-]+$")
    private String departmentId;

    // NO salary
    // NO accessLevel
    // NO employmentStatus (requires separate HR endpoint)
    // NO managerId (requires separate transfer endpoint)
    // NO dateOfBirth (immutable after creation)
    // NO email (immutable after creation — contact IT to change)

    // Getters and setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; }
    public void setLastName(String v) { this.lastName = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String v) { this.jobTitle = v; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String v) { this.departmentId = v; }
}
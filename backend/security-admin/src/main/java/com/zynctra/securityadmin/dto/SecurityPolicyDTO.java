package com.zynctra.securityadmin.dto;

import com.zynctra.securityadmin.entity.SecurityPolicy;
import jakarta.validation.constraints.*;

public class SecurityPolicyDTO {
    private String id;

    @NotBlank(message = "Policy name is required")
    @Size(min = 2, max = 64, message = "Policy name must be between 2 and 64 characters")
    @Pattern(regexp = "^[a-z][a-z0-9_]*$", message = "Policy name must start with lowercase letter, contain only lowercase letters, numbers, and underscores")
    private String policyName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$", message = "Description contains invalid characters")
    private String description;

    @NotBlank(message = "Policy value is required")
    @Size(max = 4000, message = "Policy value cannot exceed 4000 characters")
    private String policyValue;

    @NotNull(message = "Policy type is required")
    private SecurityPolicy.PolicyType policyType;

    @NotNull(message = "Requires approval flag is required")
    private Boolean requiresApproval = false;

    // Getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPolicyName() { return policyName; }
    public void setPolicyName(String policyName) { this.policyName = policyName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPolicyValue() { return policyValue; }
    public void setPolicyValue(String policyValue) { this.policyValue = policyValue; }
    public SecurityPolicy.PolicyType getPolicyType() { return policyType; }
    public void setPolicyType(SecurityPolicy.PolicyType policyType) { this.policyType = policyType; }
    public Boolean getRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(Boolean requiresApproval) { this.requiresApproval = requiresApproval; }
}
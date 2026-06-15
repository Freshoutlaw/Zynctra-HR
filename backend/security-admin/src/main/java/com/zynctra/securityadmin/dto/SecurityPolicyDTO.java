package com.zynctra.securityadmin.dto;

import com.zynctra.securityadmin.entity.SecurityPolicy;
import jakarta.validation.constraints.*;

public class SecurityPolicyDTO {

    private String id;

    @NotBlank
    @Size(min = 2, max = 64)
    @Pattern(regexp = "^[a-z][a-z0-9_]*$")
    private String policyName;

    @Size(max = 500)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String description;

    @NotBlank
    @Size(max = 4000)
    private String policyValue;

    @NotNull
    private SecurityPolicy.PolicyType policyType;

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
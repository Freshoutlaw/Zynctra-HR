package com.zynctra.securityadmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Security Policy Entity — System-wide security configuration.
 * 
 * SECURITY:
 * - Policies are versioned and immutable once active
 * - Only SUPER_ADMIN can modify
 * - Changes require approval and audit logging
 */
@Entity
@Table(
    name = "security_policies",
    schema = "securityadmin_schema",
    indexes = {
        @Index(name = "idx_policies_name", columnList = "policy_name, tenant_id", unique = true)
    }
)
public class SecurityPolicy extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Size(min = 2, max = 64)
    @Pattern(regexp = "^[a-z][a-z0-9_]*$")
    @Column(name = "policy_name", nullable = false, length = 64)
    private String policyName;

    @Size(max = 500)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    @Column(name = "description", length = 500)
    private String description;

    @NotBlank
    @Size(max = 4000)
    @Column(name = "policy_value", nullable = false, columnDefinition = "TEXT")
    private String policyValue;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "policy_type", nullable = false, length = 16)
    private PolicyType policyType;

    @Column(name = "version", nullable = false)
    @Min(1)
    private Integer version = 1;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "requires_approval", nullable = false)
    private Boolean requiresApproval = false;

    @Column(name = "approved_by", length = 64)
    private String approvedBy;

    public enum PolicyType {
        PASSWORD_POLICY,      // Password complexity, rotation
        SESSION_POLICY,       // Timeout, concurrent sessions
        MFA_POLICY,           // MFA requirements
        AUDIT_POLICY,         // Audit retention, scope
        RATE_LIMIT_POLICY,    // Rate limiting rules
        IP_RESTRICTION,       // IP whitelist/blacklist
        ENCRYPTION_POLICY     // Data encryption requirements
    }

    public static SecurityPolicy create(String policyName, String description,
                                         String policyValue, PolicyType type,
                                         boolean requiresApproval, String createdBy) {
        SecurityPolicy policy = new SecurityPolicy();
        policy.setPolicyName(policyName);
        policy.setDescription(description);
        policy.setPolicyValue(policyValue);
        policy.setPolicyType(type);
        policy.setRequiresApproval(requiresApproval);
        policy.setUpdatedBy(createdBy);
        return policy;
    }

    public void setPolicyName(String policyName) {
        if (policyName == null || !policyName.matches("^[a-z][a-z0-9_]*$")) {
            throw new IllegalArgumentException("Invalid policy name format");
        }
        this.policyName = policyName;
    }

    public void setPolicyValue(String policyValue) {
        if (policyValue == null || policyValue.isBlank()) {
            throw new IllegalArgumentException("Policy value required");
        }
        if (policyValue.length() > 4000) {
            throw new IllegalArgumentException("Policy value too long");
        }
        // Validate no dangerous content
        if (policyValue.contains("eval(") || policyValue.contains("exec(") || 
            policyValue.contains("Runtime.getRuntime()") || policyValue.contains("ProcessBuilder")) {
            throw new SecurityException("Policy value contains dangerous code patterns");
        }
        this.policyValue = policyValue;
    }

    public void approve(String approvedByUser) {
        if (this.approvedBy != null) {
            throw new IllegalStateException("Policy already approved");
        }
        this.approvedBy = approvedByUser;
        this.version++;
    }

    // Getters
    public String getId() { return id; }
    public String getPolicyName() { return policyName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPolicyValue() { return policyValue; }
    public PolicyType getPolicyType() { return policyType; }
    public void setPolicyType(PolicyType policyType) { this.policyType = policyType; }
    public Integer getVersion() { return version; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Boolean getRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(Boolean requiresApproval) { this.requiresApproval = requiresApproval; }
    public String getApprovedBy() { return approvedBy; }
}
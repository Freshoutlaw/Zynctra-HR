package com.zynctra.securityadmin.service;

import com.zynctra.securityadmin.entity.SecurityPolicy;
import com.zynctra.securityadmin.exception.SecurityPolicyException;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class SecurityPolicyValidator {
    private static final Pattern PASSWORD_POLICY_PATTERN = Pattern.compile("^\\s*\\{.*\\\"minLength\\\".*\\\"requireSpecialChars\\\".*\\}\\s*$", Pattern.DOTALL);
    private static final Pattern SESSION_POLICY_PATTERN = Pattern.compile("^\\s*\\{.*\\\"timeoutMinutes\\\".*\\\"maxConcurrentSessions\\\".*\\}\\s*$", Pattern.DOTALL);
    private static final Pattern RATE_LIMIT_PATTERN = Pattern.compile("^\\s*\\{.*\\\"requestsPerMinute\\\".*\\\"burstCapacity\\\".*\\}\\s*$", Pattern.DOTALL);
    private static final Pattern IP_RESTRICTION_PATTERN = Pattern.compile("^\\s*(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/\\d{1,2})?\\s*,?\\s*)+$");
    private static final Pattern ENCRYPTION_POLICY_PATTERN = Pattern.compile("^\\s*\\{.*\\\"algorithm\\\".*\\\"keyRotationDays\\\".*\\}\\s*$", Pattern.DOTALL);

    public void validatePolicyValue(String value, SecurityPolicy.PolicyType type) {
        if (value == null || value.isBlank()) throw new SecurityPolicyException("Policy value cannot be empty.");
        switch (type) {
            case PASSWORD_POLICY -> { if (!PASSWORD_POLICY_PATTERN.matcher(value).matches()) throw new SecurityPolicyException("Password policy must be valid JSON containing 'minLength' and 'requireSpecialChars' fields."); }
            case SESSION_POLICY -> { if (!SESSION_POLICY_PATTERN.matcher(value).matches()) throw new SecurityPolicyException("Session policy must be valid JSON containing 'timeoutMinutes' and 'maxConcurrentSessions' fields."); }
            case RATE_LIMIT_POLICY -> { if (!RATE_LIMIT_PATTERN.matcher(value).matches()) throw new SecurityPolicyException("Rate limit policy must be valid JSON containing 'requestsPerMinute' and 'burstCapacity' fields."); }
            case IP_RESTRICTION -> { if (!IP_RESTRICTION_PATTERN.matcher(value).matches()) throw new SecurityPolicyException("IP restriction policy must contain valid IP addresses or CIDR blocks."); }
            case ENCRYPTION_POLICY -> { if (!ENCRYPTION_POLICY_PATTERN.matcher(value).matches()) throw new SecurityPolicyException("Encryption policy must be valid JSON containing 'algorithm' and 'keyRotationDays' fields."); }
            case MFA_POLICY -> { if (!value.matches("(?i)^\\s*(required|optional|disabled)\\s*$") && !value.matches("^\\s*\\{.*\\}\\s*$")) throw new SecurityPolicyException("MFA policy must be 'required', 'optional', 'disabled', or valid JSON configuration."); }
            case AUDIT_POLICY -> { if (!value.matches("^\\s*\\{.*\\\"retentionDays\\\".*\\}\\s*$")) throw new SecurityPolicyException("Audit policy must be valid JSON containing 'retentionDays' field."); }
            default -> {}
        }
    }
}
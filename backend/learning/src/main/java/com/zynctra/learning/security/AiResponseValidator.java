package com.zynctra.learning.security;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class AiResponseValidator {

    private static final List<<Pattern> BLOCKED_PATTERNS = List.of(
        Pattern.compile("(?i)(```\\s*(python|java|js|bash|sh|sql|php|rb))"),
        Pattern.compile("(?i)(sudo\\s+|rm\\s+-rf|exec\\s*\\(|eval\\s*\\()"),
        Pattern.compile("(?i)(api[_-]?key\\s*[:=]\\s*['\"]?[a-zA-Z0-9_-]{20,}['\"]?)"),
        Pattern.compile("(?i)(password\\s*[:=]\\s*['\"]?[^\\s'\"]{8,}['\"]?)"),
        Pattern.compile("(?i)(jdbc:|mongodb://|redis://|postgres://)"),
        Pattern.compile("\\b\\d{3}-\\d{2}-\\d{4}\\b"), // SSN
        Pattern.compile("\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b"), // Credit card
        Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}") // Email (broad match)
    );

    private static final List<<Pattern> PII_PATTERNS = List.of(
        Pattern.compile("\\b\\d{3}-\\d{2}-\\d{4}\\b"),
        Pattern.compile("\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b"),
        Pattern.compile("\\b\\d{3}-\\d{3}-\\d{4}\\b"), // Phone
        Pattern.compile("(?i)(ssn|social security|credit card|bank account|routing number)")
    );

    public boolean isSafe(String response) {
        if (response == null) return true;
        for (Pattern pattern : BLOCKED_PATTERNS) {
            if (pattern.matcher(response).find()) {
                return false;
            }
        }
        return true;
    }

    public boolean containsPiiLeak(String response) {
        if (response == null) return false;
        for (Pattern pattern : PII_PATTERNS) {
            if (pattern.matcher(response).find()) {
                return true;
            }
        }
        return false;
    }

    public String sanitizeResponse(String response) {
        if (response == null) return "";
        String sanitized = response;
        for (Pattern pattern : PII_PATTERNS) {
            sanitized = pattern.matcher(sanitized).replaceAll("[REDACTED]");
        }
        return sanitized;
    }
}
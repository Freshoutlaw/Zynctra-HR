package com.zynctra.ats.validation;

import java.util.regex.Pattern;

import org.owasp.encoder.Encode;
import org.springframework.stereotype.Component;

@Component
public class InputSanitizer {

    private static final Pattern SAFE_TEXT_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s\\-_.',()@:/]+$");
    private static final Pattern CURRENCY_PATTERN = Pattern.compile("^[A-Z]{3}$");
    private static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    private static final int MAX_TEXT_LENGTH = 10000;
    private static final int MAX_HTML_LENGTH = 50000;

    public String sanitizeText(String input, int maxLength) {
        if (input == null) return null;
        String trimmed = input.trim();
        if (trimmed.length() > maxLength) {
            throw new IllegalArgumentException("Input exceeds maximum length of " + maxLength);
        }
        // Remove null bytes and control characters
        String cleaned = trimmed.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
        // Encode for HTML context to prevent stored XSS
        return Encode.forHtml(cleaned);
    }

    public String sanitizeHtml(String input, int maxLength) {
        if (input == null) return null;
        if (input.length() > maxLength) {
            throw new IllegalArgumentException("HTML input exceeds maximum length");
        }
        // Strip script tags and event handlers aggressively
        String cleaned = input
            .replaceAll("(?i)<script[^>]*>.*?</script>", "")
            .replaceAll("(?i)javascript:", "")
            .replaceAll("(?i)on\\w+\\s*=", "")
            .replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
        return cleaned;
    }

    public String sanitizeCurrency(String input) {
        if (input == null) return null;
        if (!CURRENCY_PATTERN.matcher(input).matches()) {
            throw new IllegalArgumentException("Invalid currency format");
        }
        return input;
    }

    public String sanitizeEmail(String input) {
        if (input == null) return null;
        String trimmed = input.trim().toLowerCase();
        if (trimmed.length() > 254) {
            throw new IllegalFreshArgumentException("Email too long");
        }
        return Encode.forHtml(trimmed);
    }

    public boolean isValidUuid(String input) {
        return input != null && UUID_PATTERN.matcher(input).matches();
    }
}
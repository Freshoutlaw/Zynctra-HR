package com.zynctra.benefits.validation;

import java.util.regex.Pattern;

import org.owasp.encoder.Encode;
import org.springframework.stereotype.Component;

import com.zynctra.benefits.exception.InputValidationException;
import com.zynctra.benefits.model.SanitizedQuery;
import com.zynctra.benefits.model.ThreatScanResult;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InputSanitizer {

    private final InputScanner inputScanner;

    private static final Pattern SAFE_NAME_PATTERN = Pattern.compile("^[a-zA-Z\\s\\-'.]+$");
    private static final Pattern SAFE_ALPHANUM_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s\\-_.',&()@:/]+$");
    private static final Pattern CURRENCY_PATTERN = Pattern.compile("^[A-Z]{3}$");
    private static final Pattern UUID_PATTERN = Pattern.compile(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[\\d\\s\\-+()]{7,20}$");

    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_EMAIL_LENGTH = 254;
    public static final int MAX_TEXT_LENGTH = 10_000;
    public static final int MAX_HTML_LENGTH = 50_000;
    public static final int MAX_SEARCH_LENGTH = 200;

    public String sanitizeName(String input, String fieldName, String tenantId, String userId) {
        return sanitizeWithPattern(input, fieldName, SAFE_NAME_PATTERN, MAX_NAME_LENGTH,
            "Name contains invalid characters", tenantId, userId);
    }

    public String sanitizeText(String input, String fieldName, int maxLength, String tenantId, String userId) {
        if (input == null) return null;
        String trimmed = input.trim();
        if (trimmed.isEmpty()) return null;
        if (trimmed.length() > maxLength) {
            throw InputValidationException.forField(fieldName,
                "Exceeds maximum length of " + maxLength, tenantId, userId);
        }
        String cleaned = trimmed.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
        ThreatScanResult scan = inputScanner.scan(cleaned, "text/" + fieldName);
        if (!scan.isClean()) {
            throw InputValidationException.forField(fieldName,
                "Contains prohibited patterns", tenantId, userId);
        }
        return Encode.forHtml(cleaned);
    }

    public String sanitizeHtml(String input, String fieldName, int maxLength, String tenantId, String userId) {
        if (input == null) return null;
        String trimmed = input.trim();
        if (trimmed.isEmpty()) return null;
        if (trimmed.length() > maxLength) {
            throw InputValidationException.forField(fieldName,
                "Content exceeds maximum length", tenantId, userId);
        }
        String cleaned = trimmed
            .replaceAll("(?i)<script[^>]*>.*?</script>", "")
            .replaceAll("(?i)<iframe[^>]*>.*?</iframe>", "")
            .replaceAll("(?i)javascript:", "")
            .replaceAll("(?i)on\\w+\\s*=", "")
            .replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
        ThreatScanResult scan = inputScanner.scan(cleaned, "html/" + fieldName);
        if (!scan.isClean()) {
            throw InputValidationException.forField(fieldName,
                "Contains prohibited patterns", tenantId, userId);
        }
        return cleaned;
    }

    public String sanitizeCurrency(String input, String fieldName, String tenantId, String userId) {
        if (input == null) return null;
        String trimmed = input.trim().toUpperCase();
        if (!CURRENCY_PATTERN.matcher(trimmed).matches()) {
            throw InputValidationException.forField(fieldName,
                "Currency must be 3-letter ISO code", tenantId, userId);
        }
        return trimmed;
    }

    public SanitizedQuery sanitizeSearchQuery(String input, String fieldName,
                                               String tenantId, String userId) {
        if (input == null || input.trim().isEmpty()) {
            throw InputValidationException.forField(fieldName,
                "Search query cannot be empty", tenantId, userId);
        }
        ThreatScanResult scan = inputScanner.scan(input, "search/" + fieldName);
        if (!scan.isClean()) {
            throw InputValidationException.forField(fieldName,
                "Search query contains prohibited patterns", tenantId, userId);
        }
        return SanitizedQuery.from(input, MAX_SEARCH_LENGTH);
    }

    private String sanitizeWithPattern(String input, String fieldName, Pattern pattern,
                                        int maxLength, String errorMessage,
                                        String tenantId, String userId) {
        if (input == null) return null;
        String trimmed = input.trim();
        if (trimmed.isEmpty()) return null;
        if (trimmed.length() > maxLength) {
            throw InputValidationException.forField(fieldName,
                "Exceeds maximum length", tenantId, userId);
        }
        if (!pattern.matcher(trimmed).matches()) {
            throw InputValidationException.forField(fieldName, errorMessage, tenantId, userId);
        }
        ThreatScanResult scan = inputScanner.scan(trimmed, "name/" + fieldName);
        if (!scan.isClean()) {
            throw InputValidationException.forField(fieldName,
                "Contains prohibited patterns", tenantId, userId);
        }
        return Encode.forHtml(trimmed);
    }
}
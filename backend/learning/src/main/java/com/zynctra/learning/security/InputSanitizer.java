package com.zynctra.learning.security;

import org.springframework.stereotype.Component;

import java.text.Normalizer;

@Component
public class InputSanitizer {

    public String sanitize(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFKC);
        normalized = normalized.replaceAll("[\\p{C}\\p{Zs}&&[^\\s]]", "");
        return normalized.trim();
    }

    public String sanitizeForDisplay(String input) {
        if (input == null) return "";
        String sanitized = sanitize(input);
        return org.owasp.encoder.Encode.forHtml(sanitized);
    }

    public String truncate(String input, int maxLength) {
        if (input == null) return "";
        return input.length() > maxLength ? input.substring(0, maxLength) + "...[truncated]" : input;
    }
}
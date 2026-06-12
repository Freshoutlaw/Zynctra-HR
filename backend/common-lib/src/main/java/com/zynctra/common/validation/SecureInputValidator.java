package com.zynctra.common.validation;

import java.util.List;
import java.util.regex.Pattern;

import org.owasp.encoder.Encode;
import org.slf4j.LoggerFactory;

public final class SecureInputValidator {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    // Allow-list patterns
    private static final Pattern SAFE_ALPHANUMERIC = Pattern.compile("^[a-zA-Z0-9_-]+$");
    private static final Pattern SAFE_EMAIL = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    private static final Pattern SAFE_UUID = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    
    // Block-list: dangerous SQL/JPQL/Command patterns
    private static final List<Pattern> DANGEROUS_PATTERNS = List.of(
        Pattern.compile("(?i)(--|;|--|/\\*|\\*/|xp_|sp_|union\\s+select|insert\\s+into|delete\\s+from|drop\\s+table|exec\\s*\\(|eval\\s*\\(|system\\s*\\()"),
        Pattern.compile("(?i)(<script|javascript:|on\\w+\\s*=|data:text/html)"),
        Pattern.compile("(?i)(\\.\\./|/etc/passwd|/proc/self|cmd\\.exe|powershell)"),
        Pattern.compile("(?i)(\\$\\{|#\\{|<%|=\\s*\\{|\\{\\{|\\[%)"), // Template injection
        Pattern.compile("(?i)(ignore\\s+previous|ignore\\s+above|new\\s+instructions|system\\s+override|jailbreak|DAN\\s+mode)")
    );
    
    // Size limits
    public static final int MAX_STRING_LENGTH = 4096;
    public static final int MAX_COLLECTION_SIZE = 1000;
    public static final int MAX_JSON_DEPTH = 10;

    private SecureInputValidator() {}

    public static String sanitizeAlphanumeric(String input) {
        if (input == null) return null;
        if (input.length() > MAX_STRING_LENGTH) {
            throw new SecurityException("Input exceeds maximum length");
        }
        if (!SAFE_ALPHANUMERIC.matcher(input).matches()) {
            SEC_LOG.warn("SECURITY_EVENT: invalid_alphanumeric_input input_prefix={}", 
                truncateForLog(input));
            throw new SecurityException("Invalid alphanumeric format");
        }
        return input;
    }

    public static String sanitizeEmail(String input) {
        if (input == null) return null;
        if (input.length() > 254) {
            throw new SecurityException("Email exceeds maximum length");
        }
        if (!SAFE_EMAIL.matcher(input).matches()) {
            throw new SecurityException("Invalid email format");
        }
        return input.toLowerCase().trim();
    }

    public static String sanitizeGeneralText(String input) {
        if (input == null) return null;
        if (input.length() > MAX_STRING_LENGTH) {
            throw new SecurityException("Input exceeds maximum length");
        }
        
        // Scan for dangerous patterns
        for (Pattern pattern : DANGEROUS_PATTERNS) {
            if (pattern.matcher(input).find()) {
                SEC_LOG.warn("SECURITY_EVENT: dangerous_pattern_detected pattern_type={} input_prefix={}",
                    pattern.toString().substring(0, 30), truncateForLog(input));
                throw new SecurityException("Dangerous content detected in input");
            }
        }
        
        // HTML encode for safe output
        return Encode.forHtml(input);
    }

    public static void validateCollectionSize(java.util.Collection<?> collection) {
        if (collection != null && collection.size() > MAX_COLLECTION_SIZE) {
            throw new SecurityException("Collection size exceeds maximum allowed");
        }
    }

    public static void validateJsonDepth(String json, int maxDepth) {
        int depth = 0;
        int max = 0;
        boolean inString = false;
        boolean escape = false;
        
        for (char c : json.toCharArray()) {
            if (escape) {
                escape = false;
                continue;
            }
            if (c == '\\') {
                escape = true;
                continue;
            }
            if (c == '"') {
                inString = !inString;
                continue;
            }
            if (!inString) {
                if (c == '{' || c == '[') {
                    depth++;
                    max = Math.max(max, depth);
                } else if (c == '}' || c == ']') {
                    depth--;
                }
            }
        }
        
        if (max > maxDepth) {
            throw new SecurityException("JSON nesting depth exceeds maximum allowed");
        }
    }

    private static String truncateForLog(String input) {
        if (input.length() <= 100) return input;
        return input.substring(0, 100) + "...[truncated]";
    }
}
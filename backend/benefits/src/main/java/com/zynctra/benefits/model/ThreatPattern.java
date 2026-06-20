package com.zynctra.benefits.model;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Enumeration of known threat patterns with associated severity levels and regex detection patterns.
 */
public enum ThreatPattern {

    SQL_INJECTION(
            ThreatSeverity.CRITICAL,
            "(?i)(\\b(union|select|insert|update|delete|drop|alter|create|truncate|exec|execute|--|;.*\\b)(\\s|\\()|'.*\\b(or|and)\\b.*'.*\\b(=|like|in)\\b|\\b(1\\s*=\\s*1|'\\s*or\\s*'1'\\s*=\\s*'1))"
    ),
    XSS(
            ThreatSeverity.HIGH,
            "(?i)(<script[^>]*>.*?</script>|javascript\\s*:|onload\\s*=|onerror\\s*=|onclick\\s*=|onmouseover\\s*=|alert\\s*\\(|document\\.cookie|eval\\s*\\(|fromCharCode)"
    ),
    COMMAND_INJECTION(
            ThreatSeverity.CRITICAL,
            "(?i)([;&|]\\s*(cmd|powershell|sh|bash|perl|python|ruby|wget|curl|nc|netcat|rm\\s+-rf|mkfifo|/etc/passwd|/bin/sh))"
    ),
    PATH_TRAVERSAL(
            ThreatSeverity.HIGH,
            "(\\.\\./|\\.\\.\\\\)"
    ),
    LDAP_INJECTION(
            ThreatSeverity.HIGH,
            "[()&|!*=<>]"
    ),
    XPATH_INJECTION(
            ThreatSeverity.HIGH,
            "(\\b(or|and)\\b.*\\b(text\\(\\)|@\\w+|\\*\\s*\\[|\\]\\s*/\\s*\\*)"
    ),
    NO_SQL_INJECTION(
            ThreatSeverity.HIGH,
            "(\\$ne|\\$gt|\\$lt|\\$gte|\\$lte|\\$regex|\\$nin|\\$where|\\$exists)"
    ),
    TEMPLATE_INJECTION(
            ThreatSeverity.HIGH,
            "(\\{\\{.*\\}\\}|\\$\\{.*\\}|\\%\\{.*\\}|<#.*#>|\\$\\$\\{)"
    ),
    SSRF(
            ThreatSeverity.MEDIUM,
            "(?i)(http[s]?://(127\\.0\\.0\\.1|0\\.0\\.0\\.0|localhost|169\\.254\\.169\\.254|[0]{1,3}\\.[0]{1,3}\\.[0]{1,3}\\.[0]{1,3}|10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|172\\.(1[6-9]|2\\d|3[01])\\.\\d{1,3}\\.\\d{1,3}|192\\.168\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}))"
    ),
    OPEN_REDIRECT(
            ThreatSeverity.MEDIUM,
            "(?i)(^//[^/]|^(https?:)?//[^/]*[.](?!(example\\.com|trusted-domain\\.com))(?!.*//))"
    );

    private final ThreatSeverity defaultSeverity;
    private final Pattern regexPattern;

    ThreatPattern(ThreatSeverity defaultSeverity, String regex) {
        this.defaultSeverity = defaultSeverity;
        this.regexPattern = Pattern.compile(regex, Pattern.DOTALL);
    }

    public ThreatSeverity getDefaultSeverity() {
        return defaultSeverity;
    }

    public Pattern getRegexPattern() {
        return regexPattern;
    }

    /**
     * Checks whether the given input matches this threat pattern.
     *
     * @param input the input string to test
     * @return true if a match is found, false otherwise
     */
    public boolean matches(String input) {
        if (input == null || input.isEmpty()) {
            return false;
        }
        return regexPattern.matcher(input).find();
    }

    /**
     * Returns a preview (first 120 chars) of the matched portion of the input.
     *
     * @param input the input string to scan
     * @return a preview string, or empty string if no match
     */
    public String getMatchPreview(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        Matcher matcher = regexPattern.matcher(input);
        if (matcher.find()) {
            String match = matcher.group();
            if (match.length() > 120) {
                match = match.substring(0, 120) + "...";
            }
            return match;
        }
        return "";
    }
}
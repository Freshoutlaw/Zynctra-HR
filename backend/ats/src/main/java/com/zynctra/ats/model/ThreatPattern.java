package com.zynctra.ats.model;

import lombok.Getter;

import java.util.regex.Pattern;

/**
 * Central registry of threat detection patterns for input scanning.
 *
 * <p>Each pattern is compiled once at class load time for performance.
 * Patterns are organized by attack category and assigned severity levels.</p>
 */
@Getter
public enum ThreatPattern {

    PROMPT_IGNORE_INSTRUCTIONS(
        "PROMPT_INJECTION",
        "(?i)ignore\s+(previous|above|all|the)\s+instructions?",
        ThreatSeverity.HIGH,
        "Attempt to override system instructions"
    ),
    PROMPT_SYSTEM_PROMPT(
        "PROMPT_INJECTION",
        "(?i)system\s*prompt|system\s*instruction|developer\s*mode",
        ThreatSeverity.HIGH,
        "Attempt to access or modify system prompt"
    ),
    PROMPT_ROLEPLAY(
        "PROMPT_INJECTION",
        "(?i)(pretend\s+to\s+be|act\s+as\s+(if\s+you\s+are|a|an)|you\s+are\s+now|from\s+now\s+on\s+you\s+are)",
        ThreatSeverity.MEDIUM,
        "Role-play / persona override attempt"
    ),
    PROMPT_DAN_MODE(
        "PROMPT_INJECTION",
        "(?i)DAN\s+(mode|prompt)|do\s+anything\s+now|jailbreak|ignore\s+previous",
        ThreatSeverity.HIGH,
        "Known jailbreak pattern detected"
    ),
    PROMPT_DELIMITER_MANIPULATION(
        "PROMPT_INJECTION",
        "(?i)(\{\{|\[\[|<<<|###|\*\*\*|---\s*system|\[/\s*(system|user|assistant)\s*\])",
        ThreatSeverity.HIGH,
        "Delimiter manipulation to inject system messages"
    ),
    CMD_EXEC(
        "COMMAND_INJECTION",
        "(?i)(eval\s*\(|exec\s*\(|system\s*\(|subprocess\.|os\.system|Runtime\.getRuntime|ProcessBuilder)",
        ThreatSeverity.CRITICAL,
        "Code execution function detected"
    ),
    CMD_BACKTICK(
        "COMMAND_INJECTION",
        "`[^`]+`",
        ThreatSeverity.HIGH,
        "Backtick command substitution"
    ),
    CMD_DOLLAR_PAREN(
        "COMMAND_INJECTION",
        "\$\([^)]+\)",
        ThreatSeverity.HIGH,
        "Dollar-parenthesis command substitution"
    ),
    CMD_PIPE(
        "COMMAND_INJECTION",
        "(?i)(\||;|&&)\s*(rm|cat|ls|wget|curl|nc|netcat|python|bash|sh|cmd|powershell)",
        ThreatSeverity.CRITICAL,
        "Shell pipeline with dangerous commands"
    ),
    SQLI_UNION(
        "SQL_INJECTION",
        "(?i)\bUNION\s+SELECT\b",
        ThreatSeverity.HIGH,
        "UNION SELECT pattern"
    ),
    SQLI_SLEEP(
        "SQL_INJECTION",
        "(?i)\b(SLEEP|BENCHMARK|PG_SLEEP|WAITFOR\s+DELAY)\s*\(",
        ThreatSeverity.HIGH,
        "Time-based SQL injection"
    ),
    SQLI_COMMENT(
        "SQL_INJECTION",
        "(?i)(--\s|/\*|#\s|;%00)",
        ThreatSeverity.MEDIUM,
        "SQL comment sequence"
    ),
    XSS_SCRIPT_TAG(
        "XSS",
        "(?i)<\s*script\s*[^>]*>",
        ThreatSeverity.HIGH,
        "Script tag injection"
    ),
    XSS_EVENT_HANDLER(
        "XSS",
        "(?i)\s(on\w+)\s*=\s*["']?[^"'> ]+",
        ThreatSeverity.HIGH,
        "HTML event handler injection"
    ),
    XSS_JAVASCRIPT_PROTO(
        "XSS",
        "(?i)javascript:",
        ThreatSeverity.HIGH,
        "JavaScript protocol in URL"
    ),
    XSS_DATA_URI(
        "XSS",
        "(?i)data:text/html",
        ThreatSeverity.MEDIUM,
        "Data URI with HTML content"
    ),
    PATH_TRAVERSAL(
        "PATH_TRAVERSAL",
        "\.\./|\.\\/|\.%2[fF]|\.%5[cC]",
        ThreatSeverity.HIGH,
        "Path traversal sequence"
    ),
    PATH_NULL_BYTE(
        "PATH_TRAVERSAL",
        "\x00",
        ThreatSeverity.HIGH,
        "Null byte in path"
    ),
    SECRET_API_KEY(
        "SECRET_LEAKAGE",
        "(?i)(api[_-]?key|apikey)\s*[:=]\s*["']?[a-zA-Z0-9_-]{20,}["']?",
        ThreatSeverity.CRITICAL,
        "Potential API key in input"
    ),
    SECRET_PASSWORD(
        "SECRET_LEAKAGE",
        "(?i)(password|passwd|pwd|secret)\s*[:=]\s*["']?[^\s"']{8,}["']?",
        ThreatSeverity.CRITICAL,
        "Potential password in input"
    ),
    SECRET_JWT(
        "SECRET_LEAKAGE",
        "eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*",
        ThreatSeverity.CRITICAL,
        "JWT token detected in input"
    ),
    OBFUSCATED_UNICODE(
        "OBFUSCATION",
        "[\u200B-\u200F\uFEFF\u2060-\u206F]",
        ThreatSeverity.MEDIUM,
        "Zero-width / invisible Unicode characters"
    ),
    OBFUSCATED_ENCODING(
        "OBFUSCATION",
        "(?i)(base64|hex|urlencode|\%[0-9a-f]{2})",
        ThreatSeverity.LOW,
        "Encoding obfuscation attempt"
    ),
    EXCESSIVE_REPETITION(
        "OBFUSCATION",
        "(.)\1{50,}",
        ThreatSeverity.LOW,
        "Excessive character repetition (ReDoS / DoS)"
    );

    private final String category;
    private final Pattern pattern;
    private final ThreatSeverity defaultSeverity;
    private final String description;

    ThreatPattern(String category, String regex, ThreatSeverity severity, String description) {
        this.category = category;
        this.pattern = Pattern.compile(regex);
        this.defaultSeverity = severity;
        this.description = description;
    }

    public boolean matches(String input) {
        return pattern.matcher(input).find();
    }

    public String getMatchPreview(String input) {
        var matcher = pattern.matcher(input);
        if (matcher.find()) {
            String match = matcher.group();
            return match.length() > 100 ? match.substring(0, 100) + "..." : match;
        }
        return null;
    }
}

package com.zynctra.ats.model;

import lombok.Builder;
import lombok.Getter;

import java.util.Collections;
import java.util.List;

/**
 * Immutable result of an input validation pipeline.
 *
 * <p>Encapsulates whether validation passed, what violations were found,
 * and a sanitized version of the input. Used to enforce the principle:
 * <em>validate first, sanitize second, use third</em>.</p>
 */ 
@Getter
@Builder
public final class InputValidationResult {

    private final boolean valid;
    private final List<Violation> violations;
    private final String sanitizedValue;
    private final String originalFieldName;
    private final ValidationStage failedAtStage;

    public static InputValidationResult success(String sanitizedValue, String fieldName) {
        return InputValidationResult.builder()
            .valid(true)
            .violations(Collections.emptyList())
            .sanitizedValue(sanitizedValue)
            .originalFieldName(fieldName)
            .failedAtStage(null)
            .build();
    }

    public static InputValidationResult failure(List<Violation> violations,
                                                 String fieldName,
                                                 ValidationStage failedAtStage) {
        return InputValidationResult.builder()
            .valid(false)
            .violations(violations)
            .sanitizedValue(null)
            .originalFieldName(fieldName)
            .failedAtStage(failedAtStage)
            .build();
    }

    @Getter
    @Builder
    public static final class Violation {
        private final String rule;
        private final String message;
        private final String detectedPattern;
    }

    public enum ValidationStage {
        LENGTH_CHECK,
        CHARACTER_WHITELIST,
        PATTERN_MATCH,
        HTML_SANITIZATION,
        SECRET_DETECTION,
        NORMALIZATION
    }
}

package com.zynctra.benefits.model;

import lombok.Getter;

import java.util.Objects;

/**
 * Immutable wrapper for a database search query that has been
 * escaped for safe use in JPQL/HQL LIKE clauses.
 */
@Getter
public final class SanitizedQuery {
 
    private static final char ESCAPE_CHAR = '!';
    private final String rawInput;
    private final String escapedForLike;
    private final int originalLength;
    private final boolean wasTruncated;

    private SanitizedQuery(String rawInput, String escapedForLike, boolean wasTruncated) {
        this.rawInput = rawInput;
        this.escapedForLike = escapedForLike;
        this.originalLength = rawInput.length();
        this.wasTruncated = wasTruncated;
    }

    public static SanitizedQuery from(String rawInput, int maxLength) {
        Objects.requireNonNull(rawInput, "Search query cannot be null");

        String trimmed = rawInput.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }
        if (trimmed.length() > maxLength) {
            throw new IllegalArgumentException(
                "Search query exceeds maximum length of " + maxLength + " characters"
            );
        }

        String escaped = trimmed
            .replace(String.valueOf(ESCAPE_CHAR), String.valueOf(ESCAPE_CHAR) + ESCAPE_CHAR)
            .replace("%", String.valueOf(ESCAPE_CHAR) + "%")
            .replace("_", String.valueOf(ESCAPE_CHAR) + "_")
            .replace("[", String.valueOf(ESCAPE_CHAR) + "[");

        return new SanitizedQuery(trimmed, escaped, false);
    }

    public String getEscapedForLike() {
        return escapedForLike;
    }

    public String getRawInput() {
        return rawInput;
    }

    @Override
    public String toString() {
        return String.format("SanitizedQuery{length=%d, escaped=%b}", originalLength, !escapedForLike.equals(rawInput));
    }
}

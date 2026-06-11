package com.zynctra.ats.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

/**
 * Immutable result of a threat scan operation.
 *
 * <p>Produced by {@link com.zynctra.ats.validation.InputScanner}.
 * If {@code clean} is false, the {@code detections} list contains
 * every threat pattern that matched, ordered by severity (critical first).</p>
 */
@Getter
@Builder
public final class ThreatScanResult {

    private final boolean clean;
    private final List<Detection> detections;
    private final Instant scannedAt;
    private final int inputLength;
    private final long scanDurationNanos;

    public static ThreatScanResult clean(int inputLength, long durationNanos) {
        return ThreatScanResult.builder()
            .clean(true)
            .detections(Collections.emptyList())
            .scannedAt(Instant.now())
            .inputLength(inputLength)
            .scanDurationNanos(durationNanos)
            .build();
    }

    public static ThreatScanResult threatsDetected(List<Detection> detections,
                                                    int inputLength,
                                                    long durationNanos) {
        return ThreatScanResult.builder()
            .clean(false)
            .detections(detections)
            .scannedAt(Instant.now())
            .inputLength(inputLength)
            .scanDurationNanos(durationNanos)
            .build();
    }

    public ThreatSeverity getMaxSeverity() {
        return detections.stream()
            .map(Detection::getSeverity)
            .max(java.util.Comparator.naturalOrder())
            .orElse(null);
    }

    public boolean hasCritical() {
        return detections.stream().anyMatch(d -> d.getSeverity() == ThreatSeverity.CRITICAL);
    }

    @Getter
    @Builder
    public static final class Detection {
        private final ThreatPattern pattern;
        private final ThreatSeverity severity;
        private final String matchPreview;
        private final int matchPosition;
    }
}

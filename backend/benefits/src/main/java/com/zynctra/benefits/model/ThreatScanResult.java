package com.zynctra.benefits.model;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

/**
 * Immutable result of a threat scan operation in benefits service.
 */
public final class ThreatScanResult {

    private final boolean clean;
    private final List<Detection> detections;
    private final Instant scannedAt;
    private final int inputLength;
    private final long scanDurationNanos;

    public ThreatScanResult(boolean clean, List<Detection> detections, Instant scannedAt, int inputLength, long scanDurationNanos) {
        this.clean = clean;
        this.detections = detections;
        this.scannedAt = scannedAt;
        this.inputLength = inputLength;
        this.scanDurationNanos = scanDurationNanos;
    }

    public static ThreatScanResult clean(int inputLength, long durationNanos) {
        return new ThreatScanResult(
            true,
            Collections.emptyList(),
            Instant.now(),
            inputLength,
            durationNanos
        );
    }

    public static ThreatScanResult threatsDetected(List<Detection> detections,
                                                    int inputLength,
                                                    long durationNanos) {
        return new ThreatScanResult(
            false,
            detections,
            Instant.now(),
            inputLength,
            durationNanos
        );
    }

    // Getters
    public boolean isClean() {
        return clean;
    }

    public List<Detection> getDetections() {
        return detections;
    }

    public Instant getScannedAt() {
        return scannedAt;
    }

    public int getInputLength() {
        return inputLength;
    }

    public long getScanDurationNanos() {
        return scanDurationNanos;
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

    public static final class Detection {
        private final ThreatPattern pattern;
        private final ThreatSeverity severity;
        private final String matchPreview;
        private final int matchPosition;

        public Detection(ThreatPattern pattern, ThreatSeverity severity, String matchPreview, int matchPosition) {
            this.pattern = pattern;
            this.severity = severity;
            this.matchPreview = matchPreview;
            this.matchPosition = matchPosition;
        }

        // Getters
        public ThreatPattern getPattern() {
            return pattern;
        }

        public ThreatSeverity getSeverity() {
            return severity;
        }

        public String getMatchPreview() {
            return matchPreview;
        }

        public int getMatchPosition() {
            return matchPosition;
        }
    }
}

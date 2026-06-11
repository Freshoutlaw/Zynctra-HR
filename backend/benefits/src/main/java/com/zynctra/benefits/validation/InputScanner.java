package com.zynctra.benefits.validation;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.zynctra.benefits.model.ThreatPattern;
import com.zynctra.benefits.model.ThreatScanResult;
import com.zynctra.benefits.model.ThreatSeverity;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class InputScanner {

    private static final int MAX_INPUT_LENGTH = 50_000;
    private static final int MAX_SCAN_TIME_MS = 100;

    public ThreatScanResult scan(String input, String context) {
        long startNanos = System.nanoTime();

        if (input == null || input.isBlank()) {
            return ThreatScanResult.clean(0, System.nanoTime() - startNanos);
        }

        if (input.length() > MAX_INPUT_LENGTH) {
            log.warn("SECURITY: Input exceeds max length | context={} | length={}", context, input.length());
            return ThreatScanResult.threatsDetected(
                List.of(ThreatScanResult.Detection.builder()
                    .pattern(null)
                    .severity(ThreatSeverity.HIGH)
                    .matchPreview("Input length=" + input.length())
                    .matchPosition(0)
                    .build()),
                input.length(), System.nanoTime() - startNanos
            );
        }

        List<ThreatScanResult.Detection> detections = new ArrayList<>();
        for (ThreatPattern pattern : ThreatPattern.values()) {
            if (pattern.matches(input)) {
                String preview = pattern.getMatchPreview(input);
                detections.add(ThreatScanResult.Detection.builder()
                    .pattern(pattern)
                    .severity(pattern.getDefaultSeverity())
                    .matchPreview(preview != null ? sanitizePreview(preview) : "[hidden]")
                    .matchPosition(0)
                    .build());
            }
        }

        long durationNanos = System.nanoTime() - startNanos;
        long durationMs = durationNanos / 1_000_000;

        if (durationMs > MAX_SCAN_TIME_MS) {
            detections.add(ThreatScanResult.Detection.builder()
                .pattern(null)
                .severity(ThreatSeverity.HIGH)
                .matchPreview("Scan timeout - possible ReDoS")
                .matchPosition(0)
                .build());
        }

        detections.sort(Comparator.comparing(ThreatScanResult.Detection::getSeverity).reversed());

        if (!detections.isEmpty()) {
            log.warn("SECURITY: Threats detected | context={} | count={} | maxSeverity={}",
                context, detections.size(), detections.get(0).getSeverity());
            return ThreatScanResult.threatsDetected(detections, input.length(), durationNanos);
        }

        return ThreatScanResult.clean(input.length(), durationNanos);
    }

    public void scanOrThrow(String input, String context, String tenantId, String userId) {
        ThreatScanResult result = scan(input, context);
        if (!result.isClean()) {
            throw com.zynctra.benefits.exception.SuspiciousActivityException.promptInjection(
                tenantId, userId, result.getDetections().get(0).getPattern().name());
        }
    }

    private String sanitizePreview(String preview) {
        if (preview == null) return "[hidden]";
        String sanitized = preview
            .replaceAll("(?i)[a-zA-Z0-9_-]{20,}", "[REDACTED]")
            .replaceAll("(?i)password\\s*[:=]\\s*\\S+", "password=[REDACTED]")
            .replaceAll("(?i)api[_-]?key\\s*[:=]\\s*\\S+", "api_key=[REDACTED]");
        return sanitized.length() > 100 ? sanitized.substring(0, 100) + "..." : sanitized;
    }
}
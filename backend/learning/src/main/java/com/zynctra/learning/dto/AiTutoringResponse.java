package com.zynctra.learning.dto;

import java.time.Instant;
import java.util.List;

public class AiTutoringResponse {

    private String response;
    private boolean sanitized;
    private Instant timestamp;
    private List<String> warnings;
    private boolean containsPii;

    public AiTutoringResponse() {}

    public AiTutoringResponse(String response, boolean sanitized, Instant timestamp, List<String> warnings, boolean containsPii) {
        this.response = response;
        this.sanitized = sanitized;
        this.timestamp = timestamp;
        this.warnings = warnings;
        this.containsPii = containsPii;
    }

    // Getters and setters
    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public boolean isSanitized() {
        return sanitized;
    }

    public void setSanitized(boolean sanitized) {
        this.sanitized = sanitized;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public boolean isContainsPii() {
        return containsPii;
    }

    public void setContainsPii(boolean containsPii) {
        this.containsPii = containsPii;
    }

    // Static factory methods
    public static AiTutoringResponse blocked(String message, String correlationId) {
        AiTutoringResponse response = new AiTutoringResponse();
        response.setResponse(message);
        response.setSanitized(false);
        response.setTimestamp(java.time.Instant.now());
        response.setWarnings(java.util.Collections.singletonList("BLOCKED"));
        response.setContainsPii(false);
        return response;
    }

    public static AiTutoringResponse quarantined(String message, String correlationId) {
        AiTutoringResponse response = new AiTutoringResponse();
        response.setResponse(message);
        response.setSanitized(false);
        response.setTimestamp(java.time.Instant.now());
        response.setWarnings(java.util.Collections.singletonList("QUARANTINED"));
        response.setContainsPii(false);
        return response;
    }

    public static AiTutoringResponse error(String message, String correlationId) {
        AiTutoringResponse response = new AiTutoringResponse();
        response.setResponse(message);
        response.setSanitized(false);
        response.setTimestamp(java.time.Instant.now());
        response.setWarnings(java.util.Collections.singletonList("ERROR"));
        response.setContainsPii(false);
        return response;
    }

    public static AiTutoringResponse success(String aiResponse, String correlationId, String sessionId) {
        AiTutoringResponse response = new AiTutoringResponse();
        response.setResponse(aiResponse);
        response.setSanitized(true);
        response.setTimestamp(java.time.Instant.now());
        response.setWarnings(java.util.Collections.emptyList());
        response.setContainsPii(false);
        return response;
    }
}

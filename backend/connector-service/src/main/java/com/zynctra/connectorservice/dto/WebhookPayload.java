package com.zynctra.connector.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// CRITICAL: Ignore unknown properties to prevent deserialization attacks
@JsonIgnoreProperties(ignoreUnknown = true)
public class WebhookPayload {
    
    @NotBlank
    @Size(max = 256)
    private String eventType;
    
    @NotBlank
    @Size(max = 64)
    private String eventId;
    
    @NotNull
    private Long timestamp;
    
    @Size(max = 100)
    private Map<String, Object> data;
    
    // Strict validation: no nested objects deeper than 3 levels
    @jakarta.validation.constraints.AssertTrue(message = "Data nesting too deep")
    public boolean isDataDepthValid() {
        if (data == null) return true;
        return checkDepth(data, 0) <= 3;
    }
    
    private int checkDepth(Object obj, int depth) {
        if (depth > 3) return depth;
        if (obj instanceof Map) {
            int max = depth;
            for (Object value : ((Map<?, ?>) obj).values()) {
                max = Math.max(max, checkDepth(value, depth + 1));
            }
            return max;
        }
        if (obj instanceof java.util.List) {
            int max = depth;
            for (Object item : (java.util.List<?>) obj) {
                max = Math.max(max, checkDepth(item, depth + 1));
            }
            return max;
        }
        return depth;
    }
    
    // Getters only - immutable after creation
    public String getEventType() { return eventType; }
    public String getEventId() { return eventId; }
    public Long getTimestamp() { return timestamp; }
    public Map<String, Object> getData() { return data; }
}
package com.zynctra.securityadmin.dto;

import jakarta.validation.constraints.*;

import java.time.Instant;

/**
 * DTO for querying audit logs with strict validation.
 * 
 * SECURITY:
 * - Time range limited to prevent massive queries (DoS)
 * - User ID format validated
 * - Action type restricted to known values
 */
public class AuditQueryDTO {

    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    private String userId;

    @Pattern(regexp = "^[A-Z][A-Z_0-9]*$")
    private String actionType;

    @Pattern(regexp = "^[a-z][a-z0-9_]*$")
    private String resourceType;

    @NotNull(message = "Start time is required")
    private Instant startTime;

    @NotNull(message = "End time is required")
    private Instant endTime;

    @Min(1) @Max(1000)
    private Integer limit = 100;

    @Min(0)
    private Integer offset = 0;

    // Validate time range not too large (max 30 days)
    public void validateTimeRange() {
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("Start and end time required");
        }
        if (endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        long days = java.time.Duration.between(startTime, endTime).toDays();
        if (days > 30) {
            throw new IllegalArgumentException("Time range cannot exceed 30 days");
        }
        if (endTime.isAfter(Instant.now())) {
            throw new IllegalArgumentException("End time cannot be in the future");
        }
    }

    // Getters/setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }
    public Integer getOffset() { return offset; }
    public void setOffset(Integer offset) { this.offset = offset; }
}
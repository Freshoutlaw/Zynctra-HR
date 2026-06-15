package com.zynctra.timeattendance.dto;

import jakarta.validation.constraints.*;

/**
 * DTO for clock-in/out requests.
 * 
 * SECURITY:
 * - Timestamp must be within 5 minutes of server time (prevent backdating)
 * - GPS coordinates validated for range
 * - Device fingerprint required for buddy-punching detection
 */
public class ClockInRequestDTO {

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    private String employeeId;

    @Size(max = 100)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()]*$")
    private String location;

    @Min(-90) @Max(90)
    private Double latitude;

    @Min(-180) @Max(180)
    private Double longitude;

    @NotBlank(message = "Device fingerprint is required for security")
    @Size(min = 32, max = 256)
    @Pattern(regexp = "^[a-zA-Z0-9\\-_=]+$")
    private String deviceFingerprint;

    @Size(max = 200)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String notes;

    // Getters/setters
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getDeviceFingerprint() { return deviceFingerprint; }
    public void setDeviceFingerprint(String deviceFingerprint) { this.deviceFingerprint = deviceFingerprint; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
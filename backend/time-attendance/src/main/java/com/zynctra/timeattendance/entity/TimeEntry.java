package com.zynctra.timeattendance.entity;

import com.zynctra.common.entity.SecureBaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * Time Entry Entity — Individual clock-in/out events.
 * 
 * SECURITY:
 * - Each clock event is immutable after creation
 * - Correlated with AttendanceRecord for daily summary
 * - Device fingerprint and IP stored for fraud detection
 */
@Entity
@Table(
    name = "time_entries",
    schema = "timeattendance_schema",
    indexes = {
        @Index(name = "idx_time_entries_employee", columnList = "employee_id, entry_type"),
        @Index(name = "idx_time_entries_timestamp", columnList = "timestamp")
    }
)
public class TimeEntry extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    @Column(name = "employee_id", nullable = false, length = 64)
    private String employeeId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false, length = 16)
    private EntryType entryType;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Size(max = 100)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()]*$")
    @Column(name = "location", length = 100)
    private String location;

    @Min(-90) @Max(90)
    @Column(name = "latitude", precision = 10, scale = 8)
    private Double latitude;

    @Min(-180) @Max(180)
    @Column(name = "longitude", precision = 11, scale = 8)
    private Double longitude;

    @Pattern(regexp = "^(\\d{1,3}\\.){3}\\d{1,3}$|^[0-9a-fA-F:]+$")
    @Column(name = "client_ip", length = 45)
    private String clientIp;

    @Column(name = "device_fingerprint_hash", length = 64)
    private String deviceFingerprintHash;

    @Column(name = "notes", length = 200)
    @Size(max = 200)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String notes;

    public enum EntryType {
        CLOCK_IN,
        CLOCK_OUT,
        BREAK_START,
        BREAK_END,
        LUNCH_START,
        LUNCH_END
    }

    public static TimeEntry create(String employeeId, EntryType type, LocalDateTime timestamp,
                                    String location, Double lat, Double lng,
                                    String clientIp, String deviceFpHash, String createdBy) {
        TimeEntry entry = new TimeEntry();
        entry.setEmployeeId(employeeId);
        entry.setEntryType(type);
        entry.setTimestamp(timestamp);
        entry.setLocation(location);
        entry.setLatitude(lat);
        entry.setLongitude(lng);
        entry.setClientIp(clientIp);
        entry.setDeviceFingerprintHash(deviceFpHash);
        entry.setUpdatedBy(createdBy);
        return entry;
    }

    public void setEmployeeId(String employeeId) {
        validateId(employeeId);
        this.employeeId = employeeId;
    }

    public void setEntryType(EntryType entryType) {
        if (entryType == null) throw new IllegalArgumentException("Entry type required");
        this.entryType = entryType;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        if (timestamp == null) throw new IllegalArgumentException("Timestamp required");
        if (timestamp.isAfter(LocalDateTime.now().plusMinutes(5))) {
            throw new IllegalArgumentException("Timestamp cannot be in the future");
        }
        this.timestamp = timestamp;
    }

    public void setLocation(String location) {
        if (location != null) {
            if (!location.matches("^[\\p{L}\\p{N}\\s\\-_:,.()]*$")) {
                throw new IllegalArgumentException("Invalid location");
            }
            this.location = location.trim();
        }
    }

    public void setClientIp(String clientIp) {
        if (clientIp != null && !clientIp.matches("^(\\d{1,3}\\.){3}\\d{1,3}$|^[0-9a-fA-F:]+$")) {
            throw new IllegalArgumentException("Invalid IP");
        }
        this.clientIp = clientIp;
    }

    private void validateId(String id) {
        if (id == null || !id.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            throw new IllegalArgumentException("Invalid ID format");
        }
    }

    // Getters
    public String getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public EntryType getEntryType() { return entryType; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getLocation() { return location; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getClientIp() { return clientIp; }
    public String getDeviceFingerprintHash() { return deviceFingerprintHash; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setDeviceFingerprintHash(String deviceFingerprintHash) { this.deviceFingerprintHash = deviceFingerprintHash; }
}

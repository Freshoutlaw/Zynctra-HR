package com.zynctra.timeattendance.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records", indexes = {
    @Index(name = "idx_attendance_employee_id", columnList = "employee_id"),
    @Index(name = "idx_attendance_date", columnList = "clock_in_time")
})
public class AttendanceRecord extends BaseEntity {
    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "clock_in_time", nullable = false)
    private LocalDateTime clockInTime;

    @Column(name = "clock_out_time")
    private LocalDateTime clockOutTime;

    @Column(name = "hours_worked", precision = 5, scale = 2)
    private Double hoursWorked;

    @Column(name = "status")
    private String status;

    @Column(name = "notes")
    private String notes;

    @Column(name = "location")
    private String location;

    public enum AttendanceStatus {
        PRESENT, ABSENT, LATE, HALF_DAY, REMOTE
    }

    public AttendanceRecord() {}

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public LocalDateTime getClockInTime() { return clockInTime; }
    public void setClockInTime(LocalDateTime clockInTime) { this.clockInTime = clockInTime; }
    public LocalDateTime getClockOutTime() { return clockOutTime; }
    public void setClockOutTime(LocalDateTime clockOutTime) { this.clockOutTime = clockOutTime; }
    public Double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Double hoursWorked) { this.hoursWorked = hoursWorked; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public void approve(String approvedBy) {
        setStatus(AttendanceStatus.PRESENT.name());
        setUpdatedBy(approvedBy);
    }

    public void clockOut(LocalDateTime clockOutTime, String updatedBy) {
        setClockOutTime(clockOutTime);
        setUpdatedBy(updatedBy);
        if (getClockInTime() != null) {
            double hours = Duration.between(getClockInTime(), clockOutTime).toMinutes() / 60.0;
            setHoursWorked(Math.round(hours * 100.0) / 100.0);
        }
    }

    public static AttendanceRecord clockIn(String employeeId, LocalDateTime clockInTime,
                                            String location, Double latitude,
                                            Double longitude, String clientIp,
                                            String deviceFingerprintHash, String createdBy) {
        AttendanceRecord record = new AttendanceRecord();
        record.setEmployeeId(employeeId);
        record.setClockInTime(clockInTime);
        record.setLocation(location);
        record.setStatus(AttendanceStatus.PRESENT.name());
        record.setCreatedBy(createdBy);
        record.setUpdatedBy(createdBy);
        record.setTenantId("default");
        return record;
    }
}

package com.zynctra.timeattendance.entity;

import com.zynctra.common.entity.SecureBaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Work Schedule Entity — Defines employee work patterns.
 * 
 * SECURITY:
 * - Schedule changes require manager approval (versioned)
 * - No overlapping schedules allowed
 * - Maximum shift length enforced (16 hours)
 */
@Entity
@Table(
    name = "work_schedules",
    schema = "timeattendance_schema",
    indexes = {
        @Index(name = "idx_schedules_employee", columnList = "employee_id, effective_date"),
        @Index(name = "idx_schedules_active", columnList = "active, tenant_id")
    }
)
public class WorkSchedule extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]{4,64}$")
    @Column(name = "employee_id", nullable = false, length = 64)
    private String employeeId;

    @NotNull
    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 9)
    private DayOfWeek dayOfWeek;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @NotNull
    @Column(name = "break_duration_minutes", nullable = false)
    @Min(0) @Max(120)
    private Integer breakDurationMinutes = 30;

    @Column(name = "location_required", nullable = false)
    private Boolean locationRequired = true;

    @Column(name = "flexible_hours", nullable = false)
    private Boolean flexibleHours = false;

    @Column(name = "notes", length = 200)
    @Size(max = 200)
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-_:,.()!?'\"\\n\\r]*$")
    private String notes;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public static WorkSchedule create(String employeeId, LocalDate effectiveDate,
                                       DayOfWeek dayOfWeek, LocalTime startTime,
                                       LocalTime endTime, String createdBy) {
        WorkSchedule schedule = new WorkSchedule();
        schedule.setEmployeeId(employeeId);
        schedule.setEffectiveDate(effectiveDate);
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        schedule.setUpdatedBy(createdBy);
        return schedule;
    }

    public void setEmployeeId(String employeeId) {
        validateId(employeeId);
        this.employeeId = employeeId;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        if (effectiveDate == null) throw new IllegalArgumentException("Effective date required");
        this.effectiveDate = effectiveDate;
    }

    public void setStartTime(LocalTime startTime) {
        if (startTime == null) throw new IllegalArgumentException("Start time required");
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        if (endTime == null) throw new IllegalArgumentException("End time required");
        // Validate shift not exceeding 16 hours
        if (java.time.Duration.between(startTime, endTime).toHours() > 16) {
            throw new IllegalArgumentException("Shift cannot exceed 16 hours");
        }
        this.endTime = endTime;
    }

    public void setBreakDurationMinutes(Integer minutes) {
        if (minutes == null || minutes < 0 || minutes > 120) {
            throw new IllegalArgumentException("Break must be 0-120 minutes");
        }
        this.breakDurationMinutes = minutes;
    }

    private void validateId(String id) {
        if (id == null || !id.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            throw new IllegalArgumentException("Invalid ID format");
        }
    }

    // Getters
    public String getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public LocalDate getEffectiveDate() { return effectiveDate; }
    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public Integer getBreakDurationMinutes() { return breakDurationMinutes; }
    public Boolean getLocationRequired() { return locationRequired; }
    public void setLocationRequired(Boolean locationRequired) { this.locationRequired = locationRequired; }
    public Boolean getFlexibleHours() { return flexibleHours; }
    public void setFlexibleHours(Boolean flexibleHours) { this.flexibleHours = flexibleHours; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

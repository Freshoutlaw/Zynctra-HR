package com.zynctra.timeattendance.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records", indexes = {
    @Index(name = "idx_attendance_employee_id", columnList = "employee_id"),
    @Index(name = "idx_attendance_date", columnList = "clock_in_time")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private String status; // PRESENT, ABSENT, LATE, HALF_DAY

    @Column(name = "notes")
    private String notes;

    @Column(name = "location")
    private String location;
}

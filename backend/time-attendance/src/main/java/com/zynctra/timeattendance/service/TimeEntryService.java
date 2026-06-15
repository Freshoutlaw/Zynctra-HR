package com.zynctra.timeattendance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import com.zynctra.timeattendance.dto.ClockInRequestDTO;
import com.zynctra.timeattendance.entity.AttendanceRecord;
import com.zynctra.timeattendance.entity.TimeEntry;
import com.zynctra.timeattendance.repository.AttendanceRecordRepository;
import com.zynctra.timeattendance.repository.TimeEntryRepository;
import com.zynctra.timeattendance.security.Audited;
import com.zynctra.timeattendance.security.FraudDetectionService;
import com.zynctra.timeattendance.security.TenantContext;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import jakarta.validation.Valid;
import lombok.var;

@Service
@Validated
@Transactional(readOnly = true)
public class TimeEntryService {

    private final TimeEntryRepository timeEntryRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final FraudDetectionService fraudDetectionService;
    private final RateLimiter clockInRateLimiter;

    public TimeEntryService(TimeEntryRepository timeEntryRepository,
                            AttendanceRecordRepository attendanceRecordRepository,
                            FraudDetectionService fraudDetectionService,
                            @Qualifier("clockInRateLimiter") RateLimiter clockInRateLimiter) {
        this.timeEntryRepository = timeEntryRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.fraudDetectionService = fraudDetectionService;
        this.clockInRateLimiter = clockInRateLimiter;
    }

    @Audited
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN')")
    @Transactional
    public TimeEntry clockIn(@Valid ClockInRequestDTO dto, String clientIp, String createdBy) {
        // Rate limit check
        try {
            clockInRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded — too many clock operations");
        }

        String tenantId = TenantContext.getCurrentTenant();
        String employeeId = dto.getEmployeeId();

        // Fraud detection
        fraudDetectionService.validateClockOperation(
            employeeId, clientIp, dto.getDeviceFingerprint(),
            dto.getLatitude(), dto.getLongitude(), java.time.Instant.now()
        );

        // Check if already clocked in
        LocalDate today = LocalDate.now();
        var existingRecord = attendanceRecordRepository.findByEmployeeAndDate(employeeId, today, tenantId);
        
        if (existingRecord.isPresent() && existingRecord.get().getClockOutTime() == null) {
            throw new IllegalStateException("Already clocked in. Please clock out first.");
        }

        // Create time entry
        TimeEntry entry = TimeEntry.create(
            employeeId,
            TimeEntry.EntryType.CLOCK_IN,
            LocalDateTime.now(),
            dto.getLocation(),
            dto.getLatitude(),
            dto.getLongitude(),
            clientIp,
            hashFingerprint(dto.getDeviceFingerprint()),
            createdBy
        );

        entry = timeEntryRepository.save(entry);

        // Create or update attendance record
        if (existingRecord.isPresent()) {
            // Already has a record for today (clocked out earlier)
            AttendanceRecord record = existingRecord.get();
            record.setClockInTime(LocalDateTime.now());
            record.setClockOutTime(null);
            record.setHoursWorked(null);
            record.setStatus(AttendanceRecord.AttendanceStatus.PRESENT);
            record.setUpdatedBy(createdBy);
            attendanceRecordRepository.save(record);
        } else {
            // First clock-in today
            AttendanceRecord newRecord = AttendanceRecord.clockIn(
                employeeId, LocalDateTime.now(), dto.getLocation(),
                dto.getLatitude(), dto.getLongitude(), clientIp,
                hashFingerprint(dto.getDeviceFingerprint()), createdBy
            );
            attendanceRecordRepository.save(newRecord);
        }

        return entry;
    }

    @Audited
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN')")
    @Transactional
    public TimeEntry clockOut(@Valid ClockInRequestDTO dto, String clientIp, String createdBy) {
        try {
            clockInRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded");
        }

        String tenantId = TenantContext.getCurrentTenant();
        String employeeId = dto.getEmployeeId();

        fraudDetectionService.validateClockOperation(
            employeeId, clientIp, dto.getDeviceFingerprint(),
            dto.getLatitude(), dto.getLongitude(), java.time.Instant.now()
        );

        LocalDate today = LocalDate.now();
        var recordOpt = attendanceRecordRepository.findByEmployeeAndDate(employeeId, today, tenantId);
        
        if (recordOpt.isEmpty() || recordOpt.get().getClockOutTime() != null) {
            throw new IllegalStateException("Not clocked in or already clocked out");
        }

        AttendanceRecord record = recordOpt.get();
        record.clockOut(LocalDateTime.now(), createdBy);
        attendanceRecordRepository.save(record);

        TimeEntry entry = TimeEntry.create(
            employeeId,
            TimeEntry.EntryType.CLOCK_OUT,
            LocalDateTime.now(),
            dto.getLocation(),
            dto.getLatitude(),
            dto.getLongitude(),
            clientIp,
            hashFingerprint(dto.getDeviceFingerprint()),
            createdBy
        );

        return timeEntryRepository.save(entry);
    }

    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN') or #employeeId == authentication.name")
    public List<TimeEntry> getEmployeeEntries(String employeeId, LocalDateTime start, LocalDateTime end) {
        String tenantId = TenantContext.getCurrentTenant();
        return timeEntryRepository.findByEmployeeAndTimeRange(employeeId, start, end, tenantId);
    }

    private String hashFingerprint(String fingerprint) {
        if (fingerprint == null) return null;
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(fingerprint.getBytes());
            return bytesToHex(hash);
        } catch (Exception e) {
            return "invalid";
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
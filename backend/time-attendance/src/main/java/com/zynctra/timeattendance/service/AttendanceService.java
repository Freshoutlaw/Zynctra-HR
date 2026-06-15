package com.zynctra.timeattendance.service;

import com.zynctra.timeattendance.dto.AttendanceRecordDTO;
import com.zynctra.timeattendance.entity.AttendanceRecord;
import com.zynctra.timeattendance.repository.AttendanceRecordRepository;
import com.zynctra.timeattendance.security.Audited;
import com.zynctra.timeattendance.security.TenantContext;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final RateLimiter readRateLimiter;

    public AttendanceService(AttendanceRecordRepository attendanceRecordRepository,
                             @Qualifier("attendanceReadRateLimiter") RateLimiter readRateLimiter) {
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.readRateLimiter = readRateLimiter;
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN', 'HR_ADMIN') or #employeeId == authentication.name")
    public List<AttendanceRecord> getEmployeeAttendance(String employeeId, LocalDate start, LocalDate end) {
        checkRateLimit();
        String tenantId = TenantContext.getCurrentTenant();
        return attendanceRecordRepository.findByEmployeeAndDateRange(employeeId, start, end, tenantId);
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN')")
    public List<AttendanceRecord> getPendingApprovals() {
        checkRateLimit();
        return attendanceRecordRepository.findPendingApprovals(TenantContext.getCurrentTenant());
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN')")
    @Transactional
    public AttendanceRecord approveRecord(String id, String approvedBy) {
        checkRateLimit();
        String tenantId = TenantContext.getCurrentTenant();
        
        AttendanceRecord record = attendanceRecordRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Record not found"));
        
        record.approve(approvedBy);
        record.setUpdatedBy(approvedBy);
        return attendanceRecordRepository.save(record);
    }

    @Audited
    @PreAuthorize("hasRole('TIME_ADMIN')")
    @Transactional
    public void deleteRecord(String id, String deletedBy) {
        checkRateLimit();
        String tenantId = TenantContext.getCurrentTenant();
        int updated = attendanceRecordRepository.softDeleteById(id, tenantId, deletedBy);
        if (updated == 0) {
            throw new jakarta.persistence.EntityNotFoundException("Record not found or access denied");
        }
    }

    private void checkRateLimit() {
        try {
            readRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded");
        }
    }
}
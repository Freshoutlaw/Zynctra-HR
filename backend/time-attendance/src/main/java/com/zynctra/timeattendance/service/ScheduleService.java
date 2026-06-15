package com.zynctra.timeattendance.service;

import com.zynctra.timeattendance.dto.WorkScheduleDTO;
import com.zynctra.timeattendance.entity.WorkSchedule;
import com.zynctra.timeattendance.repository.WorkScheduleRepository;
import com.zynctra.timeattendance.security.Audited;
import com.zynctra.timeattendance.security.TenantContext;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ScheduleService {

    private final WorkScheduleRepository workScheduleRepository;
    private final RateLimiter scheduleRateLimiter;

    public ScheduleService(WorkScheduleRepository workScheduleRepository,
                           @Qualifier("scheduleRateLimiter") RateLimiter scheduleRateLimiter) {
        this.workScheduleRepository = workScheduleRepository;
        this.scheduleRateLimiter = scheduleRateLimiter;
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN')")
    @Transactional
    public WorkSchedule createSchedule(WorkScheduleDTO dto, String createdBy) {
        checkRateLimit();
        
        // Validate shift length
        if (java.time.Duration.between(dto.getStartTime(), dto.getEndTime()).toHours() > 16) {
            throw new IllegalArgumentException("Shift cannot exceed 16 hours");
        }

        WorkSchedule schedule = WorkSchedule.create(
            dto.getEmployeeId(),
            dto.getEffectiveDate(),
            dto.getDayOfWeek(),
            dto.getStartTime(),
            dto.getEndTime(),
            createdBy
        );
        
        schedule.setBreakDurationMinutes(dto.getBreakDurationMinutes());
        schedule.setLocationRequired(dto.getLocationRequired());
        schedule.setFlexibleHours(dto.getFlexibleHours());
        schedule.setNotes(dto.getNotes());
        
        return workScheduleRepository.save(schedule);
    }

    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN') or #employeeId == authentication.name")
    public List<WorkSchedule> getEmployeeSchedules(String employeeId) {
        checkRateLimit();
        return workScheduleRepository.findByEmployeeId(employeeId, TenantContext.getCurrentTenant());
    }

    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN')")
    public WorkSchedule getScheduleForDay(String employeeId, DayOfWeek dayOfWeek, LocalDate date) {
        checkRateLimit();
        return workScheduleRepository.findActiveForEmployeeAndDay(
            employeeId, dayOfWeek, date, TenantContext.getCurrentTenant()
        ).orElse(null);
    }

    private void checkRateLimit() {
        try {
            scheduleRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded");
        }
    }
}
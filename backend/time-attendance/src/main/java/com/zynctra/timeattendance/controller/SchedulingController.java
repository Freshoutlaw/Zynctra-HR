package com.zynctra.timeattendance.controller;

import com.zynctra.timeattendance.dto.WorkScheduleDTO;
import com.zynctra.timeattendance.entity.WorkSchedule;
import com.zynctra.timeattendance.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/schedules")
public class SchedulingController {

    private final ScheduleService scheduleService;

    public SchedulingController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN')")
    public ResponseEntity<WorkSchedule> createSchedule(@Valid @RequestBody WorkScheduleDTO dto,
                                                        Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(scheduleService.createSchedule(dto, auth.getName()));
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN') or #employeeId == authentication.name")
    public ResponseEntity<List<WorkSchedule>> getSchedules(@PathVariable String employeeId) {
        if (!employeeId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(scheduleService.getEmployeeSchedules(employeeId));
    }

    @GetMapping("/employees/{employeeId}/today")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN') or #employeeId == authentication.name")
    public ResponseEntity<WorkSchedule> getTodaySchedule(@PathVariable String employeeId) {
        if (!employeeId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            return ResponseEntity.badRequest().build();
        }
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        WorkSchedule schedule = scheduleService.getScheduleForDay(employeeId, today, LocalDate.now());
        return ResponseEntity.ok(schedule);
    }
}
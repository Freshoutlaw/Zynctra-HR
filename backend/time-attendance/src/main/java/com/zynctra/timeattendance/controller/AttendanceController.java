package com.zynctra.timeattendance.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zynctra.timeattendance.entity.AttendanceRecord;
import com.zynctra.timeattendance.service.AttendanceService;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/employees/{employeeId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN', 'HR_ADMIN') or #employeeId == authentication.name")
    public ResponseEntity<List<AttendanceRecord>> getAttendance(
            @PathVariable String employeeId,
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        
        if (!employeeId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(attendanceService.getEmployeeAttendance(employeeId, start, end));
    }

    @GetMapping("/pending-approvals")
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN')")
    public ResponseEntity<List<AttendanceRecord>> getPendingApprovals() {
        return ResponseEntity.ok(attendanceService.getPendingApprovals());
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN')")
    public ResponseEntity<AttendanceRecord> approve(@PathVariable String id, Authentication auth) {
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(attendanceService.approveRecord(id, auth.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TIME_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id, Authentication auth) {
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        attendanceService.deleteRecord(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        return ResponseEntity.status(500)
            .body(Map.of("error", "Internal error", "message", "An unexpected error occurred"));
    }
}
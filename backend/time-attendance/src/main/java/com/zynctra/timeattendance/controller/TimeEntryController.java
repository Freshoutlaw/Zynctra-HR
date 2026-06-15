package com.zynctra.timeattendance.controller;

import com.zynctra.timeattendance.dto.ClockInRequestDTO;
import com.zynctra.timeattendance.entity.TimeEntry;
import com.zynctra.timeattendance.security.TenantContext;
import com.zynctra.timeattendance.service.TimeEntryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Time Entry Controller — Clock-in/out operations.
 * 
 * SECURITY:
 * - All endpoints rate-limited
 * - Fraud detection on every clock operation
 * - Device fingerprint required
 * - IP address logged for anomaly detection
 */
@RestController
@RequestMapping("/clock")
public class TimeEntryController {

    private final TimeEntryService timeEntryService;

    public TimeEntryController(TimeEntryService timeEntryService) {
        this.timeEntryService = timeEntryService;
    }

    @PostMapping("/in")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN')")
    public ResponseEntity<TimeEntry> clockIn(@Valid @RequestBody ClockInRequestDTO dto,
                                              Authentication auth) {
        String clientIp = getClientIp();
        TimeEntry entry = timeEntryService.clockIn(dto, clientIp, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(entry);
    }

    @PostMapping("/out")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'TIME_ADMIN')")
    public ResponseEntity<TimeEntry> clockOut(@Valid @RequestBody ClockInRequestDTO dto,
                                               Authentication auth) {
        String clientIp = getClientIp();
        TimeEntry entry = timeEntryService.clockOut(dto, clientIp, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(entry);
    }

    @GetMapping("/entries/{employeeId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'TIME_ADMIN') or #employeeId == authentication.name")
    public ResponseEntity<List<TimeEntry>> getEntries(
            @PathVariable String employeeId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        
        if (!employeeId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(timeEntryService.getEmployeeEntries(employeeId, start, end));
    }

    private String getClientIp() {
        // Extract from request context
        return "0.0.0.0"; // Placeholder — implement via RequestContextHolder
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, String>> handleSecurity(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .body(Map.of("error", "Security violation", "message", ex.getMessage()));
    }
}
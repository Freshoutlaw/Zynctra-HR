package com.zynctra.performance.controller;

import com.zynctra.performance.dto.GoalDTO;
import com.zynctra.performance.dto.PerformanceReviewDTO;
import com.zynctra.performance.entity.Goal;
import com.zynctra.performance.entity.PerformanceReview;
import com.zynctra.performance.service.GoalService;
import com.zynctra.performance.service.PerformanceReviewService;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Performance Management REST Controller
 * 
 * SECURITY:
 * - All endpoints authenticated
 * - RBAC via @PreAuthorize
 * - Rate limiting on all endpoints
 * - Input validation via @Valid
 * - No sensitive data in URL paths
 * - Standardized error responses (no stack traces)
 */
@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceReviewService reviewService;
    private final GoalService goalService;
    private final RateLimiter standardRateLimiter;

    public PerformanceController(PerformanceReviewService reviewService,
                                  GoalService goalService,
                                  @Qualifier("standardRateLimiter") RateLimiter standardRateLimiter) {
        this.reviewService = reviewService;
        this.goalService = goalService;
        this.standardRateLimiter = standardRateLimiter;
    }

    // ==================== PERFORMANCE REVIEWS ====================

    @PostMapping("/reviews")
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<PerformanceReview> createReview(
            @Valid @RequestBody PerformanceReviewDTO dto,
            Authentication auth) {
        
        checkRateLimit();
        String createdBy = auth.getName();
        PerformanceReview review = reviewService.createReview(dto, createdBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @GetMapping("/reviews/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    public ResponseEntity<PerformanceReview> getReview(@PathVariable String id) {
        checkRateLimit();
        // Validate ID format
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.getReview(id));
    }

    @PostMapping("/reviews/{id}/submit")
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN')")
    public ResponseEntity<PerformanceReview> submitReview(
            @PathVariable String id,
            Authentication auth) {
        
        checkRateLimit();
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.submitReview(id, auth.getName()));
    }

    @PostMapping("/reviews/{id}/acknowledge")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<PerformanceReview> acknowledgeReview(
            @PathVariable String id,
            Authentication auth) {
        
        checkRateLimit();
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.acknowledgeReview(id, auth.getName()));
    }

    @GetMapping("/employees/{employeeId}/reviews")
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN') or #employeeId == authentication.name")
    public ResponseEntity<List<PerformanceReview>> getEmployeeReviews(
            @PathVariable String employeeId) {
        
        checkRateLimit();
        if (!employeeId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.getEmployeeReviews(employeeId));
    }

    @GetMapping("/admin/overdue-reviews")
    @PreAuthorize("hasRole('PERFORMANCE_ADMIN')")
    public ResponseEntity<List<PerformanceReview>> getOverdueReviews() {
        checkRateLimit();
        return ResponseEntity.ok(reviewService.getOverdueReviews());
    }

    @DeleteMapping("/reviews/{id}")
    @PreAuthorize("hasRole('PERFORMANCE_ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable String id, Authentication auth) {
        checkRateLimit();
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        reviewService.softDeleteReview(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // ==================== GOALS ====================

    @PostMapping("/goals")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    public ResponseEntity<Goal> createGoal(@Valid @RequestBody GoalDTO dto, Authentication auth) {
        checkRateLimit();
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.createGoal(dto, auth.getName()));
    }

    @GetMapping("/goals/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    public ResponseEntity<Goal> getGoal(@PathVariable String id) {
        checkRateLimit();
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(goalService.getGoal(id));
    }

    @PatchMapping("/goals/{id}/progress")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    public ResponseEntity<Goal> updateProgress(
            @PathVariable String id,
            @RequestBody Map<String, Integer> body,
            Authentication auth) {
        
        checkRateLimit();
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        Integer progress = body.get("progressPercent");
        if (progress == null || progress < 0 || progress > 100) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(goalService.updateProgress(id, progress, auth.getName()));
    }

    @GetMapping("/employees/{employeeId}/goals")
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN') or #employeeId == authentication.name")
    public ResponseEntity<List<Goal>> getEmployeeGoals(@PathVariable String employeeId) {
        checkRateLimit();
        if (!employeeId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(goalService.getEmployeeGoals(employeeId));
    }

    @GetMapping("/admin/overdue-goals")
    @PreAuthorize("hasRole('PERFORMANCE_ADMIN')")
    public ResponseEntity<List<Goal>> getOverdueGoals() {
        checkRateLimit();
        return ResponseEntity.ok(goalService.getOverdueGoals());
    }

    @DeleteMapping("/goals/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN')")
    public ResponseEntity<Void> deleteGoal(@PathVariable String id, Authentication auth) {
        checkRateLimit();
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        goalService.deleteGoal(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    // ==================== SECURITY HELPERS ====================

    private void checkRateLimit() {
        try {
            standardRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded — too many requests");
        }
    }

    // ==================== GLOBAL EXCEPTION HANDLING ====================

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, String>> handleSecurityException(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .body(Map.of("error", "Rate limit exceeded", "message", "Please slow down your requests"));
    }

    @ExceptionHandler(jakarta.persistence.EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(jakarta.persistence.EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "Not found", "message", "The requested resource does not exist"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", "Invalid request", "message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", "Invalid state", "message", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        // NEVER log full exception details to client
        // Log internally for investigation
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Internal error", "message", "An unexpected error occurred"));
    }
}
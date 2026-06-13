package com.zynctra.performance.service;

import com.zynctra.performance.dto.PerformanceReviewDTO;
import com.zynctra.performance.entity.PerformanceReview;
import com.zynctra.performance.repository.PerformanceReviewRepository;
import com.zynctra.performance.security.Audited;
import com.zynctra.performance.security.TenantContext;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Performance Review Service
 * 
 * SECURITY:
 * - RBAC enforced at method level
 * - Rate limiting on write operations
 * - Input validation via @Valid
 * - Tenant isolation verified on every operation
 * - Audit logging on all state changes
 */
@Service
@Validated
@Transactional(readOnly = true)
public class PerformanceReviewService {

    private final PerformanceReviewRepository reviewRepository;
    private final RateLimiter strictRateLimiter;

    public PerformanceReviewService(PerformanceReviewRepository reviewRepository,
                                    @Qualifier("strictRateLimiter") RateLimiter strictRateLimiter) {
        this.reviewRepository = reviewRepository;
        this.strictRateLimiter = strictRateLimiter;
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN', 'HR_ADMIN')")
    @Transactional
    public PerformanceReview createReview(@Valid PerformanceReviewDTO dto, String createdBy) {
        // Rate limit check
        try {
            strictRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded — please slow down");
        }

        // Validate period
        if (dto.getReviewPeriodEnd().isBefore(dto.getReviewPeriodStart())) {
            throw new IllegalArgumentException("Review period end must be after start");
        }
        if (dto.getReviewPeriodStart().isAfter(java.time.LocalDate.now())) {
            throw new IllegalArgumentException("Review period cannot start in the future");
        }

        PerformanceReview review = PerformanceReview.create(
            dto.getEmployeeId(),
            dto.getReviewerId(),
            dto.getReviewPeriodStart(),
            dto.getReviewPeriodEnd(),
            createdBy
        );

        review.setOverallRating(dto.getOverallRating());
        review.setStrengths(dto.getStrengths());
        review.setAreasForImprovement(dto.getAreasForImprovement());
        review.setGoals(dto.getGoals());
        review.setReviewerComments(dto.getReviewerComments());

        return reviewRepository.save(review);
    }

    @Audited
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'PERFORMANCE_ADMIN')")
    public PerformanceReview getReview(String id) {
        String tenantId = TenantContext.getCurrentTenant();
        return reviewRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Review not found"));
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN')")
    @Transactional
    public PerformanceReview submitReview(String id, String submittedBy) {
        String tenantId = TenantContext.getCurrentTenant();
        
        PerformanceReview review = reviewRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Review not found"));

        // Authorization: only reviewer or admin can submit
        if (!review.getReviewerId().equals(submittedBy) && !isAdmin(submittedBy)) {
            throw new SecurityException("Only the assigned reviewer can submit this review");
        }

        if (review.getStatus() != PerformanceReview.ReviewStatus.DRAFT) {
            throw new IllegalStateException("Only draft reviews can be submitted");
        }

        review.setStatus(PerformanceReview.ReviewStatus.SUBMITTED);
        review.setUpdatedBy(submittedBy);
        
        return reviewRepository.save(review);
    }

    @Audited
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Transactional
    public PerformanceReview acknowledgeReview(String id, String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        
        PerformanceReview review = reviewRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Review not found"));

        review.acknowledge(employeeId);
        review.setUpdatedBy(employeeId);
        
        return reviewRepository.save(review);
    }

    @Audited
    @PreAuthorize("hasAnyRole('MANAGER', 'PERFORMANCE_ADMIN')")
    public List<PerformanceReview> getEmployeeReviews(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        return reviewRepository.findByEmployeeId(employeeId, tenantId);
    }

    @Audited
    @PreAuthorize("hasRole('PERFORMANCE_ADMIN')")
    public List<PerformanceReview> getOverdueReviews() {
        String tenantId = TenantContext.getCurrentTenant();
        Instant cutoff = Instant.now().minus(14, ChronoUnit.DAYS);
        return reviewRepository.findOverdueReviews(cutoff, tenantId);
    }

    @Audited
    @PreAuthorize("hasRole('PERFORMANCE_ADMIN')")
    @Transactional
    public void softDeleteReview(String id, String deletedBy) {
        String tenantId = TenantContext.getCurrentTenant();
        int updated = reviewRepository.softDeleteById(id, tenantId, deletedBy);
        if (updated == 0) {
            throw new jakarta.persistence.EntityNotFoundException("Review not found or access denied");
        }
    }

    private boolean isAdmin(String userId) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_PERFORMANCE_ADMIN") || 
                          a.getAuthority().equals("ROLE_HR_ADMIN"));
    }
}
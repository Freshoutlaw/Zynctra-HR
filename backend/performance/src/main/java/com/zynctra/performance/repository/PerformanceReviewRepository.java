package com.zynctra.performance.repository;

import com.zynctra.performance.entity.PerformanceReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Performance Review Repository
 * 
 * SECURITY:
 * - All queries include tenant_id filter (enforced by Hibernate @Filter on entity)
 * - No native queries to prevent SQL injection
 * - Soft delete only — no physical deletion
 */
@Repository
public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, String> {

    /**
     * Find review by ID with tenant validation
     */
    @Query("SELECT r FROM PerformanceReview r WHERE r.id = :id AND r.tenantId = :tenantId AND r.deleted = false")
    Optional<PerformanceReview> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    /**
     * Find all reviews for an employee
     */
    @Query("SELECT r FROM PerformanceReview r WHERE r.employeeId = :employeeId AND r.tenantId = :tenantId AND r.deleted = false ORDER BY r.reviewPeriodEnd DESC")
    List<PerformanceReview> findByEmployeeId(@Param("employeeId") String employeeId, @Param("tenantId") String tenantId);

    /**
     * Find reviews by reviewer
     */
    @Query("SELECT r FROM PerformanceReview r WHERE r.reviewerId = :reviewerId AND r.tenantId = :tenantId AND r.deleted = false ORDER BY r.reviewPeriodEnd DESC")
    List<PerformanceReview> findByReviewerId(@Param("reviewerId") String reviewerId, @Param("tenantId") String tenantId);

    /**
     * Find reviews by status
     */
    @Query("SELECT r FROM PerformanceReview r WHERE r.status = :status AND r.tenantId = :tenantId AND r.deleted = false")
    List<PerformanceReview> findByStatus(@Param("status") PerformanceReview.ReviewStatus status, @Param("tenantId") String tenantId);

    /**
     * Find overdue reviews (submitted but not acknowledged after 14 days)
     */
    @Query("SELECT r FROM PerformanceReview r WHERE r.status = 'SUBMITTED' AND r.submittedAt < :cutoff AND r.tenantId = :tenantId AND r.deleted = false")
    List<PerformanceReview> findOverdueReviews(@Param("cutoff") java.time.Instant cutoff, @Param("tenantId") String tenantId);

    /**
     * Soft delete a review
     */
    @Modifying
    @Query("UPDATE PerformanceReview r SET r.deleted = true, r.updatedBy = :updatedBy, r.updatedAt = CURRENT_TIMESTAMP WHERE r.id = :id AND r.tenantId = :tenantId")
    int softDeleteById(@Param("id") String id, @Param("tenantId") String tenantId, @Param("updatedBy") String updatedBy);

    /**
     * Check if review exists and belongs to tenant
     */
    @Query("SELECT COUNT(r) > 0 FROM PerformanceReview r WHERE r.id = :id AND r.tenantId = :tenantId AND r.deleted = false")
    boolean existsByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    /**
     * Find reviews for period (manager dashboard)
     */
    @Query("SELECT r FROM PerformanceReview r WHERE r.reviewPeriodStart >= :start AND r.reviewPeriodEnd <= :end AND r.tenantId = :tenantId AND r.deleted = false")
    Page<PerformanceReview> findForPeriod(@Param("start") LocalDate start, @Param("end") LocalDate end, 
                                           @Param("tenantId") String tenantId, Pageable pageable);
}
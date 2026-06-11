package com.zynctra.analytics.repository;

import com.zynctra.analytics.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Report Repository
 * 
 * Provides CRUD operations and custom queries for reports.
 */
@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    /**
     * Finds active reports for a tenant with pagination.
     */
    Page<Report> findByTenantIdAndIsActiveTrue(UUID tenantId, Pageable pageable);

    /**
     * Finds reports by category.
     */
    List<Report> findByTenantIdAndCategoryAndIsActiveTrue(
        UUID tenantId, Report.ReportCategory category);

    /**
     * Finds shared reports accessible to all users in a tenant.
     */
    List<Report> findByTenantIdAndIsSharedTrueAndIsActiveTrue(UUID tenantId);

    /**
     * Finds reports created by a specific user.
     */
    List<Report> findByTenantIdAndCreatedByAndIsActiveTrue(UUID tenantId, UUID createdBy);

    /**
     * Finds scheduled reports that need execution.
     */
    @Query("""
        SELECT r FROM Report r 
        WHERE r.isScheduled = true 
        AND r.isActive = true 
        AND (r.lastExecutedAt IS NULL OR r.lastExecutionStatus != 'RUNNING')
        """)
    List<Report> findReportsDueForExecution();

    /**
     * Searches reports by name (case-insensitive).
     */
    @Query("""
        SELECT r FROM Report r 
        WHERE r.tenantId = :tenantId 
        AND r.isActive = true 
        AND LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%'))
        """)
    List<Report> searchByName(UUID tenantId, String search);
}
package com.zynctra.analytics.repository;

import com.zynctra.analytics.entity.ExportJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Export Job Repository
 * 
 * Provides CRUD operations and custom queries for export jobs.
 */
@Repository
public interface ExportJobRepository extends JpaRepository<ExportJob, UUID> {

    /**
     * Finds export jobs for a tenant with pagination.
     */
    Page<ExportJob> findByTenantIdOrderByCreatedAtDesc(UUID tenantId, Pageable pageable);

    /**
     * Finds export jobs by status.
     */
    List<ExportJob> findByTenantIdAndStatus(UUID tenantId, ExportJob.ExportStatus status);

    /**
     * Finds a specific export job for a user.
     */
    Optional<ExportJob> findByIdAndTenantIdAndCreatedBy(UUID id, UUID tenantId, UUID createdBy);

    /**
     * Finds completed exports that have expired.
     */
    @Query("""
        SELECT e FROM ExportJob e 
        WHERE e.status = 'COMPLETED' 
        AND e.expiresAt < :now
        """)
    List<ExportJob> findExpiredExports(Instant now);

    /**
     * Counts active (non-expired) exports for a tenant.
     */
    long countByTenantIdAndStatusIn(UUID tenantId, List<ExportJob.ExportStatus> statuses);

    /**
     * Marks old export jobs as expired.
     */
    @Modifying
    @Query("""
        UPDATE ExportJob e 
        SET e.status = 'EXPIRED' 
        WHERE e.status = 'COMPLETED' 
        AND e.expiresAt < :now
        """)
    int markExpiredExports(Instant now);
}
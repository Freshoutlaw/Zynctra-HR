package com.zynctra.ats.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.ats.entity.JobRequisition;

@Repository
public interface JobRequisitionRepository extends JpaRepository<JobRequisition, UUID> {

    Page<JobRequisition> findByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, JobRequisition.JobStatus status, Pageable pageable);

    Page<JobRequisition> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    List<JobRequisition> findByTenantIdAndDepartmentIdAndDeletedAtIsNull(
        UUID tenantId, UUID departmentId);

    List<JobRequisition> findByTenantIdAndHiringManagerIdAndDeletedAtIsNull(
        UUID tenantId, UUID hiringManagerId);

    @Query("""
        SELECT j FROM JobRequisition j
        WHERE j.tenantId = :tenantId
        AND j.deletedAt IS NULL
        AND (LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    List<JobRequisition> searchByTitleOrDescription(UUID tenantId, String search);

    long countByTenantIdAndStatusAndDeletedAtIsNull(UUID tenantId, JobRequisition.JobStatus status);

    @Query("""
        SELECT j.status, COUNT(j) FROM JobRequisition j
        WHERE j.tenantId = :tenantId AND j.deletedAt IS NULL
        GROUP BY j.status
        """)
    List<Object[]> countByStatusGrouped(UUID tenantId);
}
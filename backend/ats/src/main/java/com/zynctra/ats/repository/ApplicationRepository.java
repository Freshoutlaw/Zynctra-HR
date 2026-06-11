package com.zynctra.ats.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.ats.entity.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Page<Application> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    Page<Application> findByTenantIdAndJobRequisitionIdAndDeletedAtIsNull(
        UUID tenantId, UUID jobRequisitionId, Pageable pageable);

    Page<Application> findByTenantIdAndCandidateIdAndDeletedAtIsNull(
        UUID tenantId, UUID candidateId, Pageable pageable);

    Page<Application> findByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, Application.ApplicationStatus status, Pageable pageable);

    Page<Application> findByTenantIdAndStageAndDeletedAtIsNull(
        UUID tenantId, Application.PipelineStage stage, Pageable pageable);

    Optional<Application> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);

    @Query("""
        SELECT a FROM Application a
        WHERE a.tenantId = :tenantId
        AND a.deletedAt IS NULL
        AND a.jobRequisitionId = :jobId
        AND a.status = 'ACTIVE'
        ORDER BY a.appliedAt DESC
        """)
    List<Application> findActiveByJobRequisition(UUID tenantId, UUID jobId);

    @Modifying
    @Query("""
        UPDATE Application a
        SET a.status = :status, a.stage = :stage, a.dispositionedAt = CURRENT_TIMESTAMP,
            a.dispositionedBy = :userId
        WHERE a.id = :id AND a.tenantId = :tenantId
        """)
    int updateStatusAndStage(UUID id, UUID tenantId, Application.ApplicationStatus status,
                             Application.PipelineStage stage, UUID userId);

    @Query("""
        SELECT a.stage, COUNT(a) FROM Application a
        WHERE a.tenantId = :tenantId AND a.deletedAt IS NULL AND a.status = 'ACTIVE'
        GROUP BY a.stage
        """)
    List<Object[]> countByStageGrouped(UUID tenantId);

    long countByTenantIdAndJobRequisitionIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, UUID jobRequisitionId, Application.ApplicationStatus status);
}
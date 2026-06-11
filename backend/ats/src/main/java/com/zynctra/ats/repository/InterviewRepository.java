package com.zynctra.ats.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.ats.entity.Interview;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, UUID> {

    Page<Interview> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    List<Interview> findByTenantIdAndApplicationIdAndDeletedAtIsNull(
        UUID tenantId, UUID applicationId);

    List<Interview> findByTenantIdAndInterviewerIdAndDeletedAtIsNull(
        UUID tenantId, UUID interviewerId);

    Page<Interview> findByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, Interview.InterviewStatus status, Pageable pageable);

    Optional<Interview> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);

    @Query("""
        SELECT i FROM Interview i
        WHERE i.tenantId = :tenantId
        AND i.deletedAt IS NULL
        AND i.scheduledAt BETWEEN :start AND :end
        ORDER BY i.scheduledAt
        """)
    List<Interview> findScheduledBetween(UUID tenantId, Instant start, Instant end);

    @Query("""
        SELECT i FROM Interview i
        WHERE i.tenantId = :tenantId
        AND i.deletedAt IS NULL
        AND i.status = 'SCHEDULED'
        AND i.scheduledAt < :now
        """)
    List<Interview> findOverdueInterviews(UUID tenantId, Instant now);

    long countByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, Interview.InterviewStatus status);

    @Query("""
        SELECT i.type, COUNT(i) FROM Interview i
        WHERE i.tenantId = :tenantId AND i.deletedAt IS NULL
        GROUP BY i.type
        """)
    List<Object[]> countByTypeGrouped(UUID tenantId);
}
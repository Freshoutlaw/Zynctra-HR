package com.zynctra.ats.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.ats.entity.Candidate;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, UUID> {

    Page<Candidate> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    Page<Candidate> findByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, Candidate.CandidateStatus status, Pageable pageable);

    Optional<Candidate> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);

    Optional<Candidate> findByTenantIdAndEmailAndDeletedAtIsNull(UUID tenantId, String email);

    List<Candidate> findByTenantIdAndSourceAndDeletedAtIsNull(
        UUID tenantId, Candidate.CandidateSource source);

    // SECURITY FIX: Use escape character to prevent LIKE wildcard abuse
    // Also limit results by using Pageable
    @Query("""
        SELECT c FROM Candidate c
        WHERE c.tenantId = :tenantId
        AND c.deletedAt IS NULL
        AND (LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) ESCAPE '!'
        OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) ESCAPE '!'
        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) ESCAPE '!'
        OR LOWER(c.currentCompany) LIKE LOWER(CONCAT('%', :search, '%')) ESCAPE '!')
        """)
    List<Candidate> searchCandidates(UUID tenantId, String search, Pageable pageable);

    long countByTenantIdAndStatusAndDeletedAtIsNull(UUID tenantId, Candidate.CandidateStatus status);

    @Query("""
        SELECT c.source, COUNT(c) FROM Candidate c
        WHERE c.tenantId = :tenantId AND c.deletedAt IS NULL
        GROUP BY c.source
        """)
    List<Object[]> countBySourceGrouped(UUID tenantId);
}
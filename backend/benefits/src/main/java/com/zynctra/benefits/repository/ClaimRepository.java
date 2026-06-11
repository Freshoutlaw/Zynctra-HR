package com.zynctra.benefits.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.benefits.entity.Claim;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, UUID> {

    Page<Claim> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    Optional<Claim> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);

    List<Claim> findByTenantIdAndEmployeeIdAndDeletedAtIsNull(
        UUID tenantId, UUID employeeId, Pageable pageable);

    List<Claim> findByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, Claim.ClaimStatus status, Pageable pageable);

    @Query("""
        SELECT COALESCE(SUM(c.amountApproved), 0) FROM Claim c
        WHERE c.tenantId = :tenantId
        AND c.employeeId = :employeeId
        AND c.status = 'REIMBURSED'
        AND c.deletedAt IS NULL
        AND c.reimbursementDate >= :since
        """)
    BigDecimal sumReimbursedByEmployeeSince(UUID tenantId, UUID employeeId, java.time.LocalDate since);

    @Query("""
        SELECT c.type, COUNT(c), COALESCE(SUM(c.amountClaimed), 0)
        FROM Claim c
        WHERE c.tenantId = :tenantId
        AND c.deletedAt IS NULL
        GROUP BY c.type
        """)
    List<Object[]> aggregateClaimsByType(UUID tenantId);
}
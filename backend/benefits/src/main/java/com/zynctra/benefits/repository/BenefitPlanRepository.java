package com.zynctra.benefits.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.benefits.entity.BenefitPlan;

@Repository
public interface BenefitPlanRepository extends JpaRepository<BenefitPlan, UUID> {

    Page<BenefitPlan> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    Page<BenefitPlan> findByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, BenefitPlan.PlanStatus status, Pageable pageable);

    Optional<BenefitPlan> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);

    List<BenefitPlan> findByTenantIdAndTypeAndDeletedAtIsNull(
        UUID tenantId, BenefitPlan.PlanType type);

    boolean existsByTenantIdAndPlanCodeAndDeletedAtIsNull(UUID tenantId, String planCode);

    @Query("SELECT COUNT(b) FROM BenefitPlan b WHERE b.tenantId = :tenantId AND b.deletedAt IS NULL")
    long countByTenantIdAndDeletedAtIsNull(UUID tenantId);

    @Query("""
        SELECT b FROM BenefitPlan b
        WHERE b.tenantId = :tenantId
        AND b.deletedAt IS NULL
        AND b.status = 'ACTIVE'
        AND (b.effectiveDate IS NULL OR b.effectiveDate <= CURRENT_DATE)
        AND (b.expirationDate IS NULL OR b.expirationDate >= CURRENT_DATE)
        """)
    List<BenefitPlan> findActivePlansForEnrollment(UUID tenantId);
}
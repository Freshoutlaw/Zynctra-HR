package com.zynctra.learning.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.learning.entity.AdaptiveDefenseRule;

@Repository
public interface AdaptiveDefenseRuleRepository extends JpaRepository<AdaptiveDefenseRule, String> {

    List<AdaptiveDefenseRule> findByTenantId(String tenantId);

    List<AdaptiveDefenseRule> findByTenantIdAndActive(String tenantId, boolean active);

    Optional<AdaptiveDefenseRule> findByIdAndTenantId(String id, String tenantId);

    @Query("SELECT r FROM AdaptiveDefenseRule r WHERE r.tenantId = :tenantId AND r.active = true")
    List<AdaptiveDefenseRule> findActiveByTenantId(String tenantId);

    @Query("SELECT r FROM AdaptiveDefenseRule r WHERE r.active = true AND (r.expiresAt IS NULL OR r.expiresAt > :now)")
    List<AdaptiveDefenseRule> findAllActive(Instant now);
}

package com.zynctra.learning.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.learning.entity.ThreatIncident;

@Repository
public interface ThreatIncidentRepository extends JpaRepository<ThreatIncident, String> {

    List<ThreatIncident> findByTenantId(String tenantId);

    @Query("SELECT t FROM ThreatIncident t WHERE t.tenantId = :tenantId")
    Page<ThreatIncident> findByTenantId(String tenantId, Pageable pageable);

    Optional<ThreatIncident> findByIdAndTenantId(String id, String tenantId);

    @Query("SELECT t FROM ThreatIncident t WHERE t.processedForLearning = false AND t.timestamp >= :since")
    List<ThreatIncident> findRecentForLearning(Instant since);
}

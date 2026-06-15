package com.zynctra.securityadmin.repository;

import com.zynctra.securityadmin.entity.ThreatIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThreatIncidentRepository extends JpaRepository<ThreatIncident, String> {

    @Query("SELECT t FROM ThreatIncident t WHERE t.id = :id AND t.tenantId = :tenantId AND t.deleted = false")
    Optional<ThreatIncident> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT t FROM ThreatIncident t WHERE t.tenantId = :tenantId AND t.deleted = false ORDER BY t.detectedAt DESC")
    List<ThreatIncident> findAllByTenantId(@Param("tenantId") String tenantId);

    @Query("SELECT t FROM ThreatIncident t WHERE t.severity = :severity AND t.tenantId = :tenantId AND t.status != 'CLOSED' AND t.status != 'FALSE_POSITIVE' AND t.deleted = false ORDER BY t.detectedAt DESC")
    List<ThreatIncident> findOpenBySeverity(@Param("severity") ThreatIncident.ThreatSeverity severity,
                                             @Param("tenantId") String tenantId);

    @Query("SELECT t FROM ThreatIncident t WHERE t.status = :status AND t.tenantId = :tenantId AND t.deleted = false ORDER BY t.detectedAt DESC")
    List<ThreatIncident> findByStatus(@Param("status") ThreatIncident.ThreatStatus status,
                                       @Param("tenantId") String tenantId);

    @Query("SELECT t FROM ThreatIncident t WHERE t.detectedAt >= :since AND t.tenantId = :tenantId AND t.deleted = false ORDER BY t.detectedAt DESC")
    List<ThreatIncident> findRecent(@Param("since") Instant since, @Param("tenantId") String tenantId);

    @Query("SELECT COUNT(t) FROM ThreatIncident t WHERE t.status = 'OPEN' AND t.severity = 'CRITICAL' AND t.tenantId = :tenantId AND t.deleted = false")
    long countCriticalOpen(@Param("tenantId") String tenantId);
}
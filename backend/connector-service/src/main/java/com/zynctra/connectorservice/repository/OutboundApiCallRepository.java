package com.zynctra.connector.repository;

import com.zynctra.connector.entity.OutboundApiCall;
import com.zynctra.connector.entity.ConnectorType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Secure repository for outbound API call audit log.
 * 
 * SECURITY INVARIANTS:
 * - Append-only (no updates after creation except completion fields)
 * - Tenant-scoped for isolation
 * - Time-bounded queries
 */
@Repository
public interface OutboundApiCallRepository extends JpaRepository<OutboundApiCall, String> {

    /**
     * Find pending calls older than threshold (stuck job detection).
     */
    @Query("SELECT c FROM OutboundApiCall c " +
           "WHERE c.tenantId = :tenantId " +
           "AND c.callStatus = 'PENDING' " +
           "AND c.calledAt < :threshold")
    List<OutboundApiCall> findStuckCalls(
            @Param("tenantId") String tenantId,
            @Param("threshold") Instant threshold);

    /**
     * Find recent calls by connector type (monitoring).
     */
    @Query("SELECT c FROM OutboundApiCall c " +
           "WHERE c.tenantId = :tenantId " +
           "AND c.connectorType = :type " +
           "AND c.calledAt >= :since " +
           "ORDER BY c.calledAt DESC")
    List<OutboundApiCall> findRecentByType(
            @Param("tenantId") String tenantId,
            @Param("type") ConnectorType type,
            @Param("since") Instant since);

    /**
     * Count failed calls by type (circuit breaker trigger check).
     */
    @Query("SELECT COUNT(c) FROM OutboundApiCall c " +
           "WHERE c.tenantId = :tenantId " +
           "AND c.connectorType = :type " +
           "AND c.callStatus = 'FAILED' " +
           "AND c.calledAt >= :since")
    long countFailedByTypeSince(
            @Param("tenantId") String tenantId,
            @Param("type") ConnectorType type,
            @Param("since") Instant since);

    /**
     * Paged audit query.
     */
    @Query("SELECT c FROM OutboundApiCall c " +
           "WHERE c.tenantId = :tenantId " +
           "AND c.calledAt BETWEEN :start AND :end " +
           "ORDER BY c.calledAt DESC")
    Page<OutboundApiCall> findByTenantAndTimeRange(
            @Param("tenantId") String tenantId,
            @Param("start") Instant start,
            @Param("end") Instant end,
            Pageable pageable);

    // EXPLICITLY DISABLED:
    // - NO delete operations
    // - NO native queries
}
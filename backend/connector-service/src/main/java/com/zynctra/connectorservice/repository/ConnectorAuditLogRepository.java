package com.zynctra.connector.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zynctra.connectorservice.entity.ConnectorAuditLog;
import com.zynctra.connectorservice.entity.ConnectorAuditLog.AuditEventType;

/**
 * Secure repository for connector security audit logs.
 * 
 * SECURITY INVARIANTS:
 * - Append-only (no updates, no deletes)
 * - Tenant-scoped for isolation
 * - Time-bounded queries to prevent DoS
 * - Aggregated queries for anomaly detection
 */
@Repository
public interface ConnectorAuditLogRepository extends JpaRepository<ConnectorAuditLog, String> {

    /**
     * Find recent security events for tenant.
     */
    @Query("SELECT l FROM ConnectorAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.timestamp >= :since " +
           "ORDER BY l.timestamp DESC")
    List<ConnectorAuditLog> findRecentByTenant(
            @Param("tenantId") String tenantId,
            @Param("since") Instant since);

    /**
     * Find events by type (security monitoring).
     */
    @Query("SELECT l FROM ConnectorAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.eventType = :eventType " +
           "AND l.timestamp >= :since " +
           "ORDER BY l.timestamp DESC")
    List<ConnectorAuditLog> findByEventType(
            @Param("tenantId") String tenantId,
            @Param("eventType") AuditEventType eventType,
            @Param("since") Instant since);

    /**
     * Count failed auth events (brute force detection).
     */
    @Query("SELECT COUNT(l) FROM ConnectorAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.eventType IN ('WEBHOOK_SIGNATURE_INVALID', 'OAUTH_AUTHORIZATION_FAILED', 'OAUTH_STATE_REUSED') " +
           "AND l.timestamp >= :since")
    long countFailedAuthEvents(
            @Param("tenantId") String tenantId,
            @Param("since") Instant since);

    /**
     * Count events by actor (insider threat detection).
     */
    @Query("SELECT l.actor, COUNT(l) FROM ConnectorAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.timestamp >= :since " +
           "GROUP BY l.actor " +
           "HAVING COUNT(l) > :threshold")
    List<Object[]> findActorsWithHighEventCount(
            @Param("tenantId") String tenantId,
            @Param("since") Instant since,
            @Param("threshold") long threshold);

    /**
     * Find anomaly events (automated response trigger).
     */
    @Query("SELECT l FROM ConnectorAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.eventType = 'ANOMALY_DETECTED' " +
           "AND l.timestamp >= :since " +
           "ORDER BY l.timestamp DESC")
    List<ConnectorAuditLog> findAnomalies(
            @Param("tenantId") String tenantId,
            @Param("since") Instant since);

    /**
     * Paged audit query for compliance exports.
     */
    @Query("SELECT l FROM ConnectorAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.timestamp BETWEEN :start AND :end " +
           "ORDER BY l.timestamp DESC")
    Page<ConnectorAuditLog> findByTimeRange(
            @Param("tenantId") String tenantId,
            @Param("start") Instant start,
            @Param("end") Instant end,
            Pageable pageable);

    // EXPLICITLY DISABLED:
    // - NO delete operations (7-year retention required for compliance)
    // - NO update operations
    // - NO native queries
}
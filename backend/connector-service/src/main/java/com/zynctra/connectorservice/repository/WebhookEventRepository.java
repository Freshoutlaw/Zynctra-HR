package com.zynctra.connector.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zynctra.connectorservice.entity.ConnectorType;
import com.zynctra.connectorservice.entity.WebhookEvent;

/**
 * Secure repository for webhook event audit log.
 * 
 * SECURITY INVARIANTS:
 * - Append-only (no updates, no deletes)
 * - Tenant-scoped for isolation
 * - Deduplication via eventId + tenantId
 * - Time-bounded queries to prevent DoS
 */
@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, String> {

    /**
     * Find webhook event by eventId and tenant (deduplication check).
     */
    @Query("SELECT e FROM WebhookEvent e " +
           "WHERE e.eventId = :eventId AND e.tenantId = :tenantId")
    Optional<WebhookEvent> findByEventIdAndTenant(
            @Param("eventId") String eventId,
            @Param("tenantId") String tenantId);

    /**
     * Check if event was already processed (idempotency).
     */
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
           "FROM WebhookEvent e " +
           "WHERE e.eventId = :eventId AND e.tenantId = :tenantId")
    boolean existsByEventIdAndTenant(
            @Param("eventId") String eventId,
            @Param("tenantId") String tenantId);

    /**
     * Find recent webhook events for tenant (forensics).
     * Time-bounded to prevent unbounded result sets.
     */
    @Query("SELECT e FROM WebhookEvent e " +
           "WHERE e.tenantId = :tenantId " +
           "AND e.receivedAt >= :since " +
           "ORDER BY e.receivedAt DESC")
    List<WebhookEvent> findRecentByTenant(
            @Param("tenantId") String tenantId,
            @Param("since") Instant since);

    /**
     * Paged audit query with time bounds.
     */
    @Query("SELECT e FROM WebhookEvent e " +
           "WHERE e.tenantId = :tenantId " +
           "AND e.receivedAt BETWEEN :start AND :end " +
           "ORDER BY e.receivedAt DESC")
    Page<WebhookEvent> findByTenantAndTimeRange(
            @Param("tenantId") String tenantId,
            @Param("start") Instant start,
            @Param("end") Instant end,
            Pageable pageable);

    /**
     * Find failed webhooks for retry analysis.
     */
    @Query("SELECT e FROM WebhookEvent e " +
           "WHERE e.tenantId = :tenantId " +
           "AND e.processingStatus = 'FAILED' " +
           "AND e.receivedAt >= :since " +
           "ORDER BY e.receivedAt DESC")
    List<WebhookEvent> findFailedByTenantSince(
            @Param("tenantId") String tenantId,
            @Param("since") Instant since);

    /**
     * Count webhooks by provider and tenant (abuse detection).
     */
    @Query("SELECT COUNT(e) FROM WebhookEvent e " +
           "WHERE e.tenantId = :tenantId " +
           "AND e.connectorType = :type " +
           "AND e.receivedAt >= :since")
    long countByTenantAndTypeSince(
            @Param("tenantId") String tenantId,
            @Param("type") ConnectorType type,
            @Param("since") Instant since);

    // EXPLICITLY DISABLED:
    // - NO delete operations (append-only audit log)
    // - NO update operations
    // - NO native queries
}
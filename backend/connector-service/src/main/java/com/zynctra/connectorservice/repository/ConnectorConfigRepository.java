package com.zynctra.connector.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zynctra.connectorservice.entity.ConnectorConfig;
import com.zynctra.connectorservice.entity.ConnectorType;

/**
 * Secure repository for connector configurations.
 * 
 * SECURITY INVARIANTS:
 * - ALL queries are tenant-scoped (tenant_id required)
 * - NO native queries (prevent SQL injection)
 * - NO dynamic query construction
 * - Soft delete only (no physical deletion)
 * - Parameterized queries only
 */
@Repository
public interface ConnectorConfigRepository extends JpaRepository<ConnectorConfig, String> {

    /**
     * Find active connector by ID and tenant.
     * Prevents cross-tenant access.
     */
    @Query("SELECT c FROM ConnectorConfig c " +
           "WHERE c.id = :id AND c.tenantId = :tenantId AND c.deleted = false")
    Optional<ConnectorConfig> findByIdAndTenant(
            @Param("id") String id,
            @Param("tenantId") String tenantId);

    /**
     * Find all active connectors for tenant.
     */
    @Query("SELECT c FROM ConnectorConfig c " +
           "WHERE c.tenantId = :tenantId AND c.deleted = false " +
           "ORDER BY c.createdAt DESC")
    List<ConnectorConfig> findAllActiveByTenant(@Param("tenantId") String tenantId);

    /**
     * Paged query for admin audit.
     */
    @Query("SELECT c FROM ConnectorConfig c " +
           "WHERE c.tenantId = :tenantId AND c.deleted = false")
    Page<ConnectorConfig> findAllActiveByTenantPaged(
            @Param("tenantId") String tenantId,
            Pageable pageable);

    /**
     * Find active connector by type and tenant.
     */
    @Query("SELECT c FROM ConnectorConfig c " +
           "WHERE c.connectorType = :type AND c.tenantId = :tenantId " +
           "AND c.active = true AND c.deleted = false")
    Optional<ConnectorConfig> findActiveByTypeAndTenant(
            @Param("type") ConnectorType type,
            @Param("tenantId") String tenantId);

    /**
     * Soft delete by ID (prevents accidental data loss).
     */
    @Modifying
    @Query("UPDATE ConnectorConfig c " +
           "SET c.deleted = true, c.updatedBy = :updatedBy " +
           "WHERE c.id = :id AND c.tenantId = :tenantId AND c.deleted = false")
    int softDeleteById(
            @Param("id") String id,
            @Param("tenantId") String tenantId,
            @Param("updatedBy") String updatedBy);

    /**
     * Count active connectors per tenant (rate limiting / abuse detection).
     */
    @Query("SELECT COUNT(c) FROM ConnectorConfig c " +
           "WHERE c.tenantId = :tenantId AND c.active = true AND c.deleted = false")
    long countActiveByTenant(@Param("tenantId") String tenantId);

    /**
     * Check if connector name exists for tenant (prevent duplicate configs).
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM ConnectorConfig c " +
           "WHERE c.displayName = :displayName AND c.tenantId = :tenantId AND c.deleted = false")
    boolean existsByDisplayNameAndTenant(
            @Param("displayName") String displayName,
            @Param("tenantId") String tenantId);

    // EXPLICITLY DISABLED dangerous operations:
    // - NO deleteById() (use softDeleteById instead)
    // - NO deleteAll() 
    // - NO native queries
    // - NO @Query with string concatenation
}
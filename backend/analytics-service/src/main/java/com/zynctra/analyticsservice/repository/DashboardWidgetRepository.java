package com.zynctra.analytics.repository;

import com.zynctra.analytics.entity.DashboardWidget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Dashboard Widget Repository
 * 
 * Provides CRUD operations and custom queries for dashboard widgets.
 */
@Repository
public interface DashboardWidgetRepository extends JpaRepository<DashboardWidget, UUID> {

    /**
     * Finds all active widgets for a tenant, ordered by position.
     */
    List<DashboardWidget> findByTenantIdAndIsActiveTrueOrderByPositionYAscPositionXAsc(UUID tenantId);

    /**
     * Finds default widgets for a tenant.
     */
    List<DashboardWidget> findByTenantIdAndIsDefaultTrueAndIsActiveTrue(UUID tenantId);

    /**
     * Finds widgets accessible to a specific role or lower.
     */
    @Query("""
        SELECT w FROM DashboardWidget w 
        WHERE w.tenantId = :tenantId 
        AND w.isActive = true 
        AND (w.minRoleRequired IS NULL OR w.minRoleRequired <= :role)
        ORDER BY w.positionY, w.positionX
        """)
    List<DashboardWidget> findAccessibleByRole(UUID tenantId, com.zynctra.analytics.security.Role role);

    /**
     * Counts active widgets for a tenant.
     */
    long countByTenantIdAndIsActiveTrue(UUID tenantId);
}
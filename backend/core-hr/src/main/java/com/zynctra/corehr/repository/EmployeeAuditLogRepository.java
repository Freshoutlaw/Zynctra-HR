package com.zynctra.corehr.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zynctra.corehr.entity.EmployeeAuditLog;

@Repository
public interface EmployeeAuditLogRepository extends JpaRepository<EmployeeAuditLog, String> {

    @Query("SELECT l FROM EmployeeAuditLog l " +
           "WHERE l.tenantId = :tenantId AND l.employeeId = :employeeId " +
           "ORDER BY l.timestamp DESC")
    List<EmployeeAuditLog> findByEmployee(
            @Param("tenantId") String tenantId,
            @Param("employeeId") String employeeId);

    @Query("SELECT l FROM EmployeeAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.timestamp BETWEEN :start AND :end " +
           "ORDER BY l.timestamp DESC")
    Page<EmployeeAuditLog> findByTimeRange(
            @Param("tenantId") String tenantId,
            @Param("start") Instant start,
            @Param("end") Instant end,
            Pageable pageable);

    @Query("SELECT l FROM EmployeeAuditLog l " +
           "WHERE l.tenantId = :tenantId " +
           "AND l.action IN ('VIEWED_SENSITIVE', 'EXPORTED') " +
           "AND l.timestamp >= :since " +
           "ORDER BY l.timestamp DESC")
    List<EmployeeAuditLog> findSensitiveAccessEvents(
            @Param("tenantId") String tenantId,
            @Param("since") Instant since);

    // NO delete operations — 7-year retention
}
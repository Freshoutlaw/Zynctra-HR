package com.zynctra.payroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zynctra.payroll.entity.PayrollAuditLog;

@Repository
public interface PayrollAuditLogRepository extends JpaRepository<PayrollAuditLog, String> {

    @Query("SELECT l FROM PayrollAuditLog l WHERE l.tenantId = :tenantId AND l.payrollRunId = :runId ORDER BY l.timestamp DESC")
    List<PayrollAuditLog> findByPayrollRun(@Param("tenantId") String tenantId, @Param("runId") String runId);

    @Query("SELECT l FROM PayrollAuditLog l WHERE l.tenantId = :tenantId AND l.timestamp BETWEEN :start AND :end ORDER BY l.timestamp DESC")
    Page<PayrollAuditLog> findByTimeRange(@Param("tenantId") String tenantId, @Param("start") Instant start, 
                                           @Param("end") Instant end, Pageable pageable);

    @Query("SELECT l FROM PayrollAuditLog l WHERE l.tenantId = :tenantId AND l.action IN ('AMOUNT_ANOMALY', 'AFTER_HOURS_ACCESS') AND l.timestamp >= :since")
    List<PayrollAuditLog> findAnomalies(@Param("tenantId") String tenantId, @Param("since") Instant since);

    // NO delete, NO update — append-only financial audit
}


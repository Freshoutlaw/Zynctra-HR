package com.zynctra.payroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.zynctra.payroll.entity.PayRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface PayRecordRepository extends JpaRepository<PayRecord, String> {

    @Query("SELECT p FROM PayRecord p WHERE p.id = :id AND p.tenantId = :tenantId")
    Optional<PayRecord> findByIdAndTenant(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM PayRecord p WHERE p.payrollRunId = :runId AND p.tenantId = :tenantId")
    List<PayRecord> findByPayrollRun(@Param("runId") String runId, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM PayRecord p WHERE p.employeeId = :empId AND p.tenantId = :tenantId ORDER BY p.createdAt DESC")
    List<PayRecord> findByEmployee(@Param("empId") String empId, @Param("tenantId") String tenantId);

    @Query("SELECT SUM(p.grossPay), SUM(p.netPay), SUM(p.totalDeductions) FROM PayRecord p " +
           "WHERE p.payrollRunId = :runId AND p.tenantId = :tenantId")
    Object[] sumByPayrollRun(@Param("runId") String runId, @Param("tenantId") String tenantId);
    
        @Query("SELECT p FROM PayRecord p WHERE p.payrollRunId = :runId AND p.tenantId = :tenantId")
        List<PayRecord> findByPayrollRunId(@Param("runId") String runId, @Param("tenantId") String tenantId);

        @Query("SELECT p FROM PayRecord p WHERE p.employeeId = :empId AND p.tenantId = :tenantId ORDER BY p.createdAt DESC")
        List<PayRecord> findByEmployeeId(@Param("empId") String empId, @Param("tenantId") String tenantId);

        @Query("SELECT p FROM PayRecord p WHERE p.tenantId = :tenantId")
        Page<PayRecord> findByTenant(@Param("tenantId") String tenantId, Pageable pageable);

    // NO updates, NO deletes — append-only
}



package com.zynctra.payroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.zynctra.payroll.entity.TaxRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaxRecordRepository extends JpaRepository<TaxRecord, String> {

    @Query("SELECT t FROM TaxRecord t WHERE t.id = :id AND t.tenantId = :tenantId")
    Optional<TaxRecord> findByIdAndTenant(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT t FROM TaxRecord t WHERE t.payrollRunId = :runId AND t.tenantId = :tenantId")
    List<TaxRecord> findByPayrollRun(@Param("runId") String runId, @Param("tenantId") String tenantId);

    @Query("SELECT t FROM TaxRecord t WHERE t.employeeId = :empId AND t.tenantId = :tenantId ORDER BY t.createdAt DESC")
    List<TaxRecord> findByEmployee(@Param("empId") String empId, @Param("tenantId") String tenantId);
}


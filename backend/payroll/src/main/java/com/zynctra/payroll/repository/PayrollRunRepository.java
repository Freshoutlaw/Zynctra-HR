package com.zynctra.payroll.repository;

import com.zynctra.payroll.entity.PayrollRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PayrollRunRepository extends JpaRepository<PayrollRun, String> {
    Page<PayrollRun> findByTenantIdAndDeletedAtIsNull(String tenantId, Pageable pageable);
    Page<PayrollRun> findByTenantIdAndEmployeeIdAndDeletedAtIsNull(String tenantId, String employeeId, Pageable pageable);
    Optional<PayrollRun> findByEmployeeIdAndPeriodStartDateAndPeriodEndDateAndDeletedAtIsNull(String employeeId, LocalDate start, LocalDate end);
}

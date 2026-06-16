package com.zynctra.payroll.service;

import com.zynctra.common.security.TenantContext;
import com.zynctra.hr.entity.Employee;
import com.zynctra.hr.entity.EmploymentStatus;
import com.zynctra.hr.repository.EmployeeRepository;
import com.zynctra.payroll.entity.PayrollStatus;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private static final Logger log = LoggerFactory.getLogger(PayrollService.class);
    private final EmployeeRepository employeeRepository;
    private final PayrollCalculationService calculationService;

    /**
     * Processes a full payroll run for all active employees in the current tenant.
     */
    @Transactional
    public void runPayroll(UUID payrollRunId) {
        String tenantId = TenantContext.getCurrentTenant();
        log.info("Starting payroll run {} for tenant {}", payrollRunId, tenantId);

        // Fetch all active employees for this tenant
        List<Employee> employees = employeeRepository.findByTenantId(tenantId).stream()
                .filter(e -> e.getStatus() == EmploymentStatus.ACTIVE)
                .toList();

        for (Employee employee : employees) {
            // Placeholder: In real flow, fetch these from time-attendance and benefits services
            BigDecimal otHours = BigDecimal.ZERO;
            BigDecimal bonuses = BigDecimal.ZERO;
            Map<String, BigDecimal> deductions = new HashMap<>(); 
            deductions.put("PRE_TAX", new BigDecimal("100.00")); // e.g., Fixed 401k

            var result = calculationService.calculate(employee, otHours, bonuses, deductions);
            
            log.debug("Processed Employee {}: Gross: {}, Net: {}", 
                employee.getId(), result.getGrossPay(), result.getNetPay());

            // Save Payslip entities here
        }
        
        log.info("Payroll run {} completed for {} employees", payrollRunId, employees.size());
    }
}

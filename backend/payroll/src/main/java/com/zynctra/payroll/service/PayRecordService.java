package com.zynctra.payroll.service;

import com.zynctra.common.security.TenantContext;
import com.zynctra.payroll.dto.CreatePayRecordRequest;
import com.zynctra.payroll.entity.PayRecord;
import com.zynctra.payroll.repository.PayRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PayRecordService {

    private static final Logger log = LoggerFactory.getLogger(PayRecordService.class);
    private final PayRecordRepository payRecordRepository;

    public PayRecordService(PayRecordRepository payRecordRepository) {
        this.payRecordRepository = payRecordRepository;
    }

    @Transactional
    public PayRecord createPayRecord(CreatePayRecordRequest request) {
        String currentUser = getCurrentUser();
        
        PayRecord payRecord = PayRecord.create(
            request.getPayrollRunId(),
            request.getEmployeeId(),
            request.getGrossPay(),
            request.getNetPay(),
            "", // bankAccountId - will be set separately
            "Payroll calculation", // calculationFormula
            currentUser
        );
        
        log.info("Created pay record {} for employee {}", payRecord.getId(), request.getEmployeeId());
        return payRecordRepository.save(payRecord);
    }

    @Transactional(readOnly = true)
    public Optional<PayRecord> getPayRecord(String id) {
        String tenantId = TenantContext.getCurrentTenant();
        return payRecordRepository.findByIdAndTenant(id, tenantId);
    }

    @Transactional(readOnly = true)
    public Page<PayRecord> listPayRecords(Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        return payRecordRepository.findByTenant(tenantId, pageable);
    }

    @Transactional(readOnly = true)
    public List<PayRecord> getEmployeePayHistory(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        return payRecordRepository.findByEmployeeId(employeeId, tenantId);
    }

    @Transactional(readOnly = true)
    public List<PayRecord> getPayRecordsByRun(String runId) {
        String tenantId = TenantContext.getCurrentTenant();
        return payRecordRepository.findByPayrollRunId(runId, tenantId);
    }

    @Transactional(readOnly = true)
    public List<PayRecord> getPayRecordsByEmployee(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        return payRecordRepository.findByEmployeeId(employeeId, tenantId);
    }

    private String getCurrentUser() {
        return TenantContext.getUserId() != null ? TenantContext.getUserId() : "SYSTEM";
    }
}

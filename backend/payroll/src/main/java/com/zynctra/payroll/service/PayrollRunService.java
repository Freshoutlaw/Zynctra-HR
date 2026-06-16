package com.zynctra.payroll.service;

import com.zynctra.common.security.TenantContext;
import com.zynctra.payroll.dto.CreatePayrollRunRequest;
import com.zynctra.payroll.dto.ApprovePayrollRequest;
import com.zynctra.payroll.entity.PayrollRun;
import com.zynctra.payroll.entity.PayrollRun.PayrollStatus;
import com.zynctra.payroll.repository.PayrollRunRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PayrollRunService {

    private static final Logger log = LoggerFactory.getLogger(PayrollRunService.class);
    private final PayrollRunRepository payrollRunRepository;

    public PayrollRunService(PayrollRunRepository payrollRunRepository) {
        this.payrollRunRepository = payrollRunRepository;
    }

    @Transactional
    public PayrollRun createPayrollRun(CreatePayrollRunRequest request) {
        String currentUser = getCurrentUser();
        
        PayrollRun payrollRun = PayrollRun.create(
            request.getPayrollRunNumber(),
            request.getPayPeriodStart(),
            request.getPayPeriodEnd(),
            request.getPayDate(),
            request.getRunType(),
            request.getIdempotencyKey(),
            currentUser
        );
        
        log.info("Created payroll run {} for period {}-{}", 
            payrollRun.getId(), request.getPayPeriodStart(), request.getPayPeriodEnd());
        return payrollRunRepository.save(payrollRun);
    }

    @Transactional
    public PayrollRun calculatePayroll(String runId) {
        String tenantId = TenantContext.getCurrentTenant();
        String currentUser = getCurrentUser();
        
        PayrollRun payrollRun = payrollRunRepository
            .findByIdAndTenant(runId, tenantId)
            .orElseThrow(() -> new RuntimeException("Payroll run not found: " + runId));
        
        payrollRun.transitionTo(PayrollStatus.REVIEW, currentUser);
        log.info("Calculated payroll run {}", runId);
        return payrollRunRepository.save(payrollRun);
    }

    @Transactional
    public PayrollRun approvePayroll(String runId, ApprovePayrollRequest request) {
        String tenantId = TenantContext.getCurrentTenant();
        String currentUser = getCurrentUser();
        
        PayrollRun payrollRun = payrollRunRepository
            .findByIdAndTenant(runId, tenantId)
            .orElseThrow(() -> new RuntimeException("Payroll run not found: " + runId));
        
        payrollRun.transitionTo(PayrollStatus.APPROVED, currentUser);
        log.info("Approved payroll run {} by {}", runId, currentUser);
        return payrollRunRepository.save(payrollRun);
    }

    @Transactional
    public PayrollRun disbursePayroll(String runId) {
        String tenantId = TenantContext.getCurrentTenant();
        String currentUser = getCurrentUser();
        
        PayrollRun payrollRun = payrollRunRepository
            .findByIdAndTenant(runId, tenantId)
            .orElseThrow(() -> new RuntimeException("Payroll run not found: " + runId));
        
        payrollRun.transitionTo(PayrollStatus.DISBURSED, currentUser);
        log.info("Disbursed payroll run {}", runId);
        return payrollRunRepository.save(payrollRun);
    }

    @Transactional
    public PayrollRun reconcilePayroll(String runId) {
        String tenantId = TenantContext.getCurrentTenant();
        String currentUser = getCurrentUser();
        
        PayrollRun payrollRun = payrollRunRepository
            .findByIdAndTenant(runId, tenantId)
            .orElseThrow(() -> new RuntimeException("Payroll run not found: " + runId));
        
        payrollRun.transitionTo(PayrollStatus.RECONCILED, currentUser);
        log.info("Reconciled payroll run {}", runId);
        return payrollRunRepository.save(payrollRun);
    }

    @Transactional
    public void cancelPayroll(String runId, String reason) {
        String tenantId = TenantContext.getCurrentTenant();
        String currentUser = getCurrentUser();
        
        PayrollRun payrollRun = payrollRunRepository
            .findByIdAndTenant(runId, tenantId)
            .orElseThrow(() -> new RuntimeException("Payroll run not found: " + runId));
        
        payrollRun.transitionTo(PayrollStatus.CANCELLED, currentUser);
        log.info("Cancelled payroll run {} - Reason: {}", runId, reason);
        payrollRunRepository.save(payrollRun);
    }

    @Transactional(readOnly = true)
    public Optional<PayrollRun> getPayrollRun(String id) {
        String tenantId = TenantContext.getCurrentTenant();
        return payrollRunRepository.findByIdAndTenant(id, tenantId);
    }

    @Transactional(readOnly = true)
    public Page<PayrollRun> listPayrollRuns(Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        return payrollRunRepository.findByTenant(tenantId, pageable);
    }

    @Transactional(readOnly = true)
    public List<PayrollRun> getPayrollRunsByStatus(PayrollStatus status) {
        String tenantId = TenantContext.getCurrentTenant();
        return payrollRunRepository.findByStatus(tenantId, status);
    }

    private String getCurrentUser() {
        return TenantContext.getUserId() != null ? TenantContext.getUserId() : "SYSTEM";
    }
}

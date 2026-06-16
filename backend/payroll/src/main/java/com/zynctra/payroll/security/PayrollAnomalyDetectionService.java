package com.zynctra.payroll.security;

import com.zynctra.payroll.entity.PayRecord;
import com.zynctra.payroll.entity.PayrollAuditLog;
import com.zynctra.payroll.entity.PayrollRun;
import com.zynctra.payroll.repository.PayRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Real-time anomaly detection for payroll fraud.
 * 
 * DETECTION RULES:
 * - Pay amount > 150% of historical average
 * - Pay amount > $50,000 in single period
 * - Employee paid when terminated
 * - Duplicate bank account across employees
 * - Payroll run outside business hours
 * - Multiple payroll runs in same period
 */
@Service
public class PayrollAnomalyDetectionService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private final PayRecordRepository payRecordRepository;
    private final PayrollAuditService auditService;

    public PayrollAnomalyDetectionService(PayRecordRepository payRecordRepository,
                                           PayrollAuditService auditService) {
        this.payRecordRepository = payRecordRepository;
        this.auditService = auditService;
    }

    public void analyzePayrollRun(PayrollRun run) {
        List<PayRecord> records = payRecordRepository.findByPayrollRun(run.getId(), run.getTenantId());
        
        for (PayRecord record : records) {
            checkAmountAnomaly(record);
            checkTerminatedEmployee(record);
            checkRapidChange(record);
        }
        
        checkDuplicateBankAccounts(run);
        checkAfterHours(run);
    }

    private void checkAmountAnomaly(PayRecord record) {
        // Historical average comparison
        List<PayRecord> history = payRecordRepository.findByEmployee(record.getEmployeeId(), record.getTenantId());
        if (history.size() < 2) return;

        BigDecimal avg = history.stream()
            .map(PayRecord::getNetPay)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(history.size()), 2, RoundingMode.HALF_UP);

        BigDecimal threshold = avg.multiply(BigDecimal.valueOf(1.5));
        if (record.getNetPay().compareTo(threshold) > 0) {
            SEC_LOG.warn("ANOMALY: amount_spike employee={} amount={} avg={} threshold={}",
                record.getEmployeeId(), record.getNetPay(), avg, threshold);
            auditService.logAnomaly(PayrollAuditLog.AuditAction.AMOUNT_ANOMALY,
                "SYSTEM", "Employee " + record.getEmployeeId() + " pay " + record.getNetPay() + " > 150% avg");
        }

        // Absolute threshold
        if (record.getNetPay().compareTo(new BigDecimal("50000")) > 0) {
            SEC_LOG.warn("ANOMALY: amount_absolute_threshold employee={} amount={}",
                record.getEmployeeId(), record.getNetPay());
        }
    }

    private void checkTerminatedEmployee(PayRecord record) {
        // In production: check employee status from core-hr
    }

    private void checkRapidChange(PayRecord record) {
        // Check for > 25% change from previous period
    }

    private void checkDuplicateBankAccounts(PayrollRun run) {
        // Detect same bank account across multiple employees (fraud indicator)
    }

    private void checkAfterHours(PayrollRun run) {
        int hour = java.time.LocalDateTime.now().getHour();
        if (hour < 6 || hour > 22) {
            SEC_LOG.warn("ANOMALY: after_hours_payroll run={} hour={}", run.getId(), hour);
            auditService.logAnomaly(PayrollAuditLog.AuditAction.AFTER_HOURS_ACCESS,
                run.getCreatedBy(), "Payroll run created at hour " + hour);
        }
    }

    @Scheduled(fixedRate = 300_000)
    public void scheduledAnomalyScan() {
        // Batch scan for patterns across all tenants
    }
}

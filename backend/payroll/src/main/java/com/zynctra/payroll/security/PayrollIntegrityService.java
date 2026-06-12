package com.zynctra.payroll.security;

import com.zynctra.payroll.entity.PayRecord;
import com.zynctra.payroll.entity.PayrollRun;
import com.zynctra.payroll.repository.PayRecordRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.List;

/**
 * Cryptographic integrity verification for payroll runs.
 * Detects tampering after approval.
 */
@Service
public class PayrollIntegrityService {

    private final PayRecordRepository payRecordRepository;

    public PayrollIntegrityService(PayRecordRepository payRecordRepository) {
        this.payRecordRepository = payRecordRepository;
    }

    public String computeRunHash(PayrollRun run) {
        List<<PayRecord> records = payRecordRepository.findByPayrollRun(run.getId(), run.getTenantId());
        
        StringBuilder data = new StringBuilder();
        data.append(run.getId()).append("|");
        data.append(run.getPayPeriodStart()).append("|");
        data.append(run.getPayPeriodEnd()).append("|");
        data.append(run.getTotalGross()).append("|");
        data.append(run.getTotalNet()).append("|");
        
        for (PayRecord record : records) {
            data.append(record.getRecordHash()).append("|");
        }

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Base64.getEncoder().encodeToString(
                digest.digest(data.toString().getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new SecurityException("Hash computation failed", e);
        }
    }

    public boolean verifyRunIntegrity(PayrollRun run) {
        if (run.getApprovalHash() == null) return false;
        String currentHash = computeRunHash(run);
        return MessageDigest.isEqual(
            run.getApprovalHash().getBytes(StandardCharsets.UTF_8),
            currentHash.getBytes(StandardCharsets.UTF_8)
        );
    }
}
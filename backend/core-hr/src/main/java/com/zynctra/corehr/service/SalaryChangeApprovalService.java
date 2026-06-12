package com.zynctra.corehr.service;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.corehr.entity.Employee;
import com.zynctra.corehr.entity.EmployeeAuditLog;
import com.zynctra.corehr.repository.EmployeeRepository;
import com.zynctra.corehr.security.PiiEncryptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Separation of duties: salary changes require approval workflow.
 * 
 * SECURITY INVARIANTS:
 * - Requester cannot approve their own request
 * - Two-person rule for salary modifications
 * - Audit trail for request + approval
 * - Encrypted salary stored only after approval
 */
@Service
public class SalaryChangeApprovalService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    private final EmployeeRepository employeeRepository;
    private final PiiEncryptionService encryptionService;
    private final EmployeeAuditService auditService;
    
    // In production: use Redis/database. Here: in-memory for simplicity
    private final Map<String, SalaryChangeRequest> pendingApprovals = new ConcurrentHashMap<>();

    public SalaryChangeApprovalService(EmployeeRepository employeeRepository,
                                       PiiEncryptionService encryptionService,
                                       EmployeeAuditService auditService) {
        this.employeeRepository = employeeRepository;
        this.encryptionService = encryptionService;
        this.auditService = auditService;
    }

    @Transactional
    public String requestSalaryChange(String employeeId, BigDecimal newSalary, String reason, String requester) {
        String tenantId = TenantContext.getCurrentTenant();
        
        Employee emp = employeeRepository.findByIdAndTenant(employeeId, tenantId)
            .orElseThrow(() -> new SecurityException("Employee not found"));

        String requestId = UUID.randomUUID().toString();
        pendingApprovals.put(requestId, new SalaryChangeRequest(
            requestId, employeeId, newSalary, reason, requester, Instant.now()
        ));

        auditService.log(employeeId, EmployeeAuditLog.AuditAction.UPDATED,
            "salary", encryptionService.decrypt(emp.getSalaryEncrypted()), 
            newSalary.toString(), "Salary change requested by " + requester + ": " + reason,
            requester, "unknown", "HR");

        SEC_LOG.info("SECURITY_EVENT: salary_change_requested request_id={} employee={} requester={}", 
            requestId, employeeId, requester);

        return requestId;
    }

    @Transactional
    public void approveSalaryChange(String requestId, String approver) {
        String tenantId = TenantContext.getCurrentTenant();
        
        SalaryChangeRequest req = pendingApprovals.get(requestId);
        if (req == null) {
            throw new SecurityException("Approval request not found or expired");
        }

        // Two-person rule: requester cannot approve
        if (req.requester().equals(approver)) {
            SEC_LOG.warn("SECURITY_EVENT: self_approval_blocked request_id={} requester={}", 
                requestId, approver);
            throw new SecurityException("Self-approval not allowed");
        }

        Employee emp = employeeRepository.findByIdAndTenant(req.employeeId(), tenantId)
            .orElseThrow(() -> new SecurityException("Employee not found"));

        String oldSalary = encryptionService.decrypt(emp.getSalaryEncrypted());
        String encryptedNewSalary = encryptionService.encrypt(req.newSalary().toString(), tenantId);
        
        emp.setSalaryEncrypted(encryptedNewSalary);
        emp.setUpdatedBy(approver);
        employeeRepository.save(emp);

        pendingApprovals.remove(requestId);

        auditService.log(req.employeeId(), EmployeeAuditLog.AuditAction.UPDATED,
            "salary", oldSalary, req.newSalary().toString(),
            "Salary change approved by " + approver + ". Original request: " + req.reason(),
            approver, "unknown", "ADMIN");

        SEC_LOG.info("SECURITY_EVENT: salary_change_approved request_id={} employee={} approver={}", 
            requestId, req.employeeId(), approver);
    }

    public void rejectSalaryChange(String requestId, String approver, String reason) {
        SalaryChangeRequest req = pendingApprovals.remove(requestId);
        if (req == null) return;

        auditService.log(req.employeeId(), EmployeeAuditLog.AuditAction.UPDATED,
            "salary", null, null,
            "Salary change rejected by " + approver + ": " + reason,
            approver, "unknown", "ADMIN");
    }

    private record SalaryChangeRequest(
        String requestId,
        String employeeId,
        BigDecimal newSalary,
        String reason,
        String requester,
        Instant requestedAt
    ) {}
}
package com.zynctra.payroll.security;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

/**
 * Enforces separation of duties for payroll operations.
 * 
 * RULES:
 * - Creator cannot approve
 * - Approver cannot disburse
 * - Disburser must be different from approver
 * - Minimum 2 people for any financial transaction
 */
@Service
public class SeparationOfDutiesService {

    private final Map<String, PayrollActionLog> actionLog = new ConcurrentHashMap<>();

    public void recordAction(String payrollRunId, String actor, ActionType action) {
        actionLog.put(payrollRunId + ":" + action, new PayrollActionLog(actor, action));
    }

    public void validateApproval(String payrollRunId, String approver) {
        PayrollActionLog createLog = actionLog.get(payrollRunId + ":" + ActionType.CREATE);
        if (createLog != null && createLog.actor().equals(approver)) {
            throw new SecurityException("Creator cannot approve their own payroll run");
        }
    }

    public void validateDisbursement(String payrollRunId, String disburser) {
        PayrollActionLog approveLog = actionLog.get(payrollRunId + ":" + ActionType.APPROVE);
        if (approveLog != null && approveLog.actor().equals(disburser)) {
            throw new SecurityException("Approver cannot disburse their own approved payroll");
        }
        PayrollActionLog createLog = actionLog.get(payrollRunId + ":" + ActionType.CREATE);
        if (createLog != null && createLog.actor().equals(disburser)) {
            throw new SecurityException("Creator cannot disburse their own payroll run");
        }
    }

    public void validateReconciliation(String payrollRunId, String reconciler) {
        // Reconciler must be different from all previous actors
        Set<String> previousActors = Set.of(
            actionLog.getOrDefault(payrollRunId + ":" + ActionType.CREATE, new PayrollActionLog("", null)).actor(),
            actionLog.getOrDefault(payrollRunId + ":" + ActionType.APPROVE, new PayrollActionLog("", null)).actor(),
            actionLog.getOrDefault(payrollRunId + ":" + ActionType.DISBURSE, new PayrollActionLog("", null)).actor()
        );
        if (previousActors.contains(reconciler)) {
            throw new SecurityException("Reconciler must be independent from previous actions");
        }
    }

    public enum ActionType { CREATE, CALCULATE, APPROVE, DISBURSE, RECONCILE, CANCEL }

    private record PayrollActionLog(String actor, ActionType action) {}
}
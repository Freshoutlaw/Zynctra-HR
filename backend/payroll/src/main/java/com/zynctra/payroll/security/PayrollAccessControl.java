package com.zynctra.payroll.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class PayrollAccessControl {

    public PayrollAccessDecision evaluate() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return new PayrollAccessDecision(
            hasRole(auth, "PAYROLL_ADMIN"),
            hasRole(auth, "PAYROLL_PROCESSOR"),
            hasRole(auth, "PAYROLL_APPROVER"),
            hasRole(auth, "FINANCE"),
            hasRole(auth, "HR"),
            hasRole(auth, "ADMIN")
        );
    }

    public boolean canCreatePayroll(PayrollAccessDecision d) {
        return d.payrollAdmin() || d.payrollProcessor();
    }

    public boolean canCalculate(PayrollAccessDecision d) {
        return d.payrollAdmin() || d.payrollProcessor();
    }

    public boolean canApprove(PayrollAccessDecision d) {
        return d.payrollAdmin() || d.payrollApprover();
    }

    public boolean canDisburse(PayrollAccessDecision d) {
        return d.payrollAdmin(); // Only admin can trigger actual payments
    }

    public boolean canViewPayRecords(PayrollAccessDecision d, String employeeId) {
        String principalId = getPrincipalId();
        boolean isSelf = employeeId.equals(principalId);
        return d.payrollAdmin() || d.payrollProcessor() || d.hr() || d.admin() || isSelf;
    }

    public boolean canModifyBankAccount(PayrollAccessDecision d, String employeeId) {
        String principalId = getPrincipalId();
        boolean isSelf = employeeId.equals(principalId);
        return d.payrollAdmin() || d.hr() || isSelf; // Self can add, admin/HR can modify
    }

    public boolean canExportReports(PayrollAccessDecision d) {
        return d.payrollAdmin() || d.finance() || d.admin();
    }

    public boolean canViewTaxRecords(PayrollAccessDecision d) {
        return d.payrollAdmin() || d.finance() || d.admin();
    }

    private boolean hasRole(Authentication auth, String role) {
        return auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    private String getPrincipalId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getDetails();
    }
}

record PayrollAccessDecision(
    boolean payrollAdmin,
    boolean payrollProcessor,
    boolean payrollApprover,
    boolean finance,
    boolean hr,
    boolean admin
) {}

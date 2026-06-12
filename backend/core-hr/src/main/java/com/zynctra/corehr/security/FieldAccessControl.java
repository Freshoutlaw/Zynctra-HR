package com.zynctra.corehr.security;

import com.zynctra.corehr.entity.Employee;
import com.zynctra.corehr.repository.EmployeeRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Attribute-Based Access Control (ABAC) for employee data.
 * Determines which fields a principal can view/modify.
 */
@Component
public class FieldAccessControl {

    private final EmployeeRepository employeeRepository;

    public FieldAccessControl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public AccessDecision evaluateAccess(String targetEmployeeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String principalId = getPrincipalId(auth);
        String tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        
        boolean isSelf = targetEmployeeId.equals(principalId);
        boolean isManager = isManagerOf(principalId, targetEmployeeId, tenantId);
        boolean isHr = hasRole(auth, "HR");
        boolean isAdmin = hasRole(auth, "ADMIN");
        boolean isFinance = hasRole(auth, "FINANCE");
        boolean isDirectorPlus = hasRole(auth, "DIRECTOR") || hasRole(auth, "VP") || hasRole(auth, "C_LEVEL");

        return new AccessDecision(isSelf, isManager, isHr, isAdmin, isFinance, isDirectorPlus);
    }

    public boolean isManagerOf(String managerId, String employeeId, String tenantId) {
        if (managerId == null || employeeId == null) return false;
        String currentId = employeeId;
        int depth = 0;
        while (currentId != null && depth < 10) {
            Employee emp = employeeRepository.findByIdAndTenant(currentId, tenantId).orElse(null);
            if (emp == null) return false;
            if (managerId.equals(emp.getManagerId())) return true;
            currentId = emp.getManagerId();
            depth++;
        }
        return false;
    }

    public boolean canViewSsn(AccessDecision decision) {
        return decision.isHr() || decision.isAdmin();
    }

    public boolean canViewSalary(AccessDecision decision) {
        return decision.isSelf() || decision.isManager() || decision.isHr() || decision.isAdmin() || decision.isFinance();
    }

    public boolean canViewBankAccount(AccessDecision decision) {
        return decision.isSelf() || decision.isHr() || decision.isAdmin() || decision.isFinance();
    }

    public boolean canViewFullDob(AccessDecision decision) {
        return decision.isSelf() || decision.isManager() || decision.isHr() || decision.isAdmin();
    }

    public boolean canModifyEmploymentStatus(AccessDecision decision) {
        return decision.isHr() || decision.isAdmin();
    }

    public boolean canModifySalary(AccessDecision decision) {
        return decision.isAdmin() || (decision.isHr() && decision.isDirectorPlus());
    }

    public boolean canModifyDepartment(AccessDecision decision) {
        return decision.isManager() || decision.isHr() || decision.isAdmin();
    }

    public boolean canTerminate(AccessDecision decision) {
        return decision.isHr() || decision.isAdmin();
    }

    private boolean hasRole(Authentication auth, String role) {
        return auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    private String getPrincipalId(Authentication auth) {
        return (String) auth.getDetails();
    }
}
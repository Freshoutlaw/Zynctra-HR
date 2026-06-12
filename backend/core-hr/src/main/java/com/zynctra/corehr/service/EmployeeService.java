package com.zynctra.corehr.service;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.common.validation.SecureInputValidator;
import com.zynctra.corehr.dto.CreateEmployeeRequest;
import com.zynctra.corehr.dto.EmployeeResponse;
import com.zynctra.corehr.dto.UpdateEmployeeRequest;
import com.zynctra.corehr.entity.Employee;
import com.zynctra.corehr.entity.EmployeeAuditLog;
import com.zynctra.corehr.repository.DepartmentRepository;
import com.zynctra.corehr.repository.EmployeeRepository;
import com.zynctra.corehr.security.AccessDecision;
import com.zynctra.corehr.security.FieldAccessControl;
import com.zynctra.corehr.security.PiiEncryptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class EmployeeService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeAuditService auditService;
    private final PiiEncryptionService encryptionService;
    private final FieldAccessControl accessControl;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           EmployeeAuditService auditService,
                           PiiEncryptionService encryptionService,
                           FieldAccessControl accessControl) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.auditService = auditService;
        this.encryptionService = encryptionService;
        this.accessControl = accessControl;
    }

    // ========== CREATE ==========

    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        String tenantId = TenantContext.getCurrentTenant();
        String actor = getCurrentUser();
        String actorRole = getCurrentRole();

        // Validate all inputs
        validateCreateRequest(request);

        // Check duplicates
        if (employeeRepository.existsByEmailAndTenant(request.getEmail(), tenantId)) {
            throw new IllegalArgumentException("Email already exists in tenant");
        }
        if (employeeRepository.existsByEmployeeNumberAndTenant(request.getEmployeeNumber(), tenantId)) {
            throw new IllegalArgumentException("Employee number already exists");
        }

        Employee emp = Employee.create(
            request.getEmployeeNumber(),
            request.getFirstName(),
            request.getLastName(),
            request.getEmail(),
            request.getDepartmentId(),
            request.getJobTitle(),
            request.getHireDate(),
            actor
        );
        emp.setPhone(request.getPhone());
        emp.setDateOfBirth(request.getDateOfBirth());

        employeeRepository.save(emp);

        auditService.log(emp.getId(), EmployeeAuditLog.AuditAction.CREATED,
            null, null, null, "Employee created", actor, getClientIp(), actorRole);

        return buildResponse(emp, accessControl.evaluateAccess(emp.getId()));
    }

    // ========== READ (IDOR PROTECTED) ==========

    public EmployeeResponse getEmployee(String id) {
        String tenantId = TenantContext.getCurrentTenant();
        String actor = getCurrentUser();
        String actorRole = getCurrentRole();

        // IDOR protection: verify tenant matches
        Employee emp = employeeRepository.findByIdAndTenant(id, tenantId)
            .orElseThrow(() -> {
                SEC_LOG.warn("SECURITY_EVENT: idor_attempt actor={} target_id={}", actor, id);
                return new AccessDeniedException("Employee not found");
            });

        AccessDecision decision = accessControl.evaluateAccess(id);

        // Audit sensitive views
        if (accessControl.canViewSalary(decision)) {
            auditService.logSensitiveView(id, "salary", actor, getClientIp(), actorRole);
        }
        if (accessControl.canViewSsn(decision)) {
            auditService.logSensitiveView(id, "ssn", actor, getClientIp(), actorRole);
        }

        return buildResponse(emp, decision);
    }

    // ========== SEARCH (PAGINATION ENFORCED) ==========

    public Page<EmployeeResponse> searchEmployees(String search, String deptId, 
                                                   Employee.EmploymentStatus status, 
                                                   Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();

        if (search != null) {
            search = SecureInputValidator.sanitizeGeneralText(search);
            if (search.length() > 100) throw new IllegalArgumentException("Search too long");
        }

        // Pageable already secured by SecurePageableResolver
        Page<Employee> results = employeeRepository.searchEmployees(
            tenantId, search, deptId, status, pageable);

        return results.map(emp -> buildResponse(emp, 
            new AccessDecision(false, false, false, false, false, false)));
    }

    // ========== UPDATE (ANTI-MASS-ASSIGNMENT) ==========

    @Transactional
    public EmployeeResponse updateEmployee(String id, UpdateEmployeeRequest request) {
        String tenantId = TenantContext.getCurrentTenant();
        String actor = getCurrentUser();
        String actorRole = getCurrentRole();

        // IDOR protection
        Employee emp = employeeRepository.findByIdAndTenant(id, tenantId)
            .orElseThrow(() -> new AccessDeniedException("Employee not found"));

        AccessDecision decision = accessControl.evaluateAccess(id);

        // Authorization check
        if (!decision.self() && !decision.manager() && !decision.hr() && !decision.admin()) {
            SEC_LOG.warn("SECURITY_EVENT: unauthorized_update actor={} target={}", actor, id);
            throw new AccessDeniedException("Insufficient privileges");
        }

        // WHITELISTED updates only — no mass assignment
        if (request.getFirstName() != null && (decision.self() || decision.manager() || decision.hr() || decision.admin())) {
            String old = emp.getFirstName();
            emp.setFirstName(request.getFirstName());
            auditService.log(id, EmployeeAuditLog.AuditAction.UPDATED, "firstName", old, request.getFirstName(), 
                "Name updated", actor, getClientIp(), actorRole);
        }

        if (request.getLastName() != null && (decision.self() || decision.manager() || decision.hr() || decision.admin())) {
            String old = emp.getLastName();
            emp.setLastName(request.getLastName());
            auditService.log(id, EmployeeAuditLog.AuditAction.UPDATED, "lastName", old, request.getLastName(),
                "Name updated", actor, getClientIp(), actorRole);
        }

        if (request.getPhone() != null && (decision.self() || decision.manager() || decision.hr() || decision.admin())) {
            String old = emp.getPhone();
            emp.setPhone(request.getPhone());
            auditService.log(id, EmployeeAuditLog.AuditAction.UPDATED, "phone", old, request.getPhone(),
                "Phone updated", actor, getClientIp(), actorRole);
        }

        if (request.getJobTitle() != null && (decision.manager() || decision.hr() || decision.admin())) {
            String old = emp.getJobTitle();
            emp.setJobTitle(request.getJobTitle());
            auditService.log(id, EmployeeAuditLog.AuditAction.UPDATED, "jobTitle", old, request.getJobTitle(),
                "Job title updated", actor, getClientIp(), actorRole);
        }

        if (request.getDepartmentId() != null && (decision.manager() || decision.hr() || decision.admin())) {
            String old = emp.getDepartmentId();
            emp.setDepartmentId(request.getDepartmentId());
            auditService.log(id, EmployeeAuditLog.AuditAction.UPDATED, "departmentId", old, request.getDepartmentId(),
                "Department transfer", actor, getClientIp(), actorRole);
        }

        emp.setUpdatedBy(actor);
        employeeRepository.save(emp);

        return buildResponse(emp, decision);
    }

    // ========== TERMINATE (SOFT DELETE + RETENTION) ==========

    @Transactional
    public void terminateEmployee(String id, String reason) {
        String tenantId = TenantContext.getCurrentTenant();
        String actor = getCurrentUser();
        String actorRole = getCurrentRole();

        AccessDecision decision = accessControl.evaluateAccess(id);
        if (!accessControl.canTerminate(decision)) {
            SEC_LOG.warn("SECURITY_EVENT: unauthorized_termination actor={} target={}", actor, id);
            throw new AccessDeniedException("Termination requires HR/Admin");
        }

        // GDPR: 7-year retention for tax/legal, then purge
        LocalDate retentionUntil = LocalDate.now().plusYears(7);

        int updated = employeeRepository.softDeleteById(id, tenantId, retentionUntil, actor);
        if (updated == 0) {
            throw new AccessDeniedException("Employee not found or already terminated");
        }

        auditService.log(id, EmployeeAuditLog.AuditAction.TERMINATED,
            null, null, null, "Termination: " + reason, actor, getClientIp(), actorRole);
    }

    // ========== GDPR PURGE ==========

    @Transactional
    public void purgeExpiredRecords() {
        String tenantId = TenantContext.getCurrentTenant();
        var expired = employeeRepository.findReadyForPurge(tenantId, LocalDate.now());
        
        for (Employee emp : expired) {
            // Physical deletion ONLY after retention period expires
            // This requires elevated DB privileges (separate purge service)
            SEC_LOG.info("GDPR_PURGE: employee={} tenant={} retention_expired={}", 
                emp.getId(), tenantId, emp.getDataRetentionUntil());
            // In production: call stored procedure with elevated privileges
        }
    }

    // ========== RESPONSE BUILDER WITH MASKING ==========

    private EmployeeResponse buildResponse(Employee emp, AccessDecision decision) {
        String tenantId = TenantContext.getCurrentTenant();
        String deptName = departmentRepository.findByIdAndTenant(emp.getDepartmentId(), tenantId)
            .map(d -> d.getName()).orElse("Unknown");

        String managerName = emp.getManagerId() != null ?
            employeeRepository.findByIdAndTenant(emp.getManagerId(), tenantId)
                .map(e -> e.getFirstName() + " " + e.getLastName()).orElse(null) : null;

        String salary = null;
        if (accessControl.canViewSalary(decision) && emp.getSalaryEncrypted() != null) {
            salary = encryptionService.decrypt(emp.getSalaryEncrypted());
        }

        String ssnLastFour = null;
        if (accessControl.canViewSsn(decision) && emp.getSsnEncrypted() != null) {
            String fullSsn = encryptionService.decrypt(emp.getSsnEncrypted());
            ssnLastFour = fullSsn.substring(fullSsn.length() - 4);
        }

        String dob = accessControl.canViewFullDob(decision) 
            ? emp.getDateOfBirth().toString() 
            : maskDob(emp.getDateOfBirth());

        String phone = accessControl.canViewFullDob(decision) // Same logic as DOB
            ? emp.getPhone() 
            : maskPhone(emp.getPhone());

        return new EmployeeResponse(
            emp.getId(),
            emp.getEmployeeNumber(),
            emp.getFirstName(),
            emp.getLastName(),
            emp.getEmail(),
            phone,
            dob,
            deptName,
            managerName,
            emp.getJobTitle(),
            emp.getEmploymentStatus().name(),
            emp.getHireDate().toString(),
            emp.getAccessLevel().name(),
            emp.getProfilePhotoPath(),
            emp.getMfaEnabled(),
            salary,
            ssnLastFour
        );
    }

    private String maskDob(LocalDate dob) {
        return dob.getYear() + "-**-**";
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        return "***-***-" + phone.substring(phone.length() - 4);
    }

    private void validateCreateRequest(CreateEmployeeRequest req) {
        SecureInputValidator.sanitizeAlphanumeric(req.getEmployeeNumber());
        SecureInputValidator.sanitizeGeneralText(req.getFirstName());
        SecureInputValidator.sanitizeGeneralText(req.getLastName());
        if (req.getPhone() != null) SecureInputValidator.sanitizeGeneralText(req.getPhone());
    }

    private String getCurrentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private String getCurrentRole() {
        return SecurityContextHolder.getContext().getAuthentication()
            .getAuthorities().iterator().next().getAuthority();
    }

    private String getClientIp() {
        // Extract from RequestContextHolder in real implementation
        return "unknown";
    }
}
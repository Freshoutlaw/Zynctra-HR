package com.zynctra.corehr.controller;

import com.zynctra.corehr.dto.CreateEmployeeRequest;
import com.zynctra.corehr.dto.EmployeeResponse;
import com.zynctra.corehr.dto.UpdateEmployeeRequest;
import com.zynctra.corehr.entity.Employee;
import com.zynctra.corehr.security.SecureFileUploadService;
import com.zynctra.corehr.service.EmployeeService;
import com.zynctra.corehr.service.SalaryChangeApprovalService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/hr/employees")
@Validated
public class EmployeeController {

    private final EmployeeService employeeService;
    private final SalaryChangeApprovalService salaryApprovalService;
    private final SecureFileUploadService fileUploadService;

    public EmployeeController(EmployeeService employeeService,
                            SalaryChangeApprovalService salaryApprovalService,
                            SecureFileUploadService fileUploadService) {
        this.employeeService = employeeService;
        this.salaryApprovalService = salaryApprovalService;
        this.fileUploadService = fileUploadService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<EmployeeResponse> create(@RequestBody @Valid CreateEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmployeeResponse> get(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String id) {
        return ResponseEntity.ok(employeeService.getEmployee(id));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<EmployeeResponse>> search(
            @RequestParam(required = false) @Size(max = 100) String search,
            @RequestParam(required = false) @Pattern(regexp = "^[a-f0-9-]{36}$") String departmentId,
            @RequestParam(required = false) Employee.EmploymentStatus status,
            Pageable pageable) { // Secured by SecurePageableResolver
        return ResponseEntity.ok(employeeService.searchEmployees(search, departmentId, status, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmployeeResponse> update(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String id,
            @RequestBody @Valid UpdateEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @PostMapping("/{id}/terminate")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<Void> terminate(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String id,
            @RequestParam @Size(max = 500) String reason) {
        employeeService.terminateEmployee(id, reason);
        return ResponseEntity.ok().build();
    }

    // Salary change with approval workflow
    @PostMapping("/{id}/salary-request")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<String> requestSalaryChange(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String id,
            @RequestParam @Positive @Digits(integer = 10, fraction = 2) BigDecimal newSalary,
            @RequestParam @Size(max = 500) String reason) {
        String requester = getCurrentUser();
        String requestId = salaryApprovalService.requestSalaryChange(id, newSalary, reason, requester);
        return ResponseEntity.ok(requestId);
    }

    @PostMapping("/salary-approve/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveSalaryChange(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String requestId) {
        salaryApprovalService.approveSalaryChange(requestId, getCurrentUser());
        return ResponseEntity.ok().build();
    }

    // Secure file upload
    @PostMapping("/{id}/profile-photo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadProfilePhoto(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String id,
            @RequestParam("file") MultipartFile file) {
        String path = fileUploadService.storeProfilePhoto(file, id);
        return ResponseEntity.ok(path);
    }

    private String getCurrentUser() {
        return org.springframework.security.core.context.SecurityContextHolder
            .getContext().getAuthentication().getName();
    }
}
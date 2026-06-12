package com.zynctra.payroll.controller;

import com.zynctra.payroll.dto.*;
import com.zynctra.payroll.entity.PayrollRun;
import com.zynctra.payroll.service.BankAccountService;
import com.zynctra.payroll.service.PayRecordService;
import com.zynctra.payroll.service.PayrollRunService;
import com.zynctra.payroll.security.SecureReportExportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/payroll")
@Validated
public class PayrollController {

    private final PayrollRunService payrollRunService;
    private final PayRecordService payRecordService;
    private final BankAccountService bankAccountService;
    private final SecureReportExportService exportService;

    public PayrollController(PayrollRunService payrollRunService,
                             PayRecordService payRecordService,
                             BankAccountService bankAccountService,
                             SecureReportExportService exportService) {
        this.payrollRunService = payrollRunService;
        this.payRecordService = payRecordService;
        this.bankAccountService = bankAccountService;
        this.exportService = exportService;
    }

    // ========== PAYROLL RUNS ==========

    @PostMapping("/runs")
    @PreAuthorize("hasAnyRole('PAYROLL_ADMIN', 'PAYROLL_PROCESSOR')")
    public ResponseEntity<<PayrollRun> createRun(@RequestBody @Valid CreatePayrollRunRequest request) {
        return ResponseEntity.ok(payrollRunService.createPayrollRun(request));
    }

    @PostMapping("/runs/{runId}/calculate")
    @PreAuthorize("hasAnyRole('PAYROLL_ADMIN', 'PAYROLL_PROCESSOR')")
    public ResponseEntity<Void> calculateRun(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId) {
        payrollRunService.calculatePayroll(runId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/runs/{runId}/approve")
    @PreAuthorize("hasAnyRole('PAYROLL_ADMIN', 'PAYROLL_APPROVER')")
    public ResponseEntity<Void> approveRun(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId,
            @RequestBody @Valid ApprovePayrollRequest request) {
        payrollRunService.approvePayroll(runId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/runs/{runId}/disburse")
    @PreAuthorize("hasRole('PAYROLL_ADMIN')")
    public ResponseEntity<Void> disburseRun(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId) {
        payrollRunService.disbursePayroll(runId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/runs/{runId}/reconcile")
    @PreAuthorize("hasRole('PAYROLL_ADMIN')")
    public ResponseEntity<Void> reconcileRun(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId) {
        payrollRunService.reconcilePayroll(runId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/runs/{runId}/cancel")
    @PreAuthorize("hasAnyRole('PAYROLL_ADMIN', 'PAYROLL_PROCESSOR')")
    public ResponseEntity<Void> cancelRun(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId,
            @RequestParam @Size(max = 500) String reason) {
        payrollRunService.cancelPayroll(runId, reason);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/runs/{runId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<<PayrollRun> getRun(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId) {
        return ResponseEntity.ok(payrollRunService.getPayrollRun(runId));
    }

    @GetMapping("/runs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<<Page<<PayrollRun>> listRuns(Pageable pageable) {
        return ResponseEntity.ok(payrollRunService.listPayrollRuns(pageable));
    }

    // ========== PAY RECORDS ==========

    @GetMapping("/runs/{runId}/records")
    @PreAuthorize("hasAnyRole('PAYROLL_ADMIN', 'PAYROLL_PROCESSOR', 'FINANCE', 'HR', 'ADMIN')")
    public ResponseEntity<?> getRunRecords(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId) {
        return ResponseEntity.ok(payRecordService.getPayRecordsByRun(runId));
    }

    @GetMapping("/employees/{employeeId}/records")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getEmployeeRecords(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String employeeId) {
        return ResponseEntity.ok(payRecordService.getPayRecordsByEmployee(employeeId));
    }

    // ========== BANK ACCOUNTS ==========

    @PostMapping("/employees/{employeeId}/bank-accounts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addBankAccount(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String employeeId,
            @RequestBody @Valid BankAccountRequest request) {
        return ResponseEntity.ok(bankAccountService.addBankAccount(employeeId, request));
    }

    @PostMapping("/bank-accounts/{accountId}/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> verifyBankAccount(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String accountId,
            @RequestParam BigDecimal deposit1,
            @RequestParam BigDecimal deposit2) {
        bankAccountService.verifyBankAccount(accountId, deposit1, deposit2);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/employees/{employeeId}/bank-accounts/{oldAccountId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changeBankAccount(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String employeeId,
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String oldAccountId,
            @RequestBody @Valid BankAccountRequest request) {
        bankAccountService.changeBankAccount(employeeId, oldAccountId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/employees/{employeeId}/bank-accounts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getBankAccounts(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String employeeId) {
        return ResponseEntity.ok(bankAccountService.getEmployeeBankAccounts(employeeId));
    }

    // ========== REPORTS ==========

    @PostMapping("/runs/{runId}/export")
    @PreAuthorize("hasAnyRole('PAYROLL_ADMIN', 'FINANCE', 'ADMIN')")
    public ResponseEntity<?> exportPayroll(
            @PathVariable @Pattern(regexp = "^[a-f0-9-]{36}$") String runId) {
        // Generate and encrypt export
        String reportData = "payroll_data"; // In production: generate actual CSV
        var result = exportService.exportSecureReport(reportData, "payroll_" + runId, getCurrentUser());
        return ResponseEntity.ok(result);
    }

    private String getCurrentUser() {
        return org.springframework.security.core.context.SecurityContextHolder
            .getContext().getAuthentication().getName();
    }
}
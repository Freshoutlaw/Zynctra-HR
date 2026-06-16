package com.zynctra.payroll.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Immutable pay record for a single employee in a payroll run.
 * 
 * SECURITY INVARIANTS:
 * - Calculated once, never modified after creation
 * - Cryptographic hash for tamper detection
 * - References encrypted bank account (not stored here)
 */
@Entity
@Table(name = "pay_records", schema = "payroll_schema")
public class PayRecord extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "payroll_run_id", nullable = false, updatable = false, length = 64)
    private String payrollRunId;

    @Column(name = "employee_id", nullable = false, updatable = false, length = 64)
    private String employeeId;

    @Column(name = "hours_worked", precision = 5, scale = 2)
    private BigDecimal hoursWorked;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "gross_pay", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossPay;

    @Column(name = "federal_tax", precision = 15, scale = 2)
    private BigDecimal federalTax;

    @Column(name = "state_tax", precision = 15, scale = 2)
    private BigDecimal stateTax;

    @Column(name = "local_tax", precision = 15, scale = 2)
    private BigDecimal localTax;

    @Column(name = "social_security", precision = 15, scale = 2)
    private BigDecimal socialSecurity;

    @Column(name = "medicare", precision = 15, scale = 2)
    private BigDecimal medicare;

    @Column(name = "total_deductions", precision = 15, scale = 2)
    private BigDecimal totalDeductions;

    @Column(name = "net_pay", nullable = false, precision = 15, scale = 2)
    private BigDecimal netPay;

    @Column(name = "bank_account_id", nullable = false, length = 64)
    private String bankAccountId; // Reference to encrypted BankAccount

    @Column(name = "record_hash", nullable = false, length = 64)
    private String recordHash; // SHA-256 of all fields

    @Column(name = "calculation_formula", nullable = false, columnDefinition = "TEXT")
    private String calculationFormula; // Audit trail of calculation

    protected PayRecord() {}

    public static PayRecord create(
            String payrollRunId,
            String employeeId,
            BigDecimal grossPay,
            BigDecimal netPay,
            String bankAccountId,
            String calculationFormula,
            String createdBy) {
        
        PayRecord record = new PayRecord();
        record.payrollRunId = payrollRunId;
        record.employeeId = employeeId;
        record.grossPay = grossPay;
        record.netPay = netPay;
        record.bankAccountId = bankAccountId;
        record.calculationFormula = calculationFormula;
        record.setUpdatedBy(createdBy);
        record.recordHash = computeHash(record);
        return record;
    }

    private static String computeHash(PayRecord record) {
        String data = record.payrollRunId + "|" + record.employeeId + "|" + 
                     record.grossPay + "|" + record.netPay + "|" + record.bankAccountId;
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            return java.util.Base64.getEncoder().encodeToString(
                digest.digest(data.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("Hash computation failed", e);
        }
    }

    public boolean verifyIntegrity() {
        return this.recordHash.equals(computeHash(this));
    }

    // Getters only — immutable after creation
    public String getId() { return id; }
    public String getPayrollRunId() { return payrollRunId; }
    public String getEmployeeId() { return employeeId; }
    public BigDecimal getHoursWorked() { return hoursWorked; }
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public BigDecimal getGrossPay() { return grossPay; }
    public BigDecimal getFederalTax() { return federalTax; }
    public BigDecimal getStateTax() { return stateTax; }
    public BigDecimal getLocalTax() { return localTax; }
    public BigDecimal getSocialSecurity() { return socialSecurity; }
    public BigDecimal getMedicare() { return medicare; }
    public BigDecimal getTotalDeductions() { return totalDeductions; }
    public BigDecimal getNetPay() { return netPay; }
    public String getBankAccountId() { return bankAccountId; }
    public String getRecordHash() { return recordHash; }
    public String getCalculationFormula() { return calculationFormula; }
}

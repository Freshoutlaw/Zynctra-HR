package com.zynctra.payroll.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Tax withholding record per employee per pay period.
 * Immutable after creation.
 */
@Entity
@Table(name = "tax_records", schema = "payroll_schema")
public class TaxRecord extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "payroll_run_id", nullable = false, updatable = false, length = 64)
    private String payrollRunId;

    @Column(name = "employee_id", nullable = false, updatable = false, length = 64)
    private String employeeId;

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

    @Column(name = "filing_status", length = 16)
    @Enumerated(EnumType.STRING)
    private FilingStatus filingStatus;

    @Column(name = "allowances")
    private Integer allowances;

    @Column(name = "additional_withholding", precision = 10, scale = 2)
    private BigDecimal additionalWithholding;

    public enum FilingStatus { SINGLE, MARRIED, HEAD_OF_HOUSEHOLD }

    protected TaxRecord() {}

    public static TaxRecord create(String payrollRunId, String employeeId, String createdBy) {
        TaxRecord tax = new TaxRecord();
        tax.payrollRunId = payrollRunId;
        tax.employeeId = employeeId;
        tax.createdBy = createdBy;
        tax.updatedBy = createdBy;
        return tax;
    }

    // Getters and limited setters (immutable after creation)
    public String getId() { return id; }
    public String getPayrollRunId() { return payrollRunId; }
    public String getEmployeeId() { return employeeId; }
    public BigDecimal getFederalTax() { return federalTax; }
    public BigDecimal getStateTax() { return stateTax; }
    public BigDecimal getLocalTax() { return localTax; }
    public BigDecimal getSocialSecurity() { return socialSecurity; }
    public BigDecimal getMedicare() { return medicare; }
    public FilingStatus getFilingStatus() { return filingStatus; }
    public Integer getAllowances() { return allowances; }
    public BigDecimal getAdditionalWithholding() { return additionalWithholding; }

    public void setFederalTax(BigDecimal v) { this.federalTax = v; }
    public void setStateTax(BigDecimal v) { this.stateTax = v; }
    public void setLocalTax(BigDecimal v) { this.localTax = v; }
    public void setSocialSecurity(BigDecimal v) { this.socialSecurity = v; }
    public void setMedicare(BigDecimal v) { this.medicare = v; }
    public void setFilingStatus(FilingStatus v) { this.filingStatus = v; }
    public void setAllowances(Integer v) { this.allowances = v; }
    public void setAdditionalWithholding(BigDecimal v) { this.additionalWithholding = v; }
}
package com.zynctra.payroll.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "deductions", schema = "payroll_schema")
public class Deduction extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "payroll_run_id", nullable = false, updatable = false, length = 64)
    private String payrollRunId;

    @Column(name = "employee_id", nullable = false, updatable = false, length = 64)
    private String employeeId;

    @Column(name = "deduction_type", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private DeductionType deductionType;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "employer_match", precision = 15, scale = 2)
    private BigDecimal employerMatch;

    public enum DeductionType {
        HEALTH_INSURANCE, DENTAL, VISION, _401K, HSA, FSA, 
        LIFE_INSURANCE, DISABILITY, GARNISHMENT, OTHER
    }

    protected Deduction() {}

    public static Deduction create(String payrollRunId, String employeeId, 
                                    DeductionType type, BigDecimal amount, String createdBy) {
        Deduction d = new Deduction();
        d.payrollRunId = payrollRunId;
        d.employeeId = employeeId;
        d.deductionType = type;
        d.amount = amount;
        d.setUpdatedBy(createdBy);
        return d;
    }

    // Getters
    public String getId() { return id; }
    public String getPayrollRunId() { return payrollRunId; }
    public String getEmployeeId() { return employeeId; }
    public DeductionType getDeductionType() { return deductionType; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getEmployerMatch() { return employerMatch; }

    public void setEmployerMatch(BigDecimal v) { this.employerMatch = v; }
}

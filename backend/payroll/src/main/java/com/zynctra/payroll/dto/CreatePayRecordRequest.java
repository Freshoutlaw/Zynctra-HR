package com.zynctra.payroll.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class CreatePayRecordRequest {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Payroll run ID is required")
    private String payrollRunId;

    @NotNull(message = "Gross pay is required")
    @Positive(message = "Gross pay must be positive")
    private BigDecimal grossPay;

    @NotNull(message = "Net pay is required")
    @Positive(message = "Net pay must be positive")
    private BigDecimal netPay;

    @NotNull(message = "Total deductions is required")
    private BigDecimal totalDeductions;

    @NotNull(message = "Total taxes is required")
    private BigDecimal totalTaxes;

    public CreatePayRecordRequest() {
    }

    public CreatePayRecordRequest(String employeeId, String payrollRunId, BigDecimal grossPay, 
                                   BigDecimal netPay, BigDecimal totalDeductions, BigDecimal totalTaxes) {
        this.employeeId = employeeId;
        this.payrollRunId = payrollRunId;
        this.grossPay = grossPay;
        this.netPay = netPay;
        this.totalDeductions = totalDeductions;
        this.totalTaxes = totalTaxes;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getPayrollRunId() {
        return payrollRunId;
    }

    public void setPayrollRunId(String payrollRunId) {
        this.payrollRunId = payrollRunId;
    }

    public BigDecimal getGrossPay() {
        return grossPay;
    }

    public void setGrossPay(BigDecimal grossPay) {
        this.grossPay = grossPay;
    }

    public BigDecimal getNetPay() {
        return netPay;
    }

    public void setNetPay(BigDecimal netPay) {
        this.netPay = netPay;
    }

    public BigDecimal getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(BigDecimal totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public BigDecimal getTotalTaxes() {
        return totalTaxes;
    }

    public void setTotalTaxes(BigDecimal totalTaxes) {
        this.totalTaxes = totalTaxes;
    }
}

package com.zynctra.payroll.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PayRecordResponse {

    private final String id;
    private final String employeeId;
    private final String employeeName;
    private final BigDecimal grossPay;
    private final BigDecimal netPay;
    private final BigDecimal federalTax;
    private final BigDecimal stateTax;
    private final BigDecimal socialSecurity;
    private final BigDecimal medicare;
    private final BigDecimal totalDeductions;
    private final String bankAccountLastFour; // Only last 4 digits
    private final String calculationFormula;

    public PayRecordResponse(String id, String employeeId, String employeeName,
                             BigDecimal grossPay, BigDecimal netPay, BigDecimal federalTax,
                             BigDecimal stateTax, BigDecimal socialSecurity, BigDecimal medicare,
                             BigDecimal totalDeductions, String bankAccountLastFour,
                             String calculationFormula) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.grossPay = grossPay;
        this.netPay = netPay;
        this.federalTax = federalTax;
        this.stateTax = stateTax;
        this.socialSecurity = socialSecurity;
        this.medicare = medicare;
        this.totalDeductions = totalDeductions;
        this.bankAccountLastFour = bankAccountLastFour;
        this.calculationFormula = calculationFormula;
    }

    // Getters only
    public String getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public String getEmployeeName() { return employeeName; }
    public BigDecimal getGrossPay() { return grossPay; }
    public BigDecimal getNetPay() { return netPay; }
    public BigDecimal getFederalTax() { return federalTax; }
    public BigDecimal getStateTax() { return stateTax; }
    public BigDecimal getSocialSecurity() { return socialSecurity; }
    public BigDecimal getMedicare() { return medicare; }
    public BigDecimal getTotalDeductions() { return totalDeductions; }
    public String getBankAccountLastFour() { return bankAccountLastFour; }
    public String getCalculationFormula() { return calculationFormula; }
}

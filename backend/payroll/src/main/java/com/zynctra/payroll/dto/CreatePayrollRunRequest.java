package com.zynctra.payroll.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class CreatePayrollRunRequest {

    @NotBlank
    @Size(max = 32)
    @Pattern(regexp = "^[A-Z0-9-]+$")
    private String payrollRunNumber;

    @NotNull
    @PastOrPresent
    private LocalDate payPeriodStart;

    @NotNull
    @PastOrPresent
    private LocalDate payPeriodEnd;

    @NotNull
    @FutureOrPresent
    private LocalDate payDate;

    @NotNull
    private com.zynctra.payroll.entity.PayrollRun.RunType runType;

    @NotBlank
    @Size(max = 64)
    private String idempotencyKey;

    // Getters and setters
    public String getPayrollRunNumber() { return payrollRunNumber; }
    public void setPayrollRunNumber(String v) { this.payrollRunNumber = v; }
    public LocalDate getPayPeriodStart() { return payPeriodStart; }
    public void setPayPeriodStart(LocalDate v) { this.payPeriodStart = v; }
    public LocalDate getPayPeriodEnd() { return payPeriodEnd; }
    public void setPayPeriodEnd(LocalDate v) { this.payPeriodEnd = v; }
    public LocalDate getPayDate() { return payDate; }
    public void setPayDate(LocalDate v) { this.payDate = v; }
    public com.zynctra.payroll.entity.PayrollRun.RunType getRunType() { return runType; }
    public void setRunType(com.zynctra.payroll.entity.PayrollRun.RunType v) { this.runType = v; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String v) { this.idempotencyKey = v; }
}
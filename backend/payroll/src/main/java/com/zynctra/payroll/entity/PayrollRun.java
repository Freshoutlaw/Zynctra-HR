package com.zynctra.payroll.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payroll_runs", indexes = {
    @Index(name = "idx_payroll_runs_employee_id", columnList = "employee_id"),
    @Index(name = "idx_payroll_runs_period", columnList = "period_start_date, period_end_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRun extends BaseEntity {
    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "period_start_date", nullable = false)
    private LocalDate periodStartDate;

    @Column(name = "period_end_date", nullable = false)
    private LocalDate periodEndDate;

    @Column(name = "gross_salary", precision = 15, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "total_deductions", precision = 15, scale = 2)
    private BigDecimal totalDeductions;

    @Column(name = "net_salary", precision = 15, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "status")
    private String status; // DRAFT, APPROVED, PROCESSED, PAID

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_method")
    private String paymentMethod; // BANK_TRANSFER, CASH, CHECK
}

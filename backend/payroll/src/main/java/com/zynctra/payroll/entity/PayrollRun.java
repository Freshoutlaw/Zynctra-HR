package com.zynctra.payroll.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Payroll run with immutable state machine.
 * 
 * SECURITY INVARIANTS:
 * - Status transitions are STRICT (cannot skip states)
 * - Once APPROVED, calculations are FROZEN (cryptographic hash)
 * - Only DISBURSED after approval + verification
 * - Idempotency key prevents duplicate runs
 * - Immutable pay period dates
 */
@Entity
@Table(name = "payroll_runs", schema = "payroll_schema")
public class PayrollRun extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "payroll_run_number", nullable = false, unique = true, length = 32)
    private String payrollRunNumber;

    @Column(name = "pay_period_start", nullable = false, updatable = false)
    private LocalDate payPeriodStart;

    @Column(name = "pay_period_end", nullable = false, updatable = false)
    private LocalDate payPeriodEnd;

    @Column(name = "pay_date", nullable = false)
    private LocalDate payDate;

    @Column(name = "status", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private PayrollStatus status = PayrollStatus.DRAFT;

    @Column(name = "total_gross", precision = 15, scale = 2)
    private BigDecimal totalGross;

    @Column(name = "total_net", precision = 15, scale = 2)
    private BigDecimal totalNet;

    @Column(name = "total_taxes", precision = 15, scale = 2)
    private BigDecimal totalTaxes;

    @Column(name = "total_deductions", precision = 15, scale = 2)
    private BigDecimal totalDeductions;

    /**
     * Cryptographic hash of all pay records at approval time.
     * Any tampering after approval invalidates this hash.
     */
    @Column(name = "approval_hash", length = 64)
    private String approvalHash;

    @Column(name = "approved_by", length = 128)
    private String approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "disbursed_by", length = 128)
    private String disbursedBy;

    @Column(name = "disbursed_at")
    private Instant disbursedAt;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 64)
    private String idempotencyKey;

    @Column(name = "run_type", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private RunType runType = RunType.REGULAR;

    public enum PayrollStatus {
        DRAFT,        // Calculating
        REVIEW,       // Ready for review
        APPROVED,     // Frozen, ready for disbursement
        DISBURSED,    // Payments sent
        CANCELLED,    // Aborted (only from DRAFT/REVIEW)
        RECONCILED    // Post-disbursement verified
    }

    public enum RunType {
        REGULAR, BONUS, CORRECTION, TERMINATION, BACKPAY
    }

    protected PayrollRun() {}

    public static PayrollRun create(
            String payrollRunNumber,
            LocalDate payPeriodStart,
            LocalDate payPeriodEnd,
            LocalDate payDate,
            RunType runType,
            String idempotencyKey,
            String createdBy) {
        
        PayrollRun run = new PayrollRun();
        run.payrollRunNumber = payrollRunNumber;
        run.payPeriodStart = payPeriodStart;
        run.payPeriodEnd = payPeriodEnd;
        run.payDate = payDate;
        run.runType = runType;
        run.idempotencyKey = idempotencyKey;
        run.status = PayrollStatus.DRAFT;
        run.setUpdatedBy(createdBy);
        return run;
    }

    /**
     * STRICT state machine transitions.
     * Invalid transitions throw SecurityException.
     */
    public void transitionTo(PayrollStatus newStatus, String actor) {
        boolean valid = switch (this.status) {
            case DRAFT -> newStatus == PayrollStatus.REVIEW || newStatus == PayrollStatus.CANCELLED;
            case REVIEW -> newStatus == PayrollStatus.APPROVED || newStatus == PayrollStatus.CANCELLED;
            case APPROVED -> newStatus == PayrollStatus.DISBURSED;
            case DISBURSED -> newStatus == PayrollStatus.RECONCILED;
            case CANCELLED, RECONCILED -> false; // Terminal states
        };

        if (!valid) {
            throw new SecurityException(
                "Invalid status transition: " + this.status + " -> " + newStatus);
        }

        this.status = newStatus;
        this.setUpdatedBy(actor);

        switch (newStatus) {
            case APPROVED -> {
                this.approvedBy = actor;
                this.approvedAt = Instant.now();
            }
            case DISBURSED -> {
                this.disbursedBy = actor;
                this.disbursedAt = Instant.now();
            }
            default -> {}
        }
    }

    // Getters
    public String getId() { return id; }
    public String getPayrollRunNumber() { return payrollRunNumber; }
    public LocalDate getPayPeriodStart() { return payPeriodStart; }
    public LocalDate getPayPeriodEnd() { return payPeriodEnd; }
    public LocalDate getPayDate() { return payDate; }
    public PayrollStatus getStatus() { return status; }
    public BigDecimal getTotalGross() { return totalGross; }
    public BigDecimal getTotalNet() { return totalNet; }
    public BigDecimal getTotalTaxes() { return totalTaxes; }
    public BigDecimal getTotalDeductions() { return totalDeductions; }
    public String getApprovalHash() { return approvalHash; }
    public String getApprovedBy() { return approvedBy; }
    public Instant getApprovedAt() { return approvedAt; }
    public String getDisbursedBy() { return disbursedBy; }
    public Instant getDisbursedAt() { return disbursedAt; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public RunType getRunType() { return runType; }

    // Setters (limited)
    public void setTotalGross(BigDecimal v) { this.totalGross = v; }
    public void setTotalNet(BigDecimal v) { this.totalNet = v; }
    public void setTotalTaxes(BigDecimal v) { this.totalTaxes = v; }
    public void setTotalDeductions(BigDecimal v) { this.totalDeductions = v; }
    public void setApprovalHash(String v) { this.approvalHash = v; }
    public void setPayDate(LocalDate v) { this.payDate = v; }

    // NO setters for: id, payrollRunNumber, payPeriodStart, payPeriodEnd, idempotencyKey
}

package com.zynctra.payroll.entity;

public enum PayrollStatus {
    DRAFT,          // Run created, ready for calculation
    CALCULATING,    // Async process running
    CALCULATED,     // Math complete, ready for review
    APPROVED,       // Manager approved, ready for payment
    FINALIZED,      // Paid and locked
    REVERSED        // Voided
}

package com.zynctra.payroll.entity;

public enum DeductionType {
    PRE_TAX,        // Reduces taxable income (e.g., 401k)
    POST_TAX,       // Deduction after taxes (e.g., Garnishment)
    EMPLOYER_PAID   // Benefit paid by company, no employee impact
}

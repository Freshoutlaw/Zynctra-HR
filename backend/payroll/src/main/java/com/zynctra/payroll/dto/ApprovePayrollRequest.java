package com.zynctra.payroll.dto;

import jakarta.validation.constraints.*;

public class ApprovePayrollRequest {

    @NotBlank
    @Size(max = 512)
    private String approvalNotes;

    @AssertTrue(message = "Approver must confirm review of all calculations")
    private Boolean calculationsReviewed;

    @AssertTrue(message = "Approver must confirm bank account verification")
    private Boolean bankAccountsVerified;

    // Getters and setters
    public String getApprovalNotes() { return approvalNotes; }
    public void setApprovalNotes(String v) { this.approvalNotes = v; }
    public Boolean getCalculationsReviewed() { return calculationsReviewed; }
    public void setCalculationsReviewed(Boolean v) { this.calculationsReviewed = v; }
    public Boolean getBankAccountsVerified() { return bankAccountsVerified; }
    public void setBankAccountsVerified(Boolean v) { this.bankAccountsVerified = v; }
}
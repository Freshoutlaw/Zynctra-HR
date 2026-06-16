package com.zynctra.payroll.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class BankAccountRequest {

    @NotBlank
    @Size(max = 128)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$")
    private String accountHolderName;

    @NotBlank
    @Size(max = 128)
    private String bankName;

    @NotBlank
    @Pattern(regexp = "^\\d{9}$", message = "Routing number must be 9 digits")
    private String routingNumber;

    @NotBlank
    @Pattern(regexp = "^\\d{4,17}$", message = "Account number must be 4-17 digits")
    private String accountNumber;

    @NotNull
    private com.zynctra.payroll.entity.BankAccount.AccountType accountType;

    private Boolean isPrimary = false;

    // Getters and setters
    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String v) { this.accountHolderName = v; }
    public String getBankName() { return bankName; }
    public void setBankName(String v) { this.bankName = v; }
    public String getRoutingNumber() { return routingNumber; }
    public void setRoutingNumber(String v) { this.routingNumber = v; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String v) { this.accountNumber = v; }
    public com.zynctra.payroll.entity.BankAccount.AccountType getAccountType() { return accountType; }
    public void setAccountType(com.zynctra.payroll.entity.BankAccount.AccountType v) { this.accountType = v; }
    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean v) { this.isPrimary = v; }
}

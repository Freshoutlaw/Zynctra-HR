package com.zynctra.payroll.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Employee bank account with encryption + verification.
 * 
 * SECURITY INVARIANTS:
 * - Account number encrypted at application layer
    - Routing number hashed for lookup (not reversible)
    - Verification status tracked (micro-deposit, instant verification)
    - Change requires re-verification
    - Audit trail for all changes
    */
@Entity
@Table(name = "bank_accounts", schema = "payroll_schema")
public class BankAccount extends SecureBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(name = "employee_id", nullable = false, updatable = false, length = 64)
    private String employeeId;

    @Column(name = "account_holder_name", nullable = false, length = 128)
    private String accountHolderName;

    @Column(name = "bank_name", nullable = false, length = 128)
    private String bankName;

    @Column(name = "routing_number_hash", nullable = false, length = 64)
    private String routingNumberHash;

    @Column(name = "account_number_encrypted", nullable = false, columnDefinition = "TEXT")
    private String accountNumberEncrypted;

    @Column(name = "account_type", nullable = false, length = 16)
    @Enumerated(EnumType.STRING)
    private AccountType accountType = AccountType.CHECKING;

    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    @Column(name = "verification_method", length = 32)
    @Enumerated(EnumType.STRING)
    private VerificationMethod verificationMethod;

    @Column(name = "verified_at")
    private java.time.Instant verifiedAt;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public enum AccountType { CHECKING, SAVINGS }
    public enum VerificationMethod { MICRO_DEPOSIT, INSTANT, MANUAL }

    protected BankAccount() {}

    public static BankAccount create(
            String employeeId,
            String accountHolderName,
            String bankName,
            String routingNumberHash,
            String accountNumberEncrypted,
            AccountType accountType,
            String createdBy) {
        
        BankAccount acct = new BankAccount();
        acct.employeeId = employeeId;
        acct.accountHolderName = accountHolderName;
        acct.bankName = bankName;
        acct.routingNumberHash = routingNumberHash;
        acct.accountNumberEncrypted = accountNumberEncrypted;
        acct.accountType = accountType;
        acct.verified = false;
        acct.isPrimary = false;
        acct.active = true;
        acct.createdBy = createdBy;
        acct.updatedBy = createdBy;
        return acct;
    }

    public void markVerified(VerificationMethod method, String actor) {
        this.verified = true;
        this.verificationMethod = method;
        this.verifiedAt = java.time.Instant.now();
        this.updatedBy = actor;
    }

    // Getters
    public String getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public String getAccountHolderName() { return accountHolderName; }
    public String getBankName() { return bankName; }
    public String getRoutingNumberHash() { return routingNumberHash; }
    public String getAccountNumberEncrypted() { return accountNumberEncrypted; }
    public AccountType getAccountType() { return accountType; }
    public Boolean getVerified() { return verified; }
    public VerificationMethod getVerificationMethod() { return verificationMethod; }
    public java.time.Instant getVerifiedAt() { return verifiedAt; }
    public Boolean getIsPrimary() { return isPrimary; }
    public Boolean getActive() { return active; }

    // Setters (limited)
    public void setIsPrimary(Boolean v) { this.isPrimary = v; }
    public void setActive(Boolean v) { this.active = v; }
    public void setAccountHolderName(String v) { this.accountHolderName = v; }
    public void setBankName(String v) { this.bankName = v; }
    public void setUpdatedBy(String v) { this.updatedBy = v; }

    // NO setters for: employeeId, routingNumberHash, accountNumberEncrypted (immutable)
}
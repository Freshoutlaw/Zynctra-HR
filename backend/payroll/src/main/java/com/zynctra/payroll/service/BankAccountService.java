package com.zynctra.payroll.service;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.common.validation.SecureInputValidator;
import com.zynctra.payroll.dto.BankAccountRequest;
import com.zynctra.payroll.entity.BankAccount;
import com.zynctra.payroll.repository.BankAccountRepository;
import com.zynctra.payroll.security.BankAccountVerificationService;
import com.zynctra.payroll.security.PayrollAuditService;
import com.zynctra.payroll.security.PayrollEncryptionService;
import com.zynctra.payroll.security.PayrollAccessControl;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final PayrollEncryptionService encryptionService;
    private final BankAccountVerificationService verificationService;
    private final PayrollAuditService auditService;
    private final PayrollAccessControl accessControl;

    public BankAccountService(BankAccountRepository bankAccountRepository,
                              PayrollEncryptionService encryptionService,
                              BankAccountVerificationService verificationService,
                              PayrollAuditService auditService,
                              PayrollAccessControl accessControl) {
        this.bankAccountRepository = bankAccountRepository;
        this.encryptionService = encryptionService;
        this.verificationService = verificationService;
        this.auditService = auditService;
        this.accessControl = accessControl;
    }

    @Transactional
    public BankAccount addBankAccount(String employeeId, BankAccountRequest request) {
        String tenantId = TenantContext.getCurrentTenant();
        String actor = getCurrentUser();
        var decision = accessControl.evaluate();

        if (!accessControl.canModifyBankAccount(decision, employeeId)) {
            throw new AccessDeniedException("Cannot modify bank account");
        }

        // Validate routing number
        if (!verificationService.validateRoutingNumber(request.getRoutingNumber())) {
            throw new IllegalArgumentException("Invalid routing number");
        }

        // Encrypt account number
        String encryptedAccount = encryptionService.encrypt(request.getAccountNumber(), tenantId);
        String routingHash = encryptionService.hashForLookup(request.getRoutingNumber(), tenantId);

        // Check for duplicate bank account (fraud indicator)
        if (bankAccountRepository.existsByRoutingHash(routingHash, tenantId)) {
            // In production: alert security team, allow but flag
        }

        BankAccount account = BankAccount.create(
            employeeId,
            request.getAccountHolderName(),
            request.getBankName(),
            routingHash,
            encryptedAccount,
            request.getAccountType(),
            actor
        );

        // If primary, deactivate other accounts
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            List<BankAccount> existing = bankAccountRepository.findActiveByEmployee(employeeId, tenantId);
            for (BankAccount existingAcct : existing) {
                existingAcct.setIsPrimary(false);
                existingAcct.setUpdatedBy(actor);
            }
            account.setIsPrimary(true);
        }

        bankAccountRepository.save(account);

        // Initiate verification
        verificationService.initiateMicroDeposit(account);

        auditService.log(null, employeeId, com.zynctra.payroll.entity.PayrollAuditLog.AuditAction.BANK_ACCOUNT_ADDED,
            null, null, null, null, actor, getClientIp(), getCurrentRole());

        return account;
    }

    @Transactional
    public void verifyBankAccount(String accountId, java.math.BigDecimal deposit1, java.math.BigDecimal deposit2) {
        String tenantId = TenantContext.getCurrentTenant();
        String actor = getCurrentUser();

        BankAccount account = bankAccountRepository.findByIdAndTenant(accountId, tenantId)
            .orElseThrow(() -> new AccessDeniedException("Bank account not found"));

        if (verificationService.verifyMicroDeposit(account, deposit1, deposit2)) {
            account.markVerified(BankAccount.VerificationMethod.MICRO_DEPOSIT, actor);
            bankAccountRepository.save(account);

            auditService.log(null, account.getEmployeeId(), 
                com.zynctra.payroll.entity.PayrollAuditLog.AuditAction.BANK_ACCOUNT_VERIFIED,
                null, null, null, null, actor, getClientIp(), getCurrentRole());
        } else {
            throw new SecurityException("Micro-deposit verification failed");
        }
    }

    @Transactional
    public void changeBankAccount(String employeeId, String oldAccountId, BankAccountRequest request) {
        String tenantId = TenantContext.getCurrentTenant();
        String actor = getCurrentUser();

        // Deactivate old account
        BankAccount oldAccount = bankAccountRepository.findByIdAndTenant(oldAccountId, tenantId)
            .orElseThrow(() -> new AccessDeniedException("Bank account not found"));
        oldAccount.setActive(false);
        oldAccount.setUpdatedBy(actor);
        bankAccountRepository.save(oldAccount);

        // Add new account (requires re-verification)
        BankAccount newAccount = addBankAccount(employeeId, request);

        auditService.log(null, employeeId, 
            com.zynctra.payroll.entity.PayrollAuditLog.AuditAction.BANK_ACCOUNT_CHANGED,
            oldAccountId, newAccount.getId(), null, null, actor, getClientIp(), getCurrentRole());
    }

    public List<BankAccount> getEmployeeBankAccounts(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        return bankAccountRepository.findActiveByEmployee(employeeId, tenantId);
    }

    public BankAccount getPrimaryBankAccount(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        return bankAccountRepository.findPrimaryByEmployee(employeeId, tenantId)
            .orElseThrow(() -> new IllegalStateException("No primary bank account found"));
    }

    private String getCurrentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private String getCurrentRole() {
        return SecurityContextHolder.getContext().getAuthentication()
            .getAuthorities().iterator().next().getAuthority();
    }

    private String getClientIp() {
        return "unknown";
    }
}

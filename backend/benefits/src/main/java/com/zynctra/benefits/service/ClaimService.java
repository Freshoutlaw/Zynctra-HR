package com.zynctra.benefits.service;

import java.time.LocalDate;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zynctra.benefits.dto.ClaimRequest;
import com.zynctra.benefits.dto.ClaimStatusUpdateRequest;
import com.zynctra.benefits.entity.Claim;
import com.zynctra.benefits.model.AuditAction;
import com.zynctra.benefits.repository.ClaimRepository;
import com.zynctra.benefits.security.Audited;
import com.zynctra.benefits.validation.InputSanitizer;
import com.zynctra.benefits.security.TenantContext;

@Service
public class ClaimService {

    private static final Logger log = LoggerFactory.getLogger(ClaimService.class);

    private final ClaimRepository claimRepository;
    private final EnrollmentService enrollmentService;
    private final InputSanitizer sanitizer;
    private final RateLimitService rateLimitService;
    private final AuditLogService auditLogService;

    public ClaimService(ClaimRepository claimRepository, EnrollmentService enrollmentService, 
                        InputSanitizer sanitizer, RateLimitService rateLimitService, 
                        AuditLogService auditLogService) {
        this.claimRepository = claimRepository;
        this.enrollmentService = enrollmentService;
        this.sanitizer = sanitizer;
        this.rateLimitService = rateLimitService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    @Audited(action = AuditAction.CLAIM_SUBMITTED, resourceType = "Claim")
    public Claim submitClaim(ClaimRequest request) {
        UUID tenantId = TenantContext.requireTenantId();
        UUID userId = TenantContext.requireUserId();

        rateLimitService.checkRateLimit(tenantId.toString(), userId.toString(), 3);

        // Verify enrollment belongs to tenant
        enrollmentService.getEnrollment(request.getEnrollmentId());

        Claim claim = Claim.builder()
            .tenantId(tenantId)
            .employeeId(request.getEmployeeId())
            .enrollmentId(request.getEnrollmentId())
            .claimNumber(generateClaimNumber(tenantId))
            .type(request.getType())
            .status(Claim.ClaimStatus.SUBMITTED)
            .serviceDate(request.getServiceDate())
            .submissionDate(LocalDate.now())
            .amountClaimed(request.getAmountClaimed())
            .currency(sanitizer.sanitizeCurrency(request.getCurrency(), "currency",
                tenantId.toString(), userId.toString()))
            .description(sanitizer.sanitizeText(request.getDescription(), "description", 5000,
                tenantId.toString(), userId.toString()))
            .providerName(sanitizer.sanitizeText(request.getProviderName(), "providerName", 200,
                tenantId.toString(), userId.toString()))
            .providerTaxId(sanitizer.sanitizeText(request.getProviderTaxId(), "providerTaxId", 20,
                tenantId.toString(), userId.toString()))
            .reimbursementMethod(sanitizer.sanitizeText(request.getReimbursementMethod(),
                "reimbursementMethod", 30, tenantId.toString(), userId.toString()))
            .createdBy(userId)
            .build();

        Claim saved = claimRepository.save(claim);
        log.info("Submitted claim: {} for employee: {}", saved.getId(), request.getEmployeeId());
        return saved;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE')")
    public Claim getClaim(UUID claimId) {
        UUID tenantId = TenantContext.requireTenantId();
        return claimRepository.findByIdAndTenantIdAndDeletedAtIsNull(claimId, tenantId)
            .orElseThrow(() -> new com.zynctra.benefits.exception.TenantIsolationException(
                "Claim", claimId.toString(), tenantId.toString(), tenantId.toString(),
                TenantContext.requireUserId().toString()));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Page<Claim> listClaims(Pageable pageable) {
        return claimRepository.findByTenantIdAndDeletedAtIsNull(
            TenantContext.requireTenantId(), pageable);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    @Audited(action = AuditAction.CLAIM_APPROVED, resourceType = "Claim")
    public Claim updateClaimStatus(UUID claimId, ClaimStatusUpdateRequest request) {
        UUID userId = TenantContext.requireUserId();
        Claim claim = getClaim(claimId);

        claim.setStatus(request.getNewStatus());
        claim.setAmountApproved(request.getAmountApproved());
        claim.setUpdatedBy(userId != null ? userId.toString() : null);

        if (request.getNewStatus() == Claim.ClaimStatus.REIMBURSED) {
            claim.setReimbursementDate(LocalDate.now());
        }

        Claim saved = claimRepository.save(claim);
        log.info("Updated claim: {} to status: {} by user: {}", claimId, request.getNewStatus(), userId);
        return saved;
    }

    private String generateClaimNumber(UUID tenantId) {
        return "CLM-" + tenantId.toString().substring(0, 8).toUpperCase()
            + "-" + System.currentTimeMillis();
    }
}
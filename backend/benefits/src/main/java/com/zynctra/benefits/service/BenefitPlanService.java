package com.zynctra.benefits.service;

import com.zynctra.benefits.dto.BenefitPlanRequest;
import com.zynctra.benefits.entity.BenefitPlan;
import com.zynctra.benefits.model.AuditAction;
import com.zynctra.benefits.model.TenantContext;
import com.zynctra.benefits.repository.BenefitPlanRepository;
import com.zynctra.benefits.security.Audited;
import com.zynctra.benefits.validation.InputSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BenefitPlanService {

    private final BenefitPlanRepository planRepository;
    private final InputSanitizer sanitizer;
    private final RateLimitService rateLimitService;
    private final AuditLogService auditLogService;

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    @Audited(action = AuditAction.BENEFIT_PLAN_CREATED, resourceType = "BenefitPlan")
    public BenefitPlan createPlan(BenefitPlanRequest request) {
        UUID tenantId = TenantContext.requireTenantId();
        UUID userId = TenantContext.requireUserId();
        String role = TenantContext.requireRole();

        rateLimitService.checkRateLimit(tenantId.toString(), userId.toString());

        String planCode = sanitizer.sanitizeText(request.getPlanCode(), "planCode", 50,
            tenantId.toString(), userId.toString());
        if (planRepository.existsByTenantIdAndPlanCodeAndDeletedAtIsNull(tenantId, planCode)) {
            throw new IllegalStateException("Plan code already exists");
        }

        BenefitPlan plan = BenefitPlan.builder()
            .tenantId(tenantId)
            .organizationId(tenantId)
            .name(sanitizer.sanitizeText(request.getName(), "name", 200, tenantId.toString(), userId.toString()))
            .planCode(planCode)
            .type(request.getType())
            .description(sanitizer.sanitizeHtml(request.getDescription(), "description", 5000,
                tenantId.toString(), userId.toString()))
            .coverageDetails(sanitizer.sanitizeHtml(request.getCoverageDetails(), "coverageDetails", 10000,
                tenantId.toString(), userId.toString()))
            .employerContribution(request.getEmployerContribution())
            .employeeContribution(request.getEmployeeContribution())
            .currency(sanitizer.sanitizeCurrency(request.getCurrency(), "currency",
                tenantId.toString(), userId.toString()))
            .effectiveDate(request.getEffectiveDate())
            .expirationDate(request.getExpirationDate())
            .status(BenefitPlan.PlanStatus.DRAFT)
            .isActive(true)
            .createdBy(userId)
            .build();

        BenefitPlan saved = planRepository.save(plan);
        log.info("Created benefit plan: {} for tenant: {}", saved.getId(), tenantId);
        return saved;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE')")
    @Audited(action = AuditAction.BENEFIT_PLAN_VIEWED, resourceType = "BenefitPlan")
    public BenefitPlan getPlan(UUID planId) {
        UUID tenantId = TenantContext.requireTenantId();
        return planRepository.findByIdAndTenantIdAndDeletedAtIsNull(planId, tenantId)
            .orElseThrow(() -> new com.zynctra.benefits.exception.TenantIsolationException(
                "BenefitPlan", planId.toString(), tenantId.toString(), tenantId.toString(),
                TenantContext.requireUserId().toString()));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE')")
    public Page<BenefitPlan> listPlans(Pageable pageable) {
        UUID tenantId = TenantContext.requireTenantId();
        return planRepository.findByTenantIdAndDeletedAtIsNull(tenantId, pageable);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE')")
    public List<BenefitPlan> listActivePlans() {
        UUID tenantId = TenantContext.requireTenantId();
        return planRepository.findActivePlansForEnrollment(tenantId);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    @Audited(action = AuditAction.BENEFIT_PLAN_DELETED, resourceType = "BenefitPlan")
    public void deletePlan(UUID planId) {
        UUID tenantId = TenantContext.requireTenantId();
        UUID userId = TenantContext.requireUserId();
        BenefitPlan plan = getPlan(planId);
        plan.setDeletedAt(Instant.now());
        plan.setUpdatedBy(userId);
        planRepository.save(plan);
        log.info("Deleted benefit plan: {} by user: {}", planId, userId);
    }
}
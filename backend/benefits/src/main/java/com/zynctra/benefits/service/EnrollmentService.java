package com.zynctra.benefits.service;

import com.zynctra.benefits.dto.EnrollmentRequest;
import com.zynctra.benefits.entity.Enrollment;
import com.zynctra.benefits.model.AuditAction;
import com.zynctra.benefits.model.TenantContext;
import com.zynctra.benefits.repository.EnrollmentRepository;
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
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final BenefitPlanService planService;
    private final InputSanitizer sanitizer;
    private final RateLimitService rateLimitService;
    private final AuditLogService auditLogService;

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    @Audited(action = AuditAction.ENROLLMENT_CREATED, resourceType = "Enrollment")
    public Enrollment createEnrollment(EnrollmentRequest request) {
        UUID tenantId = TenantContext.requireTenantId();
        UUID userId = TenantContext.requireUserId();

        rateLimitService.checkRateLimit(tenantId.toString(), userId.toString(), 2);

        // Verify plan exists and is active
        planService.getPlan(request.getPlanId());

        Enrollment enrollment = Enrollment.builder()
            .tenantId(tenantId)
            .employeeId(request.getEmployeeId())
            .planId(request.getPlanId())
            .status(Enrollment.EnrollmentStatus.PENDING)
            .effectiveDate(request.getEffectiveDate())
            .coverageLevel(sanitizer.sanitizeText(request.getCoverageLevel(), "coverageLevel", 30,
                tenantId.toString(), userId.toString()))
            .dependentCount(request.getDependentCount())
            .employeeContribution(request.getEmployeeContribution())
            .employerContribution(request.getEmployerContribution())
            .createdBy(userId)
            .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        log.info("Created enrollment: {} for employee: {}", saved.getId(), request.getEmployeeId());
        return saved;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE')")
    public Enrollment getEnrollment(UUID enrollmentId) {
        UUID tenantId = TenantContext.requireTenantId();
        return enrollmentRepository.findByIdAndTenantIdAndDeletedAtIsNull(enrollmentId, tenantId)
            .orElseThrow(() -> new com.zynctra.benefits.exception.TenantIsolationException(
                "Enrollment", enrollmentId.toString(), tenantId.toString(), tenantId.toString(),
                TenantContext.requireUserId().toString()));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Page<Enrollment> listEnrollments(Pageable pageable) {
        return enrollmentRepository.findByTenantIdAndDeletedAtIsNull(
            TenantContext.requireTenantId(), pageable);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN', 'EMPLOYEE')")
    public List<Enrollment> getEmployeeEnrollments(UUID employeeId) {
        UUID tenantId = TenantContext.requireTenantId();
        return enrollmentRepository.findByTenantIdAndEmployeeIdAndDeletedAtIsNull(tenantId, employeeId);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    @Audited(action = AuditAction.ENROLLMENT_CANCELLED, resourceType = "Enrollment")
    public void cancelEnrollment(UUID enrollmentId) {
        UUID userId = TenantContext.requireUserId();
        Enrollment enrollment = getEnrollment(enrollmentId);
        enrollment.setStatus(Enrollment.EnrollmentStatus.CANCELLED);
        enrollment.setUpdatedBy(userId);
        enrollmentRepository.save(enrollment);
        log.info("Cancelled enrollment: {} by user: {}", enrollmentId, userId);
    }
}
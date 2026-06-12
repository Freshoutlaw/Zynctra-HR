package com.zynctra.benefits.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zynctra.benefits.dto.BenefitPlanRequest;
import com.zynctra.benefits.dto.ClaimRequest;
import com.zynctra.benefits.dto.ClaimStatusUpdateRequest;
import com.zynctra.benefits.dto.EnrollmentRequest;
import com.zynctra.benefits.entity.BenefitPlan;
import com.zynctra.benefits.entity.Claim;
import com.zynctra.benefits.entity.Enrollment;
import com.zynctra.benefits.service.BenefitPlanService;
import com.zynctra.benefits.service.ClaimService;
import com.zynctra.benefits.service.EnrollmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/benefits")
@RequiredArgsConstructor
public class BenefitsController {

    private final BenefitPlanService planService;
    private final EnrollmentService enrollmentService;
    private final ClaimService claimService;

    // --- Benefit Plans ---

    @PostMapping("/plans")
    public ResponseEntity<BenefitPlan> createPlan(@Valid @RequestBody BenefitPlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(request));
    }

    @GetMapping("/plans/{planId}")
    public ResponseEntity<BenefitPlan> getPlan(@PathVariable UUID planId) {
        return ResponseEntity.ok(planService.getPlan(planId));
    }

    @GetMapping("/plans")
    public ResponseEntity<Page<BenefitPlan>> listPlans(Pageable pageable) {
        return ResponseEntity.ok(planService.listPlans(pageable));
    }

    @GetMapping("/plans/active")
    public ResponseEntity<List<BenefitPlan>> listActivePlans() {
        return ResponseEntity.ok(planService.listActivePlans());
    }

    @DeleteMapping("/plans/{planId}")
    public ResponseEntity<Void> deletePlan(@PathVariable UUID planId) {
        planService.deletePlan(planId);
        return ResponseEntity.noContent().build();
    }

    // --- Enrollments ---

    @PostMapping("/enrollments")
    public ResponseEntity<Enrollment> createEnrollment(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.createEnrollment(request));
    }

    @GetMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<Enrollment> getEnrollment(@PathVariable UUID enrollmentId) {
        return ResponseEntity.ok(enrollmentService.getEnrollment(enrollmentId));
    }

    @GetMapping("/enrollments")
    public ResponseEntity<Page<Enrollment>> listEnrollments(Pageable pageable) {
        return ResponseEntity.ok(enrollmentService.listEnrollments(pageable));
    }

    @GetMapping("/employees/{employeeId}/enrollments")
    public ResponseEntity<List<Enrollment>> getEmployeeEnrollments(@PathVariable UUID employeeId) {
        return ResponseEntity.ok(enrollmentService.getEmployeeEnrollments(employeeId));
    }

    @PostMapping("/enrollments/{enrollmentId}/cancel")
    public ResponseEntity<Void> cancelEnrollment(@PathVariable UUID enrollmentId) {
        enrollmentService.cancelEnrollment(enrollmentId);
        return ResponseEntity.noContent().build();
    }

    // --- Claims ---

    @PostMapping("/claims")
    public ResponseEntity<Claim> submitClaim(@Valid @RequestBody ClaimRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(claimService.submitClaim(request));
    }

    @GetMapping("/claims/{claimId}")
    public ResponseEntity<Claim> getClaim(@PathVariable UUID claimId) {
        return ResponseEntity.ok(claimService.getClaim(claimId));
    }

    @GetMapping("/claims")
    public ResponseEntity<Page<Claim>> listClaims(Pageable pageable) {
        return ResponseEntity.ok(claimService.listClaims(pageable));
    }

    @PatchMapping("/claims/{claimId}/status")
    public ResponseEntity<Claim> updateClaimStatus(@PathVariable UUID claimId,
                                                    @Valid @RequestBody ClaimStatusUpdateRequest request) {
        return ResponseEntity.ok(claimService.updateClaimStatus(claimId, request));
    }
}
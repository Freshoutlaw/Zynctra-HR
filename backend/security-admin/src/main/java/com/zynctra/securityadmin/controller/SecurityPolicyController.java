package com.zynctra.securityadmin.controller;

import com.zynctra.securityadmin.dto.SecurityPolicyDTO;
import com.zynctra.securityadmin.entity.SecurityPolicy;
import com.zynctra.securityadmin.service.SecurityPolicyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-admin/policies")
@Validated
public class SecurityPolicyController {
    private static final Logger logger = LoggerFactory.getLogger(SecurityPolicyController.class);
    private final SecurityPolicyService policyService;

    public SecurityPolicyController(SecurityPolicyService policyService) { this.policyService = policyService; }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public ResponseEntity<SecurityPolicyDTO> getPolicy(@PathVariable @NotBlank String id, @RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        return policyService.getPolicyById(id, tenantId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name/{name}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public ResponseEntity<SecurityPolicyDTO> getPolicyByName(@PathVariable @NotBlank String name, @RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        return policyService.getPolicyByName(name, tenantId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public ResponseEntity<Page<SecurityPolicyDTO>> listPolicies(@RequestHeader("X-Tenant-ID") @NotBlank String tenantId, Pageable pageable) {
        return ResponseEntity.ok(policyService.listPolicies(tenantId, pageable));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public ResponseEntity<List<SecurityPolicyDTO>> getAllActivePolicies(@RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        return ResponseEntity.ok(policyService.getAllActivePolicies(tenantId));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public ResponseEntity<List<SecurityPolicyDTO>> getPoliciesByType(@PathVariable SecurityPolicy.PolicyType type, @RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        return ResponseEntity.ok(policyService.getActivePoliciesByType(type, tenantId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public ResponseEntity<SecurityPolicyDTO> createPolicy(@RequestBody @Valid SecurityPolicyDTO dto, @RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(policyService.createPolicy(dto, tenantId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public ResponseEntity<SecurityPolicyDTO> updatePolicy(@PathVariable @NotBlank String id, @RequestBody @Valid SecurityPolicyDTO dto, @RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        return ResponseEntity.ok(policyService.updatePolicy(id, dto, tenantId));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SecurityPolicyDTO> approvePolicy(@PathVariable @NotBlank String id, @RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        return ResponseEntity.ok(policyService.approvePolicy(id, tenantId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deletePolicy(@PathVariable @NotBlank String id, @RequestHeader("X-Tenant-ID") @NotBlank String tenantId) {
        policyService.deletePolicy(id, tenantId);
        return ResponseEntity.noContent().build();
    }

    private String maskTenant(String tenantId) { if (tenantId == null || tenantId.length() < 8) return "***"; return tenantId.substring(0, 4) + "..." + tenantId.substring(tenantId.length() - 4); }
    private String maskId(String id) { if (id == null || id.length() < 8) return "***"; return id.substring(0, 4) + "..." + id.substring(id.length() - 4); }
}
package com.zynctra.securityadmin.service;

import com.zynctra.securityadmin.dto.PermissionDTO;
import com.zynctra.securityadmin.entity.Permission;
import com.zynctra.securityadmin.repository.PermissionRepository;
import com.zynctra.securityadmin.security.Audited;
import com.zynctra.securityadmin.security.PrivilegeEscalationGuard;
import com.zynctra.securityadmin.security.TenantContext;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final PrivilegeEscalationGuard escalationGuard;
    private final RateLimiter permissionRateLimiter;

    public PermissionService(PermissionRepository permissionRepository,
                             PrivilegeEscalationGuard escalationGuard,
                             @Qualifier("permissionRateLimiter") RateLimiter permissionRateLimiter) {
        this.permissionRepository = permissionRepository;
        this.escalationGuard = escalationGuard;
        this.permissionRateLimiter = permissionRateLimiter;
    }

    @Audited
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public Permission createPermission(PermissionDTO dto, String createdBy) {
        checkRateLimit();
        
        String tenantId = TenantContext.getCurrentTenant();
        if (permissionRepository.findByNameAndTenantId(dto.getName(), tenantId).isPresent()) {
            throw new IllegalArgumentException("Permission already exists: " + dto.getName());
        }

        Permission perm = Permission.create(
            dto.getName(),
            dto.getDescription(),
            dto.getAction(),
            dto.getResource(),
            dto.getScope(),
            createdBy
        );

        return permissionRepository.save(perm);
    }

    @Audited
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    @Transactional
    public void grantPermissionToRole(String permissionId, String roleName, String granterId) {
        checkRateLimit();
        
        String tenantId = TenantContext.getCurrentTenant();
        Permission perm = permissionRepository.findByIdAndTenantId(permissionId, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Permission not found"));

        escalationGuard.validatePermissionGrant(granterId, roleName, perm.getName());
        
        // Would update role_permissions join table in real implementation
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public List<Permission> getPermissionsByScope(String scope) {
        if (!scope.matches("^[a-z][a-z0-9_]*$")) {
            throw new IllegalArgumentException("Invalid scope format");
        }
        return permissionRepository.findByScope(scope, TenantContext.getCurrentTenant());
    }

    private void checkRateLimit() {
        try {
            permissionRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded — admin operations restricted");
        }
    }
}
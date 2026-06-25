package com.zynctra.securityadmin.service;

import com.zynctra.securityadmin.dto.RoleDTO;
import com.zynctra.securityadmin.entity.Role;
import com.zynctra.securityadmin.repository.RoleRepository;
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
public class RoleService {

    private final RoleRepository roleRepository;
    private final PrivilegeEscalationGuard escalationGuard;
    private final RateLimiter roleRateLimiter;

    public RoleService(RoleRepository roleRepository,
                       PrivilegeEscalationGuard escalationGuard,
                       @Qualifier("roleRateLimiter") RateLimiter roleRateLimiter) {
        this.roleRepository = roleRepository;
        this.escalationGuard = escalationGuard;
        this.roleRateLimiter = roleRateLimiter;
    }

    @Audited
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public Role createRole(RoleDTO dto, String createdBy) {
        checkRateLimit();
        
        // Validate role name doesn't already exist
        String tenantId = TenantContext.getCurrentTenant();
        if (roleRepository.findByNameAndTenantId(dto.getName(), tenantId).isPresent()) {
            throw new IllegalArgumentException("Role already exists: " + dto.getName());
        }

        Role role = Role.create(
            dto.getName(),
            dto.getDescription(),
            dto.getLevel(),
            dto.getIsProtected() != null ? dto.getIsProtected() : false,
            createdBy
        );

        return roleRepository.save(role);
    }

    @Audited
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    @Transactional
    public Role assignRoleToUser(String userId, String roleId, String assignerId) {
        checkRateLimit();
        
        String tenantId = TenantContext.getCurrentTenant();
        Role role = roleRepository.findByIdAndTenantId(roleId, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Role not found"));

        // CRITICAL: Privilege escalation check
        escalationGuard.validateRoleAssignment(assignerId, userId, role.getName(), role.getLevel());

        // Perform assignment (would update user_roles table in real implementation)
        return role;
    }

    @Audited
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public void deleteRole(String roleId, String deletedBy) {
        checkRateLimit();
        
        String tenantId = TenantContext.getCurrentTenant();
        Role role = roleRepository.findByIdAndTenantId(roleId, tenantId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Role not found"));

        // CRITICAL: Privilege escalation check
        escalationGuard.validateRoleDeletion(role.getName());

        role.setDeleted(true);
        role.setUpdatedBy(deletedBy);
        roleRepository.save(role);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public List<Role> getAllRoles() {
        return roleRepository.findAllByTenantId(TenantContext.getCurrentTenant());
    }

    private void checkRateLimit() {
        try {
            roleRateLimiter.acquirePermission();
        } catch (RequestNotPermitted e) {
            throw new SecurityException("Rate limit exceeded — admin operations restricted");
        }
    }
}
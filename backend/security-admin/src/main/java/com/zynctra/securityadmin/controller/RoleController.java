package com.zynctra.securityadmin.controller;

import com.zynctra.securityadmin.dto.RoleDTO;
import com.zynctra.securityadmin.entity.Role;
import com.zynctra.securityadmin.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<<Role> createRole(@Valid @RequestBody RoleDTO dto, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(roleService.createRole(dto, auth.getName()));
    }

    @PostMapping("/{roleId}/assign/{userId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public ResponseEntity<<Role> assignRole(@PathVariable String roleId,
                                            @PathVariable String userId,
                                            Authentication auth) {
        if (!roleId.matches("^[a-f0-9\\-]{36}$") || !userId.matches("^[a-zA-Z0-9\\-_]{4,64}$")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(roleService.assignRoleToUser(userId, roleId, auth.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public ResponseEntity<List<<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteRole(@PathVariable String id, Authentication auth) {
        if (!id.matches("^[a-f0-9\\-]{36}$")) {
            return ResponseEntity.badRequest().build();
        }
        roleService.deleteRole(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, String>> handleSecurity(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("error", "Security violation", "message", ex.getMessage()));
    }
}
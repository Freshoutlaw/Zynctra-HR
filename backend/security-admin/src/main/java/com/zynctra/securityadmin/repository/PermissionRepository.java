package com.zynctra.securityadmin.repository;

import com.zynctra.securityadmin.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {

    @Query("SELECT p FROM Permission p WHERE p.id = :id AND p.tenantId = :tenantId AND p.deleted = false")
    Optional<Permission> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM Permission p WHERE p.name = :name AND p.tenantId = :tenantId AND p.deleted = false")
    Optional<Permission> findByNameAndTenantId(@Param("name") String name, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM Permission p WHERE p.scope = :scope AND p.tenantId = :tenantId AND p.deleted = false ORDER BY p.name")
    List<Permission> findByScope(@Param("scope") String scope, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM Permission p WHERE p.tenantId = :tenantId AND p.deleted = false ORDER BY p.scope, p.name")
    List<Permission> findAllByTenantId(@Param("tenantId") String tenantId);

    @Query("SELECT p FROM Permission p JOIN p.roles r WHERE r.id = :roleId AND p.tenantId = :tenantId AND p.deleted = false")
    List<Permission> findByRoleId(@Param("roleId") String roleId, @Param("tenantId") String tenantId);
}
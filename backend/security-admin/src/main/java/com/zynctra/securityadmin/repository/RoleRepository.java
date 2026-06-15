package com.zynctra.securityadmin.repository;

import com.zynctra.securityadmin.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<<Role, String> {

    @Query("SELECT r FROM Role r WHERE r.id = :id AND r.tenantId = :tenantId AND r.deleted = false")
    Optional<<Role> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT r FROM Role r WHERE r.name = :name AND r.tenantId = :tenantId AND r.deleted = false")
    Optional<<Role> findByNameAndTenantId(@Param("name") String name, @Param("tenantId") String tenantId);

    @Query("SELECT r FROM Role r WHERE r.tenantId = :tenantId AND r.deleted = false ORDER BY r.level")
    List<<Role> findAllByTenantId(@Param("tenantId") String tenantId);

    @Query("SELECT r FROM Role r WHERE r.level <= :maxLevel AND r.tenantId = :tenantId AND r.deleted = false ORDER BY r.level")
    List<<Role> findByMaxLevel(@Param("maxLevel") int maxLevel, @Param("tenantId") String tenantId);

    @Query("SELECT COUNT(r) FROM Role r WHERE r.isProtected = true AND r.tenantId = :tenantId AND r.deleted = false")
    long countProtectedRoles(@Param("tenantId") String tenantId);
}
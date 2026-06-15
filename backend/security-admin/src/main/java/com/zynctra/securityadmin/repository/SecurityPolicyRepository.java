package com.zynctra.securityadmin.repository;

import com.zynctra.securityadmin.entity.SecurityPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SecurityPolicyRepository extends JpaRepository<SecurityPolicy, String> {

    @Query("SELECT p FROM SecurityPolicy p WHERE p.id = :id AND p.tenantId = :tenantId AND p.deleted = false")
    Optional<SecurityPolicy> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM SecurityPolicy p WHERE p.policyName = :name AND p.tenantId = :tenantId AND p.deleted = false")
    Optional<SecurityPolicy> findByNameAndTenantId(@Param("name") String name, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM SecurityPolicy p WHERE p.policyType = :type AND p.tenantId = :tenantId AND p.active = true AND p.deleted = false")
    List<SecurityPolicy> findActiveByType(@Param("type") SecurityPolicy.PolicyType type, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM SecurityPolicy p WHERE p.tenantId = :tenantId AND p.deleted = false ORDER BY p.policyType, p.policyName")
    List<SecurityPolicy> findAllByTenantId(@Param("tenantId") String tenantId);

    @Query("SELECT p FROM SecurityPolicy p WHERE p.tenantId = :tenantId AND p.active = true AND p.deleted = false")
    List<SecurityPolicy> findAllActive(@Param("tenantId") String tenantId);
}
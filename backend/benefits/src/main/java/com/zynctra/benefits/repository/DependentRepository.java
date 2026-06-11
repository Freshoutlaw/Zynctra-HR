package com.zynctra.benefits.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zynctra.benefits.entity.Dependent;

@Repository
public interface DependentRepository extends JpaRepository<Dependent, UUID> {

    List<Dependent> findByTenantIdAndEmployeeIdAndDeletedAtIsNull(
        UUID tenantId, UUID employeeId);

    Optional<Dependent> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);

    long countByTenantIdAndEmployeeIdAndDeletedAtIsNull(UUID tenantId, UUID employeeId);
}
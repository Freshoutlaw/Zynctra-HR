package com.zynctra.benefits.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.benefits.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    Optional<Enrollment> findByEmployeeIdAndPlanId(UUID employeeId, UUID planId);

    List<Enrollment> findByEmployeeId(UUID employeeId);

    @Query("SELECT e FROM Enrollment e WHERE e.tenantId = :tenantId")
    Page<Enrollment> findByTenantId(UUID tenantId, Pageable pageable);

    @Query("SELECT e FROM Enrollment e WHERE e.employeeId = :employeeId AND e.tenantId = :tenantId")
    List<Enrollment> findByEmployeeIdAndTenantId(UUID employeeId, UUID tenantId);

    Optional<Enrollment> findByIdAndTenantId(UUID id, UUID tenantId);

    @Query("SELECT e FROM Enrollment e WHERE e.tenantId = :tenantId")
    Page<Enrollment> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    @Query("SELECT e FROM Enrollment e WHERE e.tenantId = :tenantId AND e.employeeId = :employeeId")
    List<Enrollment> findByTenantIdAndEmployeeIdAndDeletedAtIsNull(UUID tenantId, UUID employeeId);

    Optional<Enrollment> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);
}
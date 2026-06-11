package com.zynctra.corehr.repository;

import com.zynctra.corehr.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findByIdAndTenantId(String id, String tenantId);
    Optional<Employee> findByEmailAndTenantId(String email, String tenantId);
    Page<Employee> findByTenantIdAndDeletedAtIsNull(String tenantId, Pageable pageable);
    Page<Employee> findByTenantIdAndStatusAndDeletedAtIsNull(String tenantId, String status, Pageable pageable);
}

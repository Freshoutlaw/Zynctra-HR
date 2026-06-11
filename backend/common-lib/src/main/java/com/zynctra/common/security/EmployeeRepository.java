package com.zynctra.hr.repository;

import com.zynctra.hr.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    List<Employee> findByTenantId(String tenantId);
    Optional<Employee> findByIdAndTenantId(UUID id, String tenantId);
}
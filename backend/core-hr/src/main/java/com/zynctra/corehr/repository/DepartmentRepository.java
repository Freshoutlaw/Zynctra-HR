package com.zynctra.corehr.repository;

import com.zynctra.corehr.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {

    @Query("SELECT d FROM Department d " +
           "WHERE d.id = :id AND d.tenantId = :tenantId AND d.deleted = false")
    Optional<Department> findByIdAndTenant(
            @Param("id") String id,
            @Param("tenantId") String tenantId);

    @Query("SELECT d FROM Department d " +
           "WHERE d.tenantId = :tenantId AND d.deleted = false AND d.active = true " +
           "ORDER BY d.name")
    List<Department> findAllActiveByTenant(@Param("tenantId") String tenantId);

    @Query("SELECT d FROM Department d " +
           "WHERE d.code = :code AND d.tenantId = :tenantId AND d.deleted = false")
    Optional<Department> findByCodeAndTenant(
            @Param("code") String code,
            @Param("tenantId") String tenantId);

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END " +
           "FROM Department d " +
           "WHERE d.code = :code AND d.tenantId = :tenantId AND d.deleted = false")
    boolean existsByCodeAndTenant(
            @Param("code") String code,
            @Param("tenantId") String tenantId);
}
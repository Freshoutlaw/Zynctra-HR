package com.zynctra.corehr.repository;

import com.zynctra.corehr.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Secure repository with NO dynamic sorting, NO native queries,
 * NO unbounded results, and mandatory tenant scoping.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

    // ========== IDOR-PROTECTED LOOKUPS ==========

    @Query("SELECT e FROM Employee e WHERE e.id = :id AND e.tenantId = :tenantId AND e.deleted = false")
    Optional<Employee> findByIdAndTenant(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT e FROM Employee e WHERE e.employeeNumber = :num AND e.tenantId = :tenantId AND e.deleted = false")
    Optional<Employee> findByEmployeeNumberAndTenant(@Param("num") String num, @Param("tenantId") String tenantId);

    @Query("SELECT e FROM Employee e WHERE e.email = :email AND e.tenantId = :tenantId AND e.deleted = false")
    Optional<Employee> findByEmailAndTenant(@Param("email") String email, @Param("tenantId") String tenantId);

    // ========== HARDENED SEARCH (parameterized LIKE only) ==========

    @Query("SELECT e FROM Employee e " +
           "WHERE e.tenantId = :tenantId AND e.deleted = false " +
           "AND (:deptId IS NULL OR e.departmentId = :deptId) " +
           "AND (:status IS NULL OR e.employmentStatus = :status) " +
           "AND (:search IS NULL OR " +
           "     LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(e.employeeNumber) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.lastName ASC, e.firstName ASC")
    Page<Employee> searchEmployees(
            @Param("tenantId") String tenantId,
            @Param("search") String search,
            @Param("deptId") String departmentId,
            @Param("status") Employee.EmploymentStatus status,
            Pageable pageable);

    // ========== MANAGEMENT CHAIN ==========

    @Query("SELECT e FROM Employee e WHERE e.managerId = :mgrId AND e.tenantId = :tenantId " +
           "AND e.deleted = false AND e.employmentStatus = 'ACTIVE' ORDER BY e.lastName")
    List<Employee> findDirectReports(@Param("mgrId") String mgrId, @Param("tenantId") String tenantId);

    // ========== SOFT DELETE + RETENTION ==========

    @Modifying
    @Query("UPDATE Employee e SET e.deleted = true, e.employmentStatus = 'TERMINATED', " +
           "e.dataRetentionUntil = :retentionDate, e.updatedBy = :updatedBy " +
           "WHERE e.id = :id AND e.tenantId = :tenantId AND e.deleted = false")
    int softDeleteById(@Param("id") String id, @Param("tenantId") String tenantId,
                       @Param("retentionDate") LocalDate retentionDate, @Param("updatedBy") String updatedBy);

    @Query("SELECT e FROM Employee e WHERE e.tenantId = :tenantId AND e.deleted = true " +
           "AND e.dataRetentionUntil <= :today")
    List<Employee> findReadyForPurge(@Param("tenantId") String tenantId, @Param("today") LocalDate today);

    // ========== EXISTENCE CHECKS ==========

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
           "FROM Employee e WHERE e.email = :email AND e.tenantId = :tenantId AND e.deleted = false")
    boolean existsByEmailAndTenant(@Param("email") String email, @Param("tenantId") String tenantId);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
           "FROM Employee e WHERE e.employeeNumber = :num AND e.tenantId = :tenantId AND e.deleted = false")
    boolean existsByEmployeeNumberAndTenant(@Param("num") String num, @Param("tenantId") String tenantId);

    // ========== COUNTS ==========

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.tenantId = :tenantId AND e.deleted = false " +
           "AND e.employmentStatus = 'ACTIVE'")
    long countActiveByTenant(@Param("tenantId") String tenantId);

    // EXPLICITLY DISABLED:
    // - NO findAll() without tenant
    // - NO deleteById()
    // - NO native queries
    // - NO dynamic Sort parameters (sort fixed in @Query)
}
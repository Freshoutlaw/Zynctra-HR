package com.zynctra.learning.repository;

import com.zynctra.learning.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {

    // CRITICAL: All queries MUST include tenant filter
    // Hibernate @Filter on SecureBaseEntity handles this automatically,
    // but we add explicit checks for defense-in-depth
    
    @Query("SELECT c FROM Course c WHERE c.id = :id AND c.tenantId = :tenantId AND c.deleted = false")
    Optional<Course> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT c FROM Course c WHERE c.tenantId = :tenantId AND c.active = true AND c.deleted = false")
    List<Course> findActiveByTenantId(@Param("tenantId") String tenantId);

    @Query("SELECT c FROM Course c WHERE c.category = :category AND c.tenantId = :tenantId AND c.active = true")
    List<Course> findByCategoryAndTenantId(@Param("category") String category, @Param("tenantId") String tenantId);

    // Prevent mass assignment: no update queries that skip tenant check
    @Query("UPDATE Course c SET c.active = false, c.deleted = true, c.updatedBy = :updatedBy WHERE c.id = :id AND c.tenantId = :tenantId")
    int softDeleteById(@Param("id") String id, @Param("tenantId") String tenantId, @Param("updatedBy") String updatedBy);
}
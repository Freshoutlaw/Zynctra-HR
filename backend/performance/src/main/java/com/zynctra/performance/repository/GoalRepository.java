package com.zynctra.performance.repository;

import com.zynctra.performance.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Goal Repository
 * 
 * SECURITY: All queries tenant-scoped, no physical deletion.
 */
@Repository
public interface GoalRepository extends JpaRepository<Goal, String> {

    @Query("SELECT g FROM Goal g WHERE g.id = :id AND g.tenantId = :tenantId AND g.deleted = false")
    Optional<Goal> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT g FROM Goal g WHERE g.employeeId = :employeeId AND g.tenantId = :tenantId AND g.deleted = false ORDER BY g.dueDate")
    List<Goal> findByEmployeeId(@Param("employeeId") String employeeId, @Param("tenantId") String tenantId);

    @Query("SELECT g FROM Goal g WHERE g.employeeId = :employeeId AND g.status = :status AND g.tenantId = :tenantId AND g.deleted = false")
    List<Goal> findByEmployeeIdAndStatus(@Param("employeeId") String employeeId, 
                                          @Param("status") Goal.GoalStatus status, 
                                          @Param("tenantId") String tenantId);

    @Query("SELECT g FROM Goal g WHERE g.dueDate < :today AND g.status = 'ACTIVE' AND g.tenantId = :tenantId AND g.deleted = false")
    List<Goal> findOverdueGoals(@Param("today") LocalDate today, @Param("tenantId") String tenantId);

    @Modifying
    @Query("UPDATE Goal g SET g.deleted = true, g.updatedBy = :updatedBy, g.updatedAt = CURRENT_TIMESTAMP WHERE g.id = :id AND g.tenantId = :tenantId")
    int softDeleteById(@Param("id") String id, @Param("tenantId") String tenantId, @Param("updatedBy") String updatedBy);

    @Query("SELECT COUNT(g) FROM Goal g WHERE g.employeeId = :employeeId AND g.status = 'ACTIVE' AND g.tenantId = :tenantId AND g.deleted = false")
    long countActiveGoalsByEmployee(@Param("employeeId") String employeeId, @Param("tenantId") String tenantId);
}
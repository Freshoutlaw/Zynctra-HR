package com.zynctra.timeattendance.repository;

import com.zynctra.timeattendance.entity.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, String> {

    @Query("SELECT w FROM WorkSchedule w WHERE w.id = :id AND w.tenantId = :tenantId AND w.deleted = false")
    Optional<WorkSchedule> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT w FROM WorkSchedule w WHERE w.employeeId = :employeeId AND w.dayOfWeek = :dayOfWeek AND w.effectiveDate <= :date AND w.active = true AND w.tenantId = :tenantId AND w.deleted = false ORDER BY w.effectiveDate DESC LIMIT 1")
    Optional<WorkSchedule> findActiveForEmployeeAndDay(@Param("employeeId") String employeeId,
                                                        @Param("dayOfWeek") DayOfWeek dayOfWeek,
                                                        @Param("date") LocalDate date,
                                                        @Param("tenantId") String tenantId);

    @Query("SELECT w FROM WorkSchedule w WHERE w.employeeId = :employeeId AND w.tenantId = :tenantId AND w.deleted = false ORDER BY w.effectiveDate DESC")
    List<WorkSchedule> findByEmployeeId(@Param("employeeId") String employeeId, @Param("tenantId") String tenantId);
}
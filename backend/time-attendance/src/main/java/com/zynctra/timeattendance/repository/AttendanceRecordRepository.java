package com.zynctra.timeattendance.repository;

import com.zynctra.timeattendance.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, String> {

    @Query("SELECT a FROM AttendanceRecord a WHERE a.id = :id AND a.tenantId = :tenantId AND a.deleted = false")
    Optional<AttendanceRecord> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.employeeId = :employeeId AND a.recordDate = :date AND a.tenantId = :tenantId AND a.deleted = false")
    Optional<AttendanceRecord> findByEmployeeAndDate(@Param("employeeId") String employeeId, 
                                                      @Param("date") LocalDate date, 
                                                      @Param("tenantId") String tenantId);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.employeeId = :employeeId AND a.tenantId = :tenantId AND a.deleted = false ORDER BY a.recordDate DESC")
    List<AttendanceRecord> findByEmployeeId(@Param("employeeId") String employeeId, @Param("tenantId") String tenantId);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.employeeId = :employeeId AND a.recordDate BETWEEN :start AND :end AND a.tenantId = :tenantId AND a.deleted = false ORDER BY a.recordDate")
    List<AttendanceRecord> findByEmployeeAndDateRange(@Param("employeeId") String employeeId,
                                                       @Param("start") LocalDate start,
                                                       @Param("end") LocalDate end,
                                                       @Param("tenantId") String tenantId);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.status = 'PENDING_APPROVAL' AND a.tenantId = :tenantId AND a.deleted = false")
    List<AttendanceRecord> findPendingApprovals(@Param("tenantId") String tenantId);

    @Modifying
    @Query("UPDATE AttendanceRecord a SET a.deleted = true, a.updatedBy = :updatedBy, a.updatedAt = CURRENT_TIMESTAMP WHERE a.id = :id AND a.tenantId = :tenantId")
    int softDeleteById(@Param("id") String id, @Param("tenantId") String tenantId, @Param("updatedBy") String updatedBy);
}
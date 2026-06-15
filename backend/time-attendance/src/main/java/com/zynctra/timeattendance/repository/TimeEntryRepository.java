package com.zynctra.timeattendance.repository;

import com.zynctra.timeattendance.entity.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, String> {

    @Query("SELECT t FROM TimeEntry t WHERE t.id = :id AND t.tenantId = :tenantId")
    Optional<TimeEntry> findByIdAndTenantId(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT t FROM TimeEntry t WHERE t.employeeId = :employeeId AND t.tenantId = :tenantId ORDER BY t.timestamp DESC")
    List<TimeEntry> findByEmployeeId(@Param("employeeId") String employeeId, @Param("tenantId") String tenantId);

    @Query("SELECT t FROM TimeEntry t WHERE t.employeeId = :employeeId AND t.timestamp BETWEEN :start AND :end AND t.tenantId = :tenantId ORDER BY t.timestamp")
    List<TimeEntry> findByEmployeeAndTimeRange(@Param("employeeId") String employeeId,
                                                @Param("start") LocalDateTime start,
                                                @Param("end") LocalDateTime end,
                                                @Param("tenantId") String tenantId);

    @Query("SELECT t FROM TimeEntry t WHERE t.employeeId = :employeeId AND t.entryType = :type AND t.timestamp >= :since AND t.tenantId = :tenantId ORDER BY t.timestamp DESC LIMIT 1")
    Optional<TimeEntry> findLastEntryByType(@Param("employeeId") String employeeId,
                                             @Param("type") TimeEntry.EntryType type,
                                             @Param("since") LocalDateTime since,
                                             @Param("tenantId") String tenantId);
}
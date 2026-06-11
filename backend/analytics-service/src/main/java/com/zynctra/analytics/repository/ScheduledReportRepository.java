package com.zynctra.analytics.repository;

import com.zynctra.analytics.entity.ScheduledReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduledReportRepository extends JpaRepository<ScheduledReport, UUID> {

    @Query("SELECT s FROM ScheduledReport s WHERE s.isActive = true AND s.nextRunAt <= :now")
    List<ScheduledReport> findDueForExecution(Instant now);

    List<ScheduledReport> findByTenantIdAndIsActiveTrue(UUID tenantId);

    List<ScheduledReport> findByFailureCountGreaterThanEqual(Integer failureCount);

    List<ScheduledReport> findByReportIdAndIsActiveTrue(UUID reportId);
}
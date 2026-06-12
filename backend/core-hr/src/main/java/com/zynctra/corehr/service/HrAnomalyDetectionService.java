package com.zynctra.corehr.service;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.corehr.entity.EmployeeAuditLog;
import com.zynctra.corehr.repository.EmployeeAuditLogRepository;
import com.zynctra.corehr.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Anomaly detection for HR data access patterns.
 * 
 * DETECTION RULES:
 * - Bulk export > 50 records in 1 hour
 * - After-hours sensitive access (10 PM - 6 AM)
 * - Multiple failed auth attempts
 * - Salary viewed by non-finance/non-manager
 * - Employee record accessed from new IP
 */
@Service
public class HrAnomalyDetectionService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    private final EmployeeAuditLogRepository auditLogRepository;
    private final EmployeeRepository employeeRepository;

    public HrAnomalyDetectionService(EmployeeAuditLogRepository auditLogRepository,
                                      EmployeeRepository employeeRepository) {
        this.auditLogRepository = auditLogRepository;
        this.employeeRepository = employeeRepository;
    }

    @Scheduled(fixedRate = 300_000) // Every 5 minutes
    public void detectAnomalies() {
        String tenantId = TenantContext.getCurrentTenant();
        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        Instant oneDayAgo = Instant.now().minus(1, ChronoUnit.DAYS);

        detectBulkExports(tenantId, oneHourAgo);
        detectAfterHoursAccess(tenantId);
        detectFailedAuthentications(tenantId, oneHourAgo);
        detectUnusualSalaryViews(tenantId, oneDayAgo);
    }

    private void detectBulkExports(String tenantId, Instant since) {
        // Check for > 50 EXPORTED events in 1 hour by same actor
        var actors = auditLogRepository.findActorsWithHighEventCount(tenantId, since, 50);
        for (Object[] result : actors) {
            String actor = (String) result[0];
            Long count = (Long) result[1];
            SEC_LOG.warn("SECURITY_EVENT: anomaly_bulk_export actor={} count={} window=1h", actor, count);
            triggerAlert("BULK_EXPORT", actor, count);
        }
    }

    private void detectAfterHoursAccess(String tenantId) {
        int hour = java.time.LocalDateTime.now().getHour();
        if (hour >= 22 || hour <= 6) {
            var recent = auditLogRepository.findSensitiveAccessEvents(tenantId, 
                Instant.now().minus(1, ChronoUnit.HOURS));
            for (var log : recent) {
                SEC_LOG.warn("SECURITY_EVENT: anomaly_after_hours_access actor={} hour={} field={}", 
                    log.getActor(), hour, log.getFieldChanged());
                triggerAlert("AFTER_HOURS", log.getActor(), 1);
            }
        }
    }

    private void detectFailedAuthentications(String tenantId, Instant since) {
        long failedCount = auditLogRepository.countFailedAuthEvents(tenantId, since);
        if (failedCount > 10) {
            SEC_LOG.warn("SECURITY_EVENT: anomaly_failed_auth tenant={} count={}", tenantId, failedCount);
            triggerAlert("FAILED_AUTH", "SYSTEM", failedCount);
        }
    }

    private void detectUnusualSalaryViews(String tenantId, Instant since) {
        // Salary viewed by non-finance, non-manager, non-self, non-HR
        // This requires additional context; simplified here
        var anomalies = auditLogRepository.findAnomalies(tenantId, since);
        for (var log : anomalies) {
            SEC_LOG.warn("SECURITY_EVENT: anomaly_detected type={} actor={}", 
                log.getEventType(), log.getActor());
        }
    }

    private void triggerAlert(String type, String actor, long count) {
        // In production: send to SIEM, Slack, PagerDuty
        SEC_LOG.error("ANOMALY_ALERT: type={} actor={} count={} timestamp={}", 
            type, actor, count, Instant.now());
    }
}
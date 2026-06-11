package com.zynctra.analytics.service;

import com.zynctra.analytics.entity.Report;
import com.zynctra.analytics.entity.ScheduledReport;
import com.zynctra.analytics.repository.ReportRepository;
import com.zynctra.analytics.repository.ScheduledReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduledReportService {

    private final ScheduledReportRepository scheduledReportRepository;
    private final ReportRepository reportRepository;
    private final ReportService reportService;
    private final ExportService exportService;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void processScheduledReports() {
        log.info("Processing scheduled reports");

        List<ScheduledReport> dueReports = scheduledReportRepository.findDueForExecution(Instant.now());

        for (ScheduledReport scheduled : dueReports) {
            try {
                scheduled.setLastRunStatus(ScheduledReport.RunStatus.RUNNING);
                scheduled.setLastRunAt(Instant.now());
                scheduledReportRepository.save(scheduled);

                Report report = reportRepository.findById(scheduled.getReportId()).orElse(null);
                if (report == null || !report.getIsActive()) {
                    scheduled.setLastRunStatus(ScheduledReport.RunStatus.FAILED);
                    scheduled.setLastRunError("Report not found or inactive");
                    scheduled.setFailureCount(scheduled.getFailureCount() + 1);
                    scheduledReportRepository.save(scheduled);
                    continue;
                }

                reportService.recordExecution(report.getId(), Report.ExecutionStatus.RUNNING);

                scheduled.setLastRunStatus(ScheduledReport.RunStatus.COMPLETED);
                scheduled.setRunCount(scheduled.getRunCount() + 1);
                scheduled.setNextRunAt(calculateNextRun(scheduled.getCronExpression()));
                scheduledReportRepository.save(scheduled);

                reportService.recordExecution(report.getId(), Report.ExecutionStatus.COMPLETED);

                log.info("Executed scheduled report: {}", scheduled.getId());

            } catch (Exception e) {
                log.error("Failed to execute scheduled report {}: {}", scheduled.getId(), e.getMessage());
                scheduled.setLastRunStatus(ScheduledReport.RunStatus.FAILED);
                scheduled.setLastRunError(e.getMessage());
                scheduled.setFailureCount(scheduled.getFailureCount() + 1);
                scheduled.setNextRunAt(calculateNextRun(scheduled.getCronExpression()));
                scheduledReportRepository.save(scheduled);
            }
        }
    }

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupFailedSchedules() {
        List<ScheduledReport> failed = scheduledReportRepository.findByFailureCountGreaterThanEqual(5);
        for (ScheduledReport scheduled : failed) {
            scheduled.setIsActive(false);
            scheduled.setLastRunStatus(ScheduledReport.RunStatus.DISABLED);
            scheduledReportRepository.save(scheduled);
            log.info("Disabled scheduled report due to repeated failures: {}", scheduled.getId());
        }
    }

    private Instant calculateNextRun(String cronExpression) {
        CronExpression expression = CronExpression.parse(cronExpression);
        return expression.next(Instant.now().atZone(ZoneId.systemDefault())).toInstant();
    }
}
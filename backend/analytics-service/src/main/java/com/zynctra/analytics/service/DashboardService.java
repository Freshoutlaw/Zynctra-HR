package com.zynctra.analytics.service;

import com.zynctra.analytics.dto.DashboardSummaryResponse;
import com.zynctra.analytics.entity.DashboardWidget;
import com.zynctra.analytics.repository.DashboardWidgetRepository;
import com.zynctra.analytics.security.Role;
import com.zynctra.analytics.security.TenantAuthenticationToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Dashboard Service
 * 
 * Provides dashboard metrics and widget data with role-based access control.
 * Uses caching for performance and database views for complex aggregations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardWidgetRepository widgetRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Gets the main dashboard summary with all key metrics.
     * Results are cached for 5 minutes per tenant.
     */
    @Cacheable(value = "dashboardMetrics", key = "#tenantId.toString() + '_' + #role.name()")
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(UUID tenantId, Role role) {
        log.debug("Generating dashboard summary for tenant: {}, role: {}", tenantId, role);

        String period = YearMonth.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));

        return DashboardSummaryResponse.builder()
            .generatedAt(Instant.now())
            .period(period)
            .metrics(buildMetrics(tenantId))
            .charts(buildCharts(tenantId))
            .recentActivity(buildRecentActivity(tenantId))
            .alerts(buildAlerts(tenantId))
            .build();
    }

    /**
     * Gets dashboard widgets configured for the current user's role.
     */
    @Transactional(readOnly = true)
    public List<DashboardWidget> getWidgetsForUser(UUID tenantId, Role role) {
        return widgetRepository.findAccessibleByRole(tenantId, role);
    }

    /**
     * Builds key metrics from database aggregations.
     */
    private DashboardSummaryResponse.Metrics buildMetrics(UUID tenantId) {
        // Total employees
        Integer totalEmployees = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM hr.employees WHERE tenant_id = ? AND deleted_at IS NULL",
            Integer.class, tenantId
        );

        // Active employees
        Integer activeEmployees = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM hr.employees WHERE tenant_id = ? AND deleted_at IS NULL AND is_active = true",
            Integer.class, tenantId
        );

        // New hires this month
        Integer newHires = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM hr.employees WHERE tenant_id = ? AND deleted_at IS NULL " +
            "AND EXTRACT(MONTH FROM hire_date) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM hire_date) = EXTRACT(YEAR FROM CURRENT_DATE)",
            Integer.class, tenantId
        );

        // Departures this month
        Integer departures = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM hr.employees WHERE tenant_id = ? AND deleted_at IS NULL " +
            "AND termination_date IS NOT NULL " +
            "AND EXTRACT(MONTH FROM termination_date) = EXTRACT(MONTH FROM CURRENT_DATE) " +
            "AND EXTRACT(YEAR FROM termination_date) = EXTRACT(YEAR FROM CURRENT_DATE)",
            Integer.class, tenantId
        );

        // Attrition rate
        BigDecimal attritionRate = calculateAttritionRate(tenantId);

        // Attendance rate
        BigDecimal attendanceRate = calculateAttendanceRate(tenantId);

        // Open positions
        Integer openPositions = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM ats.job_requisitions WHERE tenant_id = ? AND status = 'OPEN'",
            Integer.class, tenantId
        );

        // Pending approvals
        Integer pendingApprovals = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM time.leave_requests WHERE tenant_id = ? AND status = 'PENDING'",
            Integer.class, tenantId
        );

        // Monthly payroll total
        BigDecimal monthlyPayroll = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(total_net), 0) FROM payroll.payroll_runs " +
            "WHERE tenant_id = ? AND status = 'PROCESSED' " +
            "AND EXTRACT(MONTH FROM period_end) = EXTRACT(MONTH FROM CURRENT_DATE)",
            BigDecimal.class, tenantId
        );

        return DashboardSummaryResponse.Metrics.builder()
            .totalEmployees(totalEmployees != null ? totalEmployees : 0)
            .activeEmployees(activeEmployees != null ? activeEmployees : 0)
            .newHiresThisMonth(newHires != null ? newHires : 0)
            .departuresThisMonth(departures != null ? departures : 0)
            .attritionRate(attritionRate)
            .attendanceRate(attendanceRate)
            .openPositions(openPositions != null ? openPositions : 0)
            .pendingApprovals(pendingApprovals != null ? pendingApprovals : 0)
            .monthlyPayrollTotal(monthlyPayroll != null ? monthlyPayroll : BigDecimal.ZERO)
            .leaveRequestsPending(pendingApprovals != null ? pendingApprovals : 0)
            .build();
    }

    /**
     * Calculates the annual attrition rate.
     */
    private BigDecimal calculateAttritionRate(UUID tenantId) {
        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(
                """
                SELECT 
                    COUNT(*) FILTER (WHERE is_active = true) as active_count,
                    COUNT(*) FILTER (WHERE termination_date IS NOT NULL 
                        AND termination_date >= CURRENT_DATE - INTERVAL '12 months') as departures
                FROM hr.employees 
                WHERE tenant_id = ? AND deleted_at IS NULL
                """,
                tenantId
            );

            Integer activeCount = (Integer) result.get("active_count");
            Integer departures = (Integer) result.get("departures");

            if (activeCount == null || activeCount == 0 || departures == null) {
                return BigDecimal.ZERO;
            }

            return BigDecimal.valueOf(departures)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(activeCount + departures), 2, RoundingMode.HALF_UP);

        } catch (Exception e) {
            log.warn("Failed to calculate attrition rate for tenant {}: {}", tenantId, e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    /**
     * Calculates the current month's attendance rate.
     */
    private BigDecimal calculateAttendanceRate(UUID tenantId) {
        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(
                """
                SELECT 
                    COUNT(*) FILTER (WHERE punch_type = 'IN') as total_punches,
                    COUNT(DISTINCT employee_id) as unique_employees
                FROM time.time_punches 
                WHERE tenant_id = ? 
                AND EXTRACT(MONTH FROM timestamp) = EXTRACT(MONTH FROM CURRENT_DATE)
                AND EXTRACT(YEAR FROM timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)
                """,
                tenantId
            );

            Long totalPunches = ((Number) result.get("total_punches")).longValue();
            Long uniqueEmployees = ((Number) result.get("unique_employees")).longValue();

            if (uniqueEmployees == 0) {
                return BigDecimal.ZERO;
            }

            // Assume 20 working days per month, 1 punch per day
            long expectedPunches = uniqueEmployees * 20;
            if (expectedPunches == 0) return BigDecimal.ZERO;

            return BigDecimal.valueOf(totalPunches)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(expectedPunches), 2, RoundingMode.HALF_UP);

        } catch (Exception e) {
            log.warn("Failed to calculate attendance rate for tenant {}: {}", tenantId, e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    /**
     * Builds chart data for the dashboard.
     */
    private List<DashboardSummaryResponse.ChartData> buildCharts(UUID tenantId) {
        List<DashboardSummaryResponse.ChartData> charts = new ArrayList<>();

        // Hiring trend chart (last 6 months)
        charts.add(buildHiringTrendChart(tenantId));

        // Department distribution chart
        charts.add(buildDepartmentDistributionChart(tenantId));

        // Attendance trend chart
        charts.add(buildAttendanceTrendChart(tenantId));

        return charts;
    }

    private DashboardSummaryResponse.ChartData buildHiringTrendChart(UUID tenantId) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            """
            SELECT 
                TO_CHAR(hire_date, 'Mon YYYY') as month,
                COUNT(*) as count
            FROM hr.employees 
            WHERE tenant_id = ? 
            AND hire_date >= CURRENT_DATE - INTERVAL '6 months'
            AND deleted_at IS NULL
            GROUP BY TO_CHAR(hire_date, 'Mon YYYY'), EXTRACT(YEAR FROM hire_date), EXTRACT(MONTH FROM hire_date)
            ORDER BY EXTRACT(YEAR FROM hire_date), EXTRACT(MONTH FROM hire_date)
            """,
            tenantId
        );

        List<String> labels = rows.stream().map(r -> (String) r.get("month")).toList();
        List<Number> data = rows.stream().map(r -> (Number) r.get("count")).toList();

        return DashboardSummaryResponse.ChartData.builder()
            .chartId("hiring-trend")
            .chartType("line")
            .title("Hiring Trend (Last 6 Months)")
            .labels(labels)
            .datasets(List.of(
                DashboardSummaryResponse.ChartData.Dataset.builder()
                    .label("New Hires")
                    .data(data)
                    .build()
            ))
            .build();
    }

    private DashboardSummaryResponse.ChartData buildDepartmentDistributionChart(UUID tenantId) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            """
            SELECT d.name, COUNT(e.id) as count
            FROM hr.departments d
            LEFT JOIN hr.employees e ON d.id = e.department_id AND e.deleted_at IS NULL
            WHERE d.tenant_id = ? AND d.deleted_at IS NULL
            GROUP BY d.id, d.name
            ORDER BY count DESC
            LIMIT 10
            """,
            tenantId
        );

        List<String> labels = rows.stream().map(r -> (String) r.get("name")).toList();
        List<Number> data = rows.stream().map(r -> (Number) r.get("count")).toList();

        return DashboardSummaryResponse.ChartData.builder()
            .chartId("dept-distribution")
            .chartType("doughnut")
            .title("Employees by Department")
            .labels(labels)
            .datasets(List.of(
                DashboardSummaryResponse.ChartData.Dataset.builder()
                    .label("Employees")
                    .data(data)
                    .build()
            ))
            .build();
    }

    private DashboardSummaryResponse.ChartData buildAttendanceTrendChart(UUID tenantId) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            """
            SELECT 
                TO_CHAR(timestamp, 'Mon') as month,
                COUNT(*) FILTER (WHERE punch_type = 'IN') as present
            FROM time.time_punches 
            WHERE tenant_id = ? 
            AND timestamp >= CURRENT_DATE - INTERVAL '6 months'
            GROUP BY TO_CHAR(timestamp, 'Mon'), EXTRACT(MONTH FROM timestamp)
            ORDER BY EXTRACT(MONTH FROM timestamp)
            """,
            tenantId
        );

        List<String> labels = rows.stream().map(r -> (String) r.get("month")).toList();
        List<Number> data = rows.stream().map(r -> (Number) r.get("present")).toList();

        return DashboardSummaryResponse.ChartData.builder()
            .chartId("attendance-trend")
            .chartType("bar")
            .title("Monthly Attendance")
            .labels(labels)
            .datasets(List.of(
                DashboardSummaryResponse.ChartData.Dataset.builder()
                    .label("Clock-ins")
                    .data(data)
                    .build()
            ))
            .build();
    }

    /**
     * Builds recent activity feed.
     */
    private List<DashboardSummaryResponse.ActivityItem> buildRecentActivity(UUID tenantId) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            """
            SELECT action, resource, timestamp, user_id
            FROM audit.audit_logs 
            WHERE tenant_id = ? 
            AND timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
            ORDER BY timestamp DESC
            LIMIT 10
            """,
            tenantId
        );

        return rows.stream().map(row -> 
            DashboardSummaryResponse.ActivityItem.builder()
                .timestamp(((java.sql.Timestamp) row.get("timestamp")).toInstant())
                .type((String) row.get("action"))
                .description(String.format("%s on %s", row.get("action"), row.get("resource")))
                .userName(row.get("user_id") != null ? row.get("user_id").toString() : "System")
                .entityType((String) row.get("resource"))
                .build()
        ).toList();
    }

    /**
     * Builds system alerts.
     */
    private List<DashboardSummaryResponse.Alert> buildAlerts(UUID tenantId) {
        List<DashboardSummaryResponse.Alert> alerts = new ArrayList<>();

        // Check for pending payroll approvals
        Integer pendingPayroll = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM payroll.payroll_runs WHERE tenant_id = ? AND status = 'PENDING_APPROVAL'",
            Integer.class, tenantId
        );

        if (pendingPayroll != null && pendingPayroll > 0) {
            alerts.add(DashboardSummaryResponse.Alert.builder()
                .severity("warning")
                .category("payroll")
                .message(String.format("%d payroll run(s) pending approval", pendingPayroll))
                .createdAt(Instant.now())
                .actionUrl("/dashboard/payroll")
                .build());
        }

        // Check for expired documents
        Integer expiredDocs = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM hr.documents WHERE tenant_id = ? AND retention_until < CURRENT_DATE",
            Integer.class, tenantId
        );

        if (expiredDocs != null && expiredDocs > 0) {
            alerts.add(DashboardSummaryResponse.Alert.builder()
                .severity("info")
                .category("compliance")
                .message(String.format("%d document(s) have expired retention", expiredDocs))
                .createdAt(Instant.now())
                .actionUrl("/dashboard/documents")
                .build());
        }

        return alerts;
    }
}
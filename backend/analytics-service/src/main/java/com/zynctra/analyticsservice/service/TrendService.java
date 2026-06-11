package com.zynctra.analytics.service;

import com.zynctra.analytics.dto.TrendAnalysisRequest;
import com.zynctra.analytics.security.TenantAuthenticationToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrendService {

    private final JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public Map<String, Object> analyzeTrend(TrendAnalysisRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();

        return switch (request.getMetric()) {
            case "attrition" -> analyzeAttritionTrend(tenantId, request);
            case "hiring" -> analyzeHiringTrend(tenantId, request);
            case "attendance" -> analyzeAttendanceTrend(tenantId, request);
            case "payroll" -> analyzePayrollTrend(tenantId, request);
            case "headcount" -> analyzeHeadcountTrend(tenantId, request);
            default -> Map.of("error", "Unknown metric: " + request.getMetric());
        };
    }

    @Transactional(readOnly = true)
    public Map<String, Object> forecast(TrendAnalysisRequest request) {
        Map<String, Object> historical = analyzeTrend(request);
        List<Map<String, Object>> dataPoints = (List<Map<String, Object>>) historical.get("data");

        List<Map<String, Object>> forecast = new ArrayList<>();
        if (dataPoints == null || dataPoints.size() < 3) {
            return Map.of("forecast", forecast, "confidence", 0.0);
        }

        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        int n = dataPoints.size();

        for (int i = 0; i < n; i++) {
            double x = i;
            double y = ((Number) dataPoints.get(i).get("value")).doubleValue();
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }

        double slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        double intercept = (sumY - slope * sumX) / n;

        for (int i = 1; i <= 3; i++) {
            double predicted = slope * (n - 1 + i) + intercept;
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("period", "Forecast " + i);
            point.put("value", BigDecimal.valueOf(predicted).setScale(2, RoundingMode.HALF_UP));
            point.put("isForecast", true);
            forecast.add(point);
        }

        double rSquared = calculateRSquared(dataPoints, slope, intercept);
        return Map.of("forecast", forecast, "confidence", rSquared);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> comparePeriods(TrendAnalysisRequest request) {
        Map<String, Object> current = analyzeTrend(request);

        LocalDate currentStart = request.getStartDate();
        LocalDate currentEnd = request.getEndDate();
        long daysBetween = ChronoUnit.DAYS.between(currentStart, currentEnd);

        LocalDate previousStart = currentStart.minusDays(daysBetween);
        LocalDate previousEnd = currentStart.minusDays(1);

        TrendAnalysisRequest previousRequest = new TrendAnalysisRequest();
        previousRequest.setMetric(request.getMetric());
        previousRequest.setStartDate(previousStart);
        previousRequest.setEndDate(previousEnd);
        previousRequest.setGroupBy(request.getGroupBy());
        previousRequest.setDepartmentId(request.getDepartmentId());

        Map<String, Object> previous = analyzeTrend(previousRequest);

        List<Map<String, Object>> currentData = (List<Map<String, Object>>) current.get("data");
        List<Map<String, Object>> previousData = (List<Map<String, Object>>) previous.get("data");

        double currentSum = currentData.stream()
            .mapToDouble(d -> ((Number) d.get("value")).doubleValue())
            .sum();

        double previousSum = previousData.stream()
            .mapToDouble(d -> ((Number) d.get("value")).doubleValue())
            .sum();

        double change = previousSum == 0 ? 0 : ((currentSum - previousSum) / previousSum) * 100;

        return Map.of(
            "currentPeriod", Map.of("start", currentStart, "end", currentEnd, "total", currentSum),
            "previousPeriod", Map.of("start", previousStart, "end", previousEnd, "total", previousSum),
            "changePercentage", BigDecimal.valueOf(change).setScale(2, RoundingMode.HALF_UP),
            "currentData", currentData,
            "previousData", previousData
        );
    }

    private Map<String, Object> analyzeAttritionTrend(UUID tenantId, TrendAnalysisRequest request) {
        String groupByClause = getGroupByClause(request.getGroupBy(), "termination_date");

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            "SELECT " + groupByClause + " as period, COUNT(*) as value " +
            "FROM hr.employees " +
            "WHERE tenant_id = ? AND termination_date IS NOT NULL " +
            "AND termination_date BETWEEN ? AND ? " +
            (request.getDepartmentId() != null ? "AND department_id = '" + request.getDepartmentId() + "' " : "") +
            "GROUP BY period ORDER BY period",
            tenantId, request.getStartDate(), request.getEndDate()
        );

        return Map.of(
            "metric", "attrition",
            "period", Map.of("start", request.getStartDate(), "end", request.getEndDate()),
            "data", normalizeData(rows, "period", "value"),
            "unit", "employees"
        );
    }

    private Map<String, Object> analyzeHiringTrend(UUID tenantId, TrendAnalysisRequest request) {
        String groupByClause = getGroupByClause(request.getGroupBy(), "hire_date");

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            "SELECT " + groupByClause + " as period, COUNT(*) as value " +
            "FROM hr.employees " +
            "WHERE tenant_id = ? AND hire_date BETWEEN ? AND ? " +
            (request.getDepartmentId() != null ? "AND department_id = '" + request.getDepartmentId() + "' " : "") +
            "GROUP BY period ORDER BY period",
            tenantId, request.getStartDate(), request.getEndDate()
        );

        return Map.of(
            "metric", "hiring",
            "period", Map.of("start", request.getStartDate(), "end", request.getEndDate()),
            "data", normalizeData(rows, "period", "value"),
            "unit", "employees"
        );
    }

    private Map<String, Object> analyzeAttendanceTrend(UUID tenantId, TrendAnalysisRequest request) {
        String groupByClause = getGroupByClause(request.getGroupBy(), "timestamp");

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            "SELECT " + groupByClause + " as period, " +
            "COUNT(*) FILTER (WHERE punch_type = 'IN') as value " +
            "FROM time.time_punches " +
            "WHERE tenant_id = ? AND timestamp BETWEEN ? AND ? " +
            "GROUP BY period ORDER BY period",
            tenantId, request.getStartDate().atStartOfDay(), request.getEndDate().atTime(23, 59, 59)
        );

        return Map.of(
            "metric", "attendance",
            "period", Map.of("start", request.getStartDate(), "end", request.getEndDate()),
            "data", normalizeData(rows, "period", "value"),
            "unit", "clock-ins"
        );
    }

    private Map<String, Object> analyzePayrollTrend(UUID tenantId, TrendAnalysisRequest request) {
        String groupByClause = getGroupByClause(request.getGroupBy(), "period_end");

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
            "SELECT " + groupByClause + " as period, COALESCE(SUM(total_net), 0) as value " +
            "FROM payroll.payroll_runs " +
            "WHERE tenant_id = ? AND period_end BETWEEN ? AND ? AND status = 'PROCESSED' " +
            "GROUP BY period ORDER BY period",
            tenantId, request.getStartDate(), request.getEndDate()
        );

        return Map.of(
            "metric", "payroll",
            "period", Map.of("start", request.getStartDate(), "end", request.getEndDate()),
            "data", normalizeData(rows, "period", "value"),
            "unit", "currency"
        );
    }

    private Map<String, Object> analyzeHeadcountTrend(UUID tenantId, TrendAnalysisRequest request) {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate current = request.getStartDate();

        while (!current.isAfter(request.getEndDate())) {
            LocalDate finalCurrent = current;
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM hr.employees " +
                "WHERE tenant_id = ? AND deleted_at IS NULL " +
                "AND (hire_date IS NULL OR hire_date <= ?) " +
                "AND (termination_date IS NULL OR termination_date > ?)",
                Integer.class, tenantId, finalCurrent, finalCurrent
            );

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("period", finalCurrent.toString());
            point.put("value", count != null ? count : 0);
            data.add(point);

            current = current.plusDays(1);
        }

        return Map.of(
            "metric", "headcount",
            "period", Map.of("start", request.getStartDate(), "end", request.getEndDate()),
            "data", data,
            "unit", "employees"
        );
    }

    private String getGroupByClause(String groupBy, String dateColumn) {
        return switch (groupBy != null ? groupBy : "month") {
            case "day" -> "TO_CHAR(" + dateColumn + ", 'YYYY-MM-DD')";
            case "week" -> "TO_CHAR(DATE_TRUNC('week', " + dateColumn + "), 'YYYY-MM-DD')";
            case "quarter" -> "TO_CHAR(DATE_TRUNC('quarter', " + dateColumn + "), 'YYYY-Q')";
            case "year" -> "TO_CHAR(" + dateColumn + ", 'YYYY')";
            default -> "TO_CHAR(" + dateColumn + ", 'YYYY-MM')";
        };
    }

    private List<Map<String, Object>> normalizeData(List<Map<String, Object>> rows, String periodKey, String valueKey) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("period", row.get(periodKey));
            point.put("value", row.get(valueKey));
            result.add(point);
        }
        return result;
    }

    private double calculateRSquared(List<Map<String, Object>> data, double slope, double intercept) {
        double meanY = data.stream()
            .mapToDouble(d -> ((Number) d.get("value")).doubleValue())
            .average().orElse(0);

        double ssTotal = 0, ssResidual = 0;
        for (int i = 0; i < data.size(); i++) {
            double y = ((Number) data.get(i).get("value")).doubleValue();
            double predicted = slope * i + intercept;
            ssTotal += Math.pow(y - meanY, 2);
            ssResidual += Math.pow(y - predicted, 2);
        }

        return ssTotal == 0 ? 0 : 1 - (ssResidual / ssTotal);
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}
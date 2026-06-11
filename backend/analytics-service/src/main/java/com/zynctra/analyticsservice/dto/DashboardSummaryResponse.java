package com.zynctra.analytics.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Dashboard Summary Response
 * 
 * Comprehensive dashboard data for the main HR dashboard.
 * Contains key metrics, charts, and recent activity.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DashboardSummaryResponse {

    private Instant generatedAt;
    private String period;
    
    // Key Metrics
    private Metrics metrics;
    
    // Chart Data
    private List<ChartData> charts;
    
    // Recent Activity
    private List<ActivityItem> recentActivity;
    
    // Alerts & Notifications
    private List<Alert> alerts;

    @Data
    @Builder
    public static class Metrics {
        private Integer totalEmployees;
        private Integer activeEmployees;
        private Integer newHiresThisMonth;
        private Integer departuresThisMonth;
        private BigDecimal attritionRate;
        private BigDecimal attendanceRate;
        private Integer openPositions;
        private Integer pendingApprovals;
        private BigDecimal monthlyPayrollTotal;
        private Integer leaveRequestsPending;
    }

    @Data
    @Builder
    public static class ChartData {
        private String chartId;
        private String chartType;
        private String title;
        private List<String> labels;
        private List<Dataset> datasets;
        private Map<String, Object> options;

        @Data
        @Builder
        public static class Dataset {
            private String label;
            private List<Number> data;
            private List<String> backgroundColor;
            private List<String> borderColor;
        }
    }

    @Data
    @Builder
    public static class ActivityItem {
        private Instant timestamp;
        private String type;
        private String description;
        private String userName;
        private String entityType;
        private String entityId;
    }

    @Data
    @Builder
    public static class Alert {
        private String severity;
        private String category;
        private String message;
        private Instant createdAt;
        private String actionUrl;
    }
}
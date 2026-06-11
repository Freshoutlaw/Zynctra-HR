package com.zynctra.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Analytics Service Application
 * 
 * Entry point for the Zynctra Analytics Service.
 * Provides dashboards, reports, data exports, trend analysis,
 * and scheduled report generation for the HR platform.
 * 
 * Features:
 * - Role-aware analytics access
 * - Real-time dashboard metrics
 * - Scheduled and on-demand reports
 * - Multi-format exports (CSV, Excel, PDF)
 * - Trend analysis and forecasting
 */
@SpringBootApplication
@EnableScheduling
public class AnalyticsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsServiceApplication.class, args);
    }
}
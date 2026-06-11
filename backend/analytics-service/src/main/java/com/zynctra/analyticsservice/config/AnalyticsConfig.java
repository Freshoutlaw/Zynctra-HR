package com.zynctra.analytics.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Analytics Configuration Properties
 * 
 * Externalized configuration for analytics service behavior.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "analytics")
public class AnalyticsConfig {

    private CacheConfig cache = new CacheConfig();
    private ExportConfig export = new ExportConfig();
    private ScheduledReportConfig scheduledReports = new ScheduledReportConfig();

    @Data
    public static class CacheConfig {
        private int ttlSeconds = 300;
        private int maxSize = 1000;
    }

    @Data
    public static class ExportConfig {
        private int maxRows = 100000;
        private String tempDir = System.getProperty("java.io.tmpdir") + "/zynctra-exports";
        private int cleanupAgeHours = 24;

        public Path getTempDirPath() {
            return Paths.get(tempDir);
        }
    }

    @Data
    public static class ScheduledReportConfig {
        private boolean enabled = true;
        private int threadPoolSize = 5;
        private int maxConcurrent = 3;
    }
}
package com.zynctra.learning.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class AnomalyDetectionEngine {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");

    private final Map<String, UserActivityProfile> profiles = new ConcurrentHashMap<>();

    public void recordActivity(String userId, String tenantId, String activityType) {
        String key = tenantId + ":" + userId;
        profiles.computeIfAbsent(key, k -> new UserActivityProfile())
            .record(activityType);
    }

    @Scheduled(fixedRate = 300_000) // Every 5 minutes
    public void scanForAnomalies() {
        Instant fiveMinutesAgo = Instant.now().minus(5, ChronoUnit.MINUTES);
        
        for (Map.Entry<String, UserActivityProfile> entry : profiles.entrySet()) {
            UserActivityProfile profile = entry.getValue();
            
            // AI query flood
            int aiQueries = profile.getRecentCount("AI_QUERY", fiveMinutesAgo);
            if (aiQueries > 50) {
                SEC_LOG.warn("ANOMALY: ai_query_flood user={} count={}", entry.getKey(), aiQueries);
            }
            
            // Download flood
            int downloads = profile.getRecentCount("DOWNLOAD", fiveMinutesAgo);
            if (downloads > 20) {
                SEC_LOG.warn("ANOMALY: download_flood user={} count={}", entry.getKey(), downloads);
            }
            
            // Failed certification attempts
            int failedCerts = profile.getRecentCount("CERT_FAIL", fiveMinutesAgo);
            if (failedCerts > 5) {
                SEC_LOG.warn("ANOMALY: cert_brute_force user={} count={}", entry.getKey(), failedCerts);
            }
        }
    }

    private static class UserActivityProfile {
        private final Map<String, java.util.Queue<<Instant>> activities = new ConcurrentHashMap<>();

        void record(String activityType) {
            activities.computeIfAbsent(activityType, k -> new java.util.LinkedList<>())
                .offer(Instant.now());
        }

        int getRecentCount(String activityType, Instant since) {
            java.util.Queue<<Instant> queue = activities.get(activityType);
            if (queue == null) return 0;
            while (!queue.isEmpty() && queue.peek().isBefore(since)) {
                queue.poll();
            }
            return queue.size();
        }
    }
}
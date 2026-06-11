package com.zynctra.ats.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AtsDashboardResponse {

    private Instant generatedAt;

    private JobMetrics jobs;
    private CandidateMetrics candidates;
    private ApplicationMetrics applications;
    private InterviewMetrics interviews;
    private OfferMetrics offers;

    @Data
    @Builder
    public static class JobMetrics {
        private Integer totalOpen;
        private Integer totalClosed;
        private Integer totalFilled;
        private Map<String, Integer> byDepartment;
        private Map<String, Integer> byStatus;
    }

    @Data
    @Builder
    public static class CandidateMetrics {
        private Integer totalCandidates;
        private Integer newThisMonth;
        private Map<String, Integer> bySource;
        private Map<String, Integer> byStatus;
    }

    @Data
    @Builder
    public static class ApplicationMetrics {
        private Integer totalApplications;
        private Integer activeApplications;
        private Map<String, Integer> byStage;
        private BigDecimal averageTimeInStage;
    }

    @Data
    @Builder
    public static class InterviewMetrics {
        private Integer scheduledThisWeek;
        private Integer completedThisWeek;
        private Integer noShows;
        private BigDecimal averageRating;
    }

    @Data
    @Builder
    public static class OfferMetrics {
        private Integer pendingOffers;
        private Integer acceptedOffers;
        private Integer declinedOffers;
        private BigDecimal averageAcceptedSalary;
        private BigDecimal acceptanceRate;
    }
}
package com.zynctra.learning.config;

import com.zynctra.learning.security.SelfDefendingThreatDetector;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
public class SelfDefenseConfig {

    private final SelfDefendingThreatDetector threatDetector;

    public SelfDefenseConfig(SelfDefendingThreatDetector threatDetector) {
        this.threatDetector = threatDetector;
    }

    @Scheduled(cron = "${threat.evolution.cron:0 0 3 * * *}")
    public void scheduledDefenseEvolution() {
        threatDetector.evolveDefenses();
    }
}
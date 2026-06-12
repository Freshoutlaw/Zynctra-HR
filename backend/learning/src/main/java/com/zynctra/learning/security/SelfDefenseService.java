package com.zynctra.learning.service;

import com.zynctra.learning.security.SelfDefendingThreatDetector;
import org.springframework.stereotype.Service;

@Service
public class SelfDefenseService {

    private final SelfDefendingThreatDetector threatDetector;

    public SelfDefenseService(SelfDefendingThreatDetector threatDetector) {
        this.threatDetector = threatDetector;
    }

    public void triggerManualEvolution() {
        threatDetector.evolveDefenses();
    }

    public SelfDefendingThreatDetector.ThreatAssessment manualAnalyze(String content, 
                                                                       String userId, 
                                                                       String tenantId) {
        return threatDetector.analyze(content, userId, tenantId,
            new SelfDefendingThreatDetector.ThreatContext("/manual", "POST", "manual"));
    }
}
package com.zynctra.learning.service;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.learning.entity.AiMessage;
import com.zynctra.learning.entity.AiTutoringSession;
import com.zynctra.learning.repository.AiTutoringSessionRepository;
import com.zynctra.learning.security.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Secure AI tutoring service with self-defending threat detection.
 */
@Service
@Transactional(readOnly = true)
public class AiTutoringService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Logger AI_LOG = LoggerFactory.getLogger("AI_INTERACTION");

    private final SelfDefendingThreatDetector threatDetector;
    private final SecureSystemInstruction systemInstruction;
    private final AiRequestSigner requestSigner;
    private final AiResponseValidator responseValidator;
    private final LearningAuditService auditService;
    private final LearningRateLimiter rateLimiter;
    private final AiTutoringSessionRepository sessionRepository;

    // AI client (Groq-compatible)
    private final org.springframework.web.client.RestTemplate aiClient;

    public AiTutoringService(SelfDefendingThreatDetector threatDetector,
                             SecureSystemInstruction systemInstruction,
                             AiRequestSigner requestSigner,
                             AiResponseValidator responseValidator,
                             LearningAuditService auditService,
                             LearningRateLimiter rateLimiter,
                             AiTutoringSessionRepository sessionRepository,
                             org.springframework.web.client.RestTemplate aiClient) {
        this.threatDetector = threatDetector;
        this.systemInstruction = systemInstruction;
        this.requestSigner = requestSigner;
        this.responseValidator = responseValidator;
        this.auditService = auditService;
        this.rateLimiter = rateLimiter;
        this.sessionRepository = sessionRepository;
        this.aiClient = aiClient;
    }

    @Transactional
    public AiTutoringResponse processQuery(String userId, String sessionId, String userQuery) {
        String tenantId = TenantContext.getCurrentTenant();
        String correlationId = UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();

        // 1. RATE LIMITING
        if (!rateLimiter.allowRequest(userId, tenantId)) {
            SEC_LOG.warn("SECURITY_EVENT: ai_rate_limit_exceeded user={} tenant={}", userId, tenantId);
            auditService.logAiInteraction(correlationId, userId, tenantId, sessionId,
                "RATE_LIMITED", null, null, 0);
            throw new SecurityException("Rate limit exceeded. Please slow down.");
        }

        // 2. INPUT SIZE ENFORCEMENT
        if (userQuery == null || userQuery.trim().isEmpty()) {
            throw new IllegalArgumentException("Query cannot be empty");
        }
        if (userQuery.length() > 4000) {
            SEC_LOG.warn("SECURITY_EVENT: ai_oversized_input user={} size={}", userId, userQuery.length());
            throw new SecurityException("Query exceeds maximum length of 4000 characters");
        }

        // 3. THREAT DETECTION (Self-defending)
        SelfDefendingThreatDetector.ThreatContext context = 
            new SelfDefendingThreatDetector.ThreatContext(
                "/api/learning/tutor", "POST", "unknown");

        SelfDefendingThreatDetector.ThreatAssessment assessment = 
            threatDetector.analyze(userQuery, userId, tenantId, context);

        if (assessment.getDecision() == SelfDefendingThreatDetector.ThreatDecision.BLOCK) {
            SEC_LOG.warn("SECURITY_EVENT: ai_threat_blocked user={} reason={} score={}",
                userId, assessment.getReason(), assessment.getHeuristicScore());
            
            // Quarantine: store but don't process
            quarantineMessage(sessionId, userId, tenantId, userQuery, assessment);
            
            return AiTutoringResponse.blocked(
                "Your message was blocked by security controls. This incident has been logged for review.",
                correlationId);
        }

        if (assessment.getDecision() == SelfDefendingThreatDetector.ThreatDecision.QUARANTINE) {
            // Require manual review before responding
            SEC_LOG.warn("SECURITY_EVENT: ai_quarantine user={} reason={}",
                userId, assessment.getBehavioralAnomaly());
            return AiTutoringResponse.quarantined(
                "Your message requires manual review before processing.",
                correlationId);
        }

        // 4. SESSION VALIDATION
        AiTutoringSession session = getOrCreateSession(sessionId, userId, tenantId);

        // 5. SECURE SYSTEM INSTRUCTION (Immutable, first in context)
        String systemPrompt = systemInstruction.getInstruction(tenantId, userId);

        // 6. CONTEXT WINDOW MANAGEMENT
        List<AiMessage> history = getRecentHistory(session.getId(), 10); // Last 10 messages

        // 7. BUILD SECURE PAYLOAD
        AiPayload payload = buildSecurePayload(systemPrompt, history, userQuery, correlationId);

        // 8. SIGN REQUEST
        String signature = requestSigner.sign(payload);
        payload.setSignature(signature);

        // 9. CALL AI SERVICE
        AI_LOG.info("AI_REQUEST: correlation={} user={} tenant={} history_len={} query_len={}",
            correlationId, userId, tenantId, history.size(), userQuery.length());

        String aiResponse;
        try {
            aiResponse = callAiService(payload);
        } catch (Exception e) {
            SEC_LOG.error("SECURITY_EVENT: ai_service_error correlation={} error={}",
                correlationId, e.getMessage());
            auditService.logAiInteraction(correlationId, userId, tenantId, sessionId,
                "AI_SERVICE_ERROR", userQuery, null, 0);
            return AiTutoringResponse.error("AI service temporarily unavailable.", correlationId);
        }

        // 10. RESPONSE VALIDATION
        if (!responseValidator.isSafe(aiResponse)) {
            SEC_LOG.error("SECURITY_EVENT: ai_unsafe_response correlation={}", correlationId);
            auditService.logAiInteraction(correlationId, userId, tenantId, sessionId,
                "UNSAFE_RESPONSE_BLOCKED", userQuery, null, 0);
            return AiTutoringResponse.error("Response contained potentially unsafe content.", correlationId);
        }

        // 11. PII LEAKAGE CHECK
        if (responseValidator.containsPiiLeak(aiResponse)) {
            SEC_LOG.error("SECURITY_EVENT: ai_pii_leak correlation={}", correlationId);
            auditService.logAiInteraction(correlationId, userId, tenantId, sessionId,
                "PII_LEAK_BLOCKED", userQuery, null, 0);
            return AiTutoringResponse.error("Response contained sensitive information.", correlationId);
        }

        // 12. STORE INTERACTION
        storeInteraction(session.getId(), userQuery, aiResponse, correlationId, assessment.getHeuristicScore());

        // 13. AUDIT
        long duration = System.currentTimeMillis() - startTime;
        auditService.logAiInteraction(correlationId, userId, tenantId, sessionId,
            "SUCCESS", userQuery, aiResponse, duration);

        AI_LOG.info("AI_RESPONSE: correlation={} duration_ms={} response_len={}",
            correlationId, duration, aiResponse.length());

        return AiTutoringResponse.success(aiResponse, correlationId, session.getId());
    }

    // ========== PRIVATE HELPERS ==========

    private void quarantineMessage(String sessionId, String userId, String tenantId,
                                    String query, SelfDefendingThreatDetector.ThreatAssessment assessment) {
        AiMessage quarantined = new AiMessage();
        quarantined.setId(UUID.randomUUID().toString());
        quarantined.setSessionId(sessionId);
        quarantined.setTenantId(tenantId);
        quarantined.setUserId(userId);
        quarantined.setRole("QUARANTINED");
        quarantined.setContent(query);
        quarantined.setThreatScore(assessment.getHeuristicScore());
        quarantined.setThreatReason(assessment.getReason());
        quarantined.setTimestamp(Instant.now());
        // Store in quarantine table for review
    }

    private AiTutoringSession getOrCreateSession(String sessionId, String userId, String tenantId) {
        if (sessionId != null) {
            return sessionRepository.findByIdAndTenant(sessionId, tenantId)
                .filter(s -> s.getUserId().equals(userId))
                .orElseThrow(() -> new SecurityException("Session not found or access denied"));
        }
        // Create new session
        AiTutoringSession session = new AiTutoringSession();
        session.setId(UUID.randomUUID().toString());
        session.setTenantId(tenantId);
        session.setUserId(userId);
        session.setStartedAt(Instant.now());
        session.setActive(true);
        return sessionRepository.save(session);
    }

    private List<AiMessage> getRecentHistory(String sessionId, int limit) {
        // Fetch from repository, ordered by timestamp
        return new ArrayList<>(); // Simplified
    }

    private AiPayload buildSecurePayload(String systemPrompt, List<AiMessage> history,
                                          String userQuery, String correlationId) {
        AiPayload payload = new AiPayload();
        payload.setModel(System.getenv().getOrDefault("GROQ_MODEL", "mixtral-8x7b-32768"));
        payload.setMaxTokens(2048);
        payload.setTemperature(0.3); // Lower = more deterministic, harder to jailbreak

        List<AiPayload.Message> messages = new ArrayList<>();

        // MANDATORY: System instruction FIRST and IMMUTABLE
        messages.add(new AiPayload.Message("system", systemPrompt));

        // Conversation history (sanitized)
        for (AiMessage msg : history) {
            messages.add(new AiPayload.Message(
                msg.getRole().equals("USER") ? "user" : "assistant",
                sanitizeForContext(msg.getContent())
            ));
        }

        // Current user query (wrapped to prevent instruction override)
        String wrappedQuery = "[USER_QUERY_START]\n" + userQuery + "\n[USER_QUERY_END]";
        messages.add(new AiPayload.Message("user", wrappedQuery));

        payload.setMessages(messages);
        payload.setCorrelationId(correlationId);
        payload.setTenantId(TenantContext.getCurrentTenant());

        return payload;
    }

    private String callAiService(AiPayload payload) {
        // Implement actual Groq API call with retry, timeout, circuit breaker
        return "Sample AI response"; // Placeholder
    }

    private String sanitizeForContext(String content) {
        if (content == null) return "";
        // Remove potential instruction override patterns from history
        return content.replaceAll("(?i)system\\s*:", "[REDACTED_SYSTEM_REF]");
    }

    private void storeInteraction(String sessionId, String userQuery, String aiResponse,
                                   String correlationId, double threatScore) {
        // Store in database
    }

    // Inner DTO for AI payload
    public static class AiPayload {
        private String model;
        private List<Message> messages;
        private int maxTokens;
        private double temperature;
        private String correlationId;
        private String tenantId;
        private String signature;

        public static class Message {
            private String role;
            private String content;

            public Message(String role, String content) {
                this.role = role;
                this.content = content;
            }

            public String getRole() { return role; }
            public void setRole(String role) { this.role = role; }
            public String getContent() { return content; }
            public void setContent(String content) { this.content = content; }
        }

        // Getters/setters
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public List<Message> getMessages() { return messages; }
        public void setMessages(List<Message> messages) { this.messages = messages; }
        public int getMaxTokens() { return maxTokens; }
        public void setMaxTokens(int maxTokens) { this.maxTokens = maxTokens; }
        public double getTemperature() { return temperature; }
        public void setTemperature(double temperature) { this.temperature = temperature; }
        public String getCorrelationId() { return correlationId; }
        public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }
        public String getTenantId() { return tenantId; }
        public void setTenantId(String tenantId) { this.tenantId = tenantId; }
        public String getSignature() { return signature; }
        public void setSignature(String signature) { this.signature = signature; }
    }
}
package com.zynctra.learning.security;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.learning.entity.ThreatIncident;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class LearningAuditService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Logger AI_LOG = LoggerFactory.getLogger("AI_INTERACTION");

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAiInteraction(String correlationId, String userId, String tenantId,
                                  String sessionId, String status, String userQuery,
                                  String aiResponse, long durationMs) {
        AI_LOG.info("AI_AUDIT: correlation={} status={} user={} tenant={} session={} duration_ms={} query_len={} response_len={}",
            correlationId, status, userId, tenantId, sessionId, durationMs,
            userQuery != null ? userQuery.length() : 0,
            aiResponse != null ? aiResponse.length() : 0);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logThreatIncident(String userId, String decision, String reason,
                                   double score, String normalized, String endpoint) {
        SEC_LOG.warn("THREAT_AUDIT: user={} decision={} reason={} score={} endpoint={}",
            userId, decision, reason, score, endpoint);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logContentUpload(String userId, String contentId, String fileName,
                                  long fileSize, String mimeType, boolean passedScan) {
        SEC_LOG.info("CONTENT_AUDIT: user={} content={} file={} size={} mime={} scan={}",
            userId, contentId, fileName, fileSize, mimeType, passedScan);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logCertification(String userId, String certificationId, String courseId,
                                  String action, boolean success) {
        SEC_LOG.info("CERT_AUDIT: user={} cert={} course={} action={} success={}",
            userId, certificationId, courseId, action, success);
    }
}
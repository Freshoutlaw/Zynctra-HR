package com.zynctra.benefits.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.zynctra.benefits.model.AuditAction;
import com.zynctra.benefits.model.AuditLogEntry;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuditLogService {

    private static final String AUDIT_LOGGER_NAME = "ZYNCTRA_BENEFITS_AUDIT";
    private final org.slf4j.Logger auditLogger = org.slf4j.LoggerFactory.getLogger(AUDIT_LOGGER_NAME);

    public void record(AuditAction action, UUID tenantId, UUID actorUserId,
                       String actorRole, String actorIp, UUID targetResourceId,
                       String targetResourceType, AuditLogEntry.ActionOutcome outcome,
                       String details) {
        AuditLogEntry entry = AuditLogEntry.builder()
            .entryId(UUID.randomUUID()).timestamp(Instant.now())
            .action(action).tenantId(tenantId).actorUserId(actorUserId)
            .actorRole(actorRole).actorIpAddress(maskIp(actorIp))
            .targetResourceId(targetResourceId).targetResourceType(targetResourceType)
            .outcome(outcome).details(truncate(details, 500))
            .correlationId(UUID.randomUUID()).build();
        auditLogger.info(entry.toStructuredLog());
    }

    public void recordSecurityIncident(AuditAction action, UUID tenantId,
                                        UUID actorUserId, String actorRole,
                                        String actorIp, String details) {
        AuditLogEntry entry = AuditLogEntry.builder()
            .entryId(UUID.randomUUID()).timestamp(Instant.now())
            .action(action).tenantId(tenantId).actorUserId(actorUserId)
            .actorRole(actorRole).actorIpAddress(maskIp(actorIp))
            .targetResourceId(null).targetResourceType("SECURITY")
            .outcome(AuditLogEntry.ActionOutcome.DENIED)
            .details(truncate(details, 500)).correlationId(UUID.randomUUID()).build();
        auditLogger.error("SECURITY_INCIDENT | {}", entry.toStructuredLog());
    }

    private String maskIp(String ip) {
        if (ip == null) return "unknown";
        if (ip.contains(".")) {
            int lastDot = ip.lastIndexOf('.');
            return lastDot > 0 ? ip.substring(0, lastDot) + ".xxx" : "xxx.xxx.xxx.xxx";
        }
        return "[IPv6_MASKED]";
    }

    private String truncate(String s, int maxLen) {
        return s == null ? null : (s.length() > maxLen ? s.substring(0, maxLen) + "..." : s);
    }
}
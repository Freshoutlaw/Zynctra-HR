package com.zynctra.connector.controller;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.common.validation.SecureInputValidator;
import com.zynctra.connector.dto.WebhookPayload;
import com.zynctra.connector.service.ConnectorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/connectors")
@Validated
public class ConnectorController {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private final ConnectorService connectorService;
    
    public ConnectorController(ConnectorService connectorService) {
        this.connectorService = connectorService;
    }

    // Health check - no auth required
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "connector-service"));
    }

    // Webhook endpoints - authenticated via WebhookAuthenticationFilter
    @PostMapping("/webhooks/{provider}")
    public ResponseEntity<Void> receiveWebhook(
            @PathVariable @Pattern(regexp = "^[a-z]{3,20}$") String provider,
            @RequestBody @Valid WebhookPayload payload) {
        
        String tenantId = TenantContext.getCurrentTenant();
        SEC_LOG.info("SECURITY_EVENT: webhook_received provider={} tenant={}", provider, tenantId);
        
        connectorService.processWebhook(provider, payload, tenantId);
        return ResponseEntity.ok().build();
    }

    // OAuth callback - validated state parameter
    @GetMapping("/callbacks/{provider}")
    public ResponseEntity<String> handleOAuthCallback(
            @PathVariable @Pattern(regexp = "^[a-z]{3,20}$") String provider,
            @RequestParam @NotBlank @Size(max = 256) String code,
            @RequestParam @NotBlank @Size(max = 256) String state) {
        
        // Validate state parameter to prevent CSRF
        if (!connectorService.validateOAuthState(state)) {
            SEC_LOG.warn("SECURITY_EVENT: oauth_invalid_state provider={} ip={}", 
                provider, getClientIp());
            return ResponseEntity.status(403).body("Invalid state parameter");
        }
        
        connectorService.exchangeOAuthCode(provider, code);
        return ResponseEntity.ok("Authorization successful");
    }

    // Admin endpoints - restricted to SUPER_ADMIN
    @PostMapping("/admin/configure")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> configureConnector(
            @RequestBody @Valid ConnectorConfigRequest request) {
        
        SecureInputValidator.sanitizeAlphanumeric(request.getConnectorType());
        SecureInputValidator.validateCollectionSize(request.getAllowedDomains());
        
        connectorService.configureConnector(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/audit")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ConnectorAuditLog> getAuditLog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        // Validate pagination to prevent DoS
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("Invalid pagination parameters");
        }
        
        return ResponseEntity.ok(connectorService.getAuditLog(page, size));
    }
    
    private String getClientIp() {
        // Implementation from request context
        return "unknown";
    }
}
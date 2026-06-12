package com.zynctra.connector.service;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.zynctra.common.tenant.TenantContext;
import com.zynctra.connector.client.SecureRestTemplateFactory;
import com.zynctra.connector.dto.WebhookPayload;
import com.zynctra.connector.security.OutboundRequestValidator;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@Service
public class ConnectorService {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Logger CON_LOG = LoggerFactory.getLogger("CONNECTOR_AUDIT");
    
    private final SecureRestTemplateFactory restTemplateFactory;
    private final OutboundRequestValidator urlValidator;
    private final ConnectorRepository repository;
    
    public ConnectorService(SecureRestTemplateFactory restTemplateFactory,
                            OutboundRequestValidator urlValidator,
                            ConnectorRepository repository) {
        this.restTemplateFactory = restTemplateFactory;
        this.urlValidator = urlValidator;
        this.repository = repository;
    }

    @CircuitBreaker(name = "webhookProcessing", fallbackMethod = "webhookFallback")
    @Retry(name = "webhookRetry")
    public void processWebhook(String provider, WebhookPayload payload, String tenantId) {
        // Verify tenant isolation
        if (!tenantId.equals(TenantContext.getCurrentTenant())) {
            SEC_LOG.error("SECURITY_EVENT: tenant_mismatch webhook_provider={} expected={} actual={}", 
                provider, tenantId, TenantContext.getCurrentTenant());
            throw new SecurityException("Tenant mismatch in webhook processing");
        }
        
        // Validate event timestamp (prevent replay)
        long eventAge = System.currentTimeMillis() - payload.getTimestamp();
        if (eventAge > 300_000 || eventAge < -30_000) { // 5 min future/past tolerance
            SEC_LOG.warn("SECURITY_EVENT: webhook_stale_event provider={} age_ms={}", provider, eventAge);
            throw new SecurityException("Event timestamp outside acceptable window");
        }
        
        // Process based on provider
        switch (provider) {
            case "slack" -> processSlackWebhook(payload, tenantId);
            case "workday" -> processWorkdayWebhook(payload, tenantId);
            case "salesforce" -> processSalesforceWebhook(payload, tenantId);
            default -> {
                SEC_LOG.error("SECURITY_EVENT: unknown_webhook_provider provider={}", provider);
                throw new IllegalArgumentException("Unknown provider: " + provider);
            }
        }
        
        CON_LOG.info("CONNECTOR_EVENT: webhook_processed provider={} tenant={} event={}", 
            provider, tenantId, payload.getEventType());
    }
    
    public void webhookFallback(String provider, WebhookPayload payload, String tenantId, Exception ex) {
        SEC_LOG.error("SECURITY_EVENT: webhook_circuit_open provider={} error={}", provider, ex.getMessage());
        // Queue for later processing or alert admin
    }

    @CircuitBreaker(name = "outboundApi")
    public String callExternalApi(String connectorType, String url, Object requestBody) {
        // Validate URL before any connection attempt
        urlValidator.validateOutboundUrl(connectorType, url);
        
        RestTemplate template = restTemplateFactory.createSecureTemplate(connectorType);
        
        // Additional: validate request body size
        String bodyJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(requestBody);
        if (bodyJson.length() > 1_000_000) { // 1MB limit
            throw new SecurityException("Request body exceeds maximum size");
        }
        
        return template.postForObject(url, requestBody, String.class);
    }
    
    public boolean validateOAuthState(String state) {
        // Validate state against secure cache (Redis/DB) with expiration
        return repository.findAndDeleteOAuthState(state)
            .filter(s -> s.getExpiresAt().isAfter(java.time.Instant.now()))
            .isPresent();
    }
    
    public void configureConnector(ConnectorConfigRequest request) {
        // Validate all domains in configuration
        for (String domain : request.getAllowedDomains()) {
            urlValidator.validateOutboundUrl(request.getConnectorType(), "https://" + domain);
        }
        repository.saveConfiguration(request);
    }
    
    // Provider-specific processors
    private void processSlackWebhook(WebhookPayload payload, String tenantId) { /* ... */ }
    private void processWorkdayWebhook(WebhookPayload payload, String tenantId) { /* ... */ }
    private void processSalesforceWebhook(WebhookPayload payload, String tenantId) { /* ... */ }
}
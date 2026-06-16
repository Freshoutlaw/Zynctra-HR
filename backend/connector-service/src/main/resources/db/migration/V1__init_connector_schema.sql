-- Connector Service Schema

CREATE SCHEMA IF NOT EXISTS connectors;

-- OAuth Providers
CREATE TABLE connectors.oauth_providers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    client_id VARCHAR(255),
    client_secret VARCHAR(255),
    redirect_uri VARCHAR(500),
    scope TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    UNIQUE(tenant_id, provider_name)
);

CREATE INDEX idx_providers_tenant ON connectors.oauth_providers(tenant_id);
CREATE INDEX idx_providers_active ON connectors.oauth_providers(is_active);

-- OAuth Tokens
CREATE TABLE connectors.oauth_tokens (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    user_id UUID NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    scope TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (provider_id) REFERENCES connectors.oauth_providers(id)
);

CREATE INDEX idx_tokens_tenant ON connectors.oauth_tokens(tenant_id);
CREATE INDEX idx_tokens_provider ON connectors.oauth_tokens(provider_id);
CREATE INDEX idx_tokens_user ON connectors.oauth_tokens(user_id);
CREATE INDEX idx_tokens_expires ON connectors.oauth_tokens(expires_at);

-- Webhooks
CREATE TABLE connectors.webhooks (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    webhook_url VARCHAR(500) NOT NULL,
    webhook_secret VARCHAR(255),
    event_types TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (provider_id) REFERENCES connectors.oauth_providers(id)
);

CREATE INDEX idx_webhooks_tenant ON connectors.webhooks(tenant_id);
CREATE INDEX idx_webhooks_provider ON connectors.webhooks(provider_id);
CREATE INDEX idx_webhooks_active ON connectors.webhooks(is_active);

-- Webhook Events
CREATE TABLE connectors.webhook_events (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    webhook_id UUID NOT NULL,
    event_type VARCHAR(100),
    payload JSONB,
    status VARCHAR(50) NOT NULL,
    retry_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (webhook_id) REFERENCES connectors.webhooks(id)
);

CREATE INDEX idx_events_tenant ON connectors.webhook_events(tenant_id);
CREATE INDEX idx_events_webhook ON connectors.webhook_events(webhook_id);
CREATE INDEX idx_events_status ON connectors.webhook_events(status);
CREATE INDEX idx_events_type ON connectors.webhook_events(event_type);

-- Integration Mappings
CREATE TABLE connectors.integration_mappings (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    source_entity_id UUID,
    target_entity_id UUID,
    source_entity_type VARCHAR(100),
    target_entity_type VARCHAR(100),
    mapping_type VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (provider_id) REFERENCES connectors.oauth_providers(id)
);

CREATE INDEX idx_mappings_tenant ON connectors.integration_mappings(tenant_id);
CREATE INDEX idx_mappings_provider ON connectors.integration_mappings(provider_id);
CREATE INDEX idx_mappings_source ON connectors.integration_mappings(source_entity_type, source_entity_id);
CREATE INDEX idx_mappings_target ON connectors.integration_mappings(target_entity_type, target_entity_id);

-- Audit
CREATE TABLE connectors.audit_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    action VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

CREATE INDEX idx_audit_tenant ON connectors.audit_logs(tenant_id);
CREATE INDEX idx_audit_entity ON connectors.audit_logs(entity_type, entity_id);

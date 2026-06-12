-- Run as migration user (zynctra_migrator) only
-- Application runtime uses zynctra_connector (no DDL privileges)

CREATE SCHEMA IF NOT EXISTS connector_schema;

-- ============================================
-- connector_configs
-- ============================================
CREATE TABLE connector_schema.connector_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    connector_type VARCHAR(32) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    encrypted_config TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    allowed_domains TEXT NOT NULL,
    webhook_secret_ref VARCHAR(256),
    oauth_token_ref VARCHAR(256),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT chk_connector_type CHECK (connector_type IN (
        'SLACK', 'WORKDAY', 'SALESFORCE', 'OKTA', 
        'QUICKBOOKS', 'CUSTOM_WEBHOOK', 'MICROSOFT_TEAMS', 'GOOGLE_WORKSPACE'
    )),
    CONSTRAINT chk_tenant_format CHECK (tenant_id ~ '^[a-z0-9][-a-z0-9]{2,62}$')
);

CREATE INDEX idx_connector_configs_tenant ON connector_schema.connector_configs(tenant_id) 
    WHERE deleted = FALSE;
CREATE INDEX idx_connector_configs_tenant_type ON connector_schema.connector_configs(tenant_id, connector_type) 
    WHERE active = TRUE AND deleted = FALSE;

-- ============================================
-- webhook_events (APPEND-ONLY)
-- ============================================
CREATE TABLE connector_schema.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    connector_type VARCHAR(32) NOT NULL,
    event_id VARCHAR(128) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    payload_preview TEXT,
    signature_valid BOOLEAN NOT NULL,
    processing_status VARCHAR(32) NOT NULL,
    processing_result VARCHAR(512),
    source_ip VARCHAR(45) NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    created_by VARCHAR(128) NOT NULL DEFAULT 'SYSTEM_WEBHOOK',
    
    CONSTRAINT chk_webhook_status CHECK (processing_status IN (
        'RECEIVED', 'VALIDATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'QUARANTINED'
    ))
);

CREATE INDEX idx_webhook_events_tenant_time ON connector_schema.webhook_events(tenant_id, received_at DESC);
CREATE UNIQUE INDEX idx_webhook_events_dedup ON connector_schema.webhook_events(tenant_id, event_id);
CREATE INDEX idx_webhook_events_status ON connector_schema.webhook_events(tenant_id, processing_status) 
    WHERE processing_status IN ('FAILED', 'QUARANTINED');

-- ============================================
-- outbound_api_calls (APPEND-ONLY)
-- ============================================
CREATE TABLE connector_schema.outbound_api_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    connector_type VARCHAR(32) NOT NULL,
    request_url VARCHAR(2048) NOT NULL,
    request_method VARCHAR(10) NOT NULL,
    request_body_hash VARCHAR(64),
    response_status_code INTEGER,
    response_body_hash VARCHAR(64),
    response_error_message VARCHAR(512),
    request_signature VARCHAR(256),
    call_status VARCHAR(32) NOT NULL,
    duration_ms BIGINT,
    called_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL DEFAULT 'SYSTEM_CONNECTOR',
    
    CONSTRAINT chk_call_status CHECK (call_status IN (
        'PENDING', 'SUCCESS', 'FAILED', 'TIMEOUT', 'CIRCUIT_OPEN', 'RATE_LIMITED'
    ))
);

CREATE INDEX idx_outbound_calls_tenant_time ON connector_schema.outbound_api_calls(tenant_id, called_at DESC);
CREATE INDEX idx_outbound_calls_status ON connector_schema.outbound_api_calls(tenant_id, call_status) 
    WHERE call_status IN ('FAILED', 'TIMEOUT', 'PENDING');

-- ============================================
-- oauth_state_tokens (HIGH-CHURN)
-- ============================================
CREATE TABLE connector_schema.oauth_state_tokens (
    state_token VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    connector_type VARCHAR(32) NOT NULL,
    redirect_uri VARCHAR(2048) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    created_by VARCHAR(128) NOT NULL,
    
    CONSTRAINT chk_oauth_state_used CHECK (used = FALSE OR used_at IS NOT NULL)
);

CREATE INDEX idx_oauth_state_expiry ON connector_schema.oauth_state_tokens(expires_at) 
    WHERE used = FALSE;
CREATE INDEX idx_oauth_state_cleanup ON connector_schema.oauth_state_tokens(used, used_at) 
    WHERE used = TRUE;

-- ============================================
-- connector_audit_logs (APPEND-ONLY, 7-YEAR RETENTION)
-- ============================================
CREATE TABLE connector_schema.connector_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    connector_type VARCHAR(32),
    actor VARCHAR(128) NOT NULL,
    actor_ip VARCHAR(45),
    action_description VARCHAR(512) NOT NULL,
    resource_hash VARCHAR(64),
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(512),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    correlation_id VARCHAR(64),
    
    CONSTRAINT chk_audit_event_type CHECK (event_type IN (
        'CONNECTOR_CREATED', 'CONNECTOR_UPDATED', 'CONNECTOR_DELETED',
        'CONNECTOR_ACTIVATED', 'CONNECTOR_DEACTIVATED',
        'WEBHOOK_RECEIVED', 'WEBHOOK_VALIDATION_FAILED', 'WEBHOOK_SIGNATURE_INVALID',
        'WEBHOOK_RATE_LIMITED', 'OAUTH_AUTHORIZATION_STARTED', 'OAUTH_AUTHORIZATION_COMPLETED',
        'OAUTH_AUTHORIZATION_FAILED', 'OAUTH_STATE_REUSED', 'OUTBOUND_API_CALLED',
        'OUTBOUND_API_FAILED', 'OUTBOUND_API_TIMEOUT', 'CONFIGURATION_CHANGED',
        'SECRET_ROTATED', 'ANOMALY_DETECTED'
    ))
);

CREATE INDEX idx_audit_logs_tenant_time ON connector_schema.connector_audit_logs(tenant_id, timestamp DESC);
CREATE INDEX idx_audit_logs_event ON connector_schema.connector_audit_logs(tenant_id, event_type, timestamp DESC);
CREATE INDEX idx_audit_logs_correlation ON connector_schema.connector_audit_logs(correlation_id);

-- Row Level Security for tenant isolation
ALTER TABLE connector_schema.connector_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_schema.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_schema.outbound_api_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_schema.oauth_state_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_schema.connector_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_connector_configs ON connector_schema.connector_configs
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_webhook_events ON connector_schema.webhook_events
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_outbound_calls ON connector_schema.outbound_api_calls
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_oauth_state ON connector_schema.oauth_state_tokens
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_audit_logs ON connector_schema.connector_audit_logs
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);

-- ============================================
-- LEAST PRIVILEGE GRANTS
-- ============================================
GRANT USAGE ON SCHEMA connector_schema TO zynctra_connector;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA connector_schema TO zynctra_connector;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA connector_schema TO zynctra_connector;

-- Explicitly REVOKE dangerous operations
REVOKE DELETE ON ALL TABLES IN SCHEMA connector_schema FROM zynctra_connector;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA connector_schema FROM zynctra_connector;
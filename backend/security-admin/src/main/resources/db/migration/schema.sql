CREATE TABLE mfa_secrets (
    id UUID PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    tenant_id VARCHAR(64) NOT NULL,
    encrypted_secret TEXT NOT NULL,        -- AES-256-GCM encrypted
    active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE(username, tenant_id)
);

CREATE TABLE mfa_backup_codes (
    id UUID PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    tenant_id VARCHAR(64) NOT NULL,
    code_hash VARCHAR(64) NOT NULL,        -- SHA-256 hash
    used BOOLEAN NOT NULL DEFAULT false,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    UNIQUE(username, tenant_id, code_hash)
);

CREATE TABLE mfa_trusted_devices (
    id UUID PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    tenant_id VARCHAR(64) NOT NULL,
    fingerprint_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
); 
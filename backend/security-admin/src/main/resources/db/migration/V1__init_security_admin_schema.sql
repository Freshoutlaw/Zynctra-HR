-- Security Admin Service Schema

CREATE SCHEMA IF NOT EXISTS securityadmin;

-- Roles
CREATE TABLE securityadmin.roles (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    level INTEGER,
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_roles_tenant ON securityadmin.roles(tenant_id);
CREATE INDEX idx_roles_active ON securityadmin.roles(is_active);

-- Permissions
CREATE TABLE securityadmin.permissions (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    permission_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(255),
    action VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_permissions_tenant ON securityadmin.permissions(tenant_id);
CREATE INDEX idx_permissions_active ON securityadmin.permissions(is_active);

-- Role Permissions
CREATE TABLE securityadmin.role_permissions (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (role_id) REFERENCES securityadmin.roles(id),
    FOREIGN KEY (permission_id) REFERENCES securityadmin.permissions(id),
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_perms_tenant ON securityadmin.role_permissions(tenant_id);
CREATE INDEX idx_role_perms_role ON securityadmin.role_permissions(role_id);
CREATE INDEX idx_role_perms_perm ON securityadmin.role_permissions(permission_id);

-- Audit Logs
CREATE TABLE securityadmin.audit_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    action VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

CREATE INDEX idx_audit_tenant ON securityadmin.audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON securityadmin.audit_logs(user_id);
CREATE INDEX idx_audit_created ON securityadmin.audit_logs(created_at);
CREATE INDEX idx_audit_resource ON securityadmin.audit_logs(resource_type, resource_id);

-- Security Incidents
CREATE TABLE securityadmin.security_incidents (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    severity_level VARCHAR(50) NOT NULL,
    description TEXT,
    detected_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_incidents_tenant ON securityadmin.security_incidents(tenant_id);
CREATE INDEX idx_incidents_severity ON securityadmin.security_incidents(severity_level);
CREATE INDEX idx_incidents_status ON securityadmin.security_incidents(status);
CREATE INDEX idx_incidents_detected ON securityadmin.security_incidents(detected_at);

-- Security Policies
CREATE TABLE securityadmin.security_policies (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    policy_name VARCHAR(255) NOT NULL,
    description TEXT,
    policy_content JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_policies_tenant ON securityadmin.security_policies(tenant_id);
CREATE INDEX idx_policies_active ON securityadmin.security_policies(is_active);

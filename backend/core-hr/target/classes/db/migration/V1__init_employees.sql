-- CREATE TABLE employees (
--     id UUID PRIMARY KEY,
--     tenant_id UUID NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     phone_number VARCHAR(20),
--     date_of_birth DATE,
--     gender VARCHAR(10),
--     department_id UUID,
--     job_title VARCHAR(100) NOT NULL,
--     manager_id UUID,
--     hire_date DATE NOT NULL,
--     status VARCHAR(50) NOT NULL,
--     employment_type VARCHAR(50),
--     salary NUMERIC(15, 2),
--     currency VARCHAR(10),
--     address VARCHAR(255),
--     city VARCHAR(100),
--     state VARCHAR(100),
--     postal_code VARCHAR(20),
--     country VARCHAR(100),
--     emergency_contact_name VARCHAR(100),
--     emergency_contact_phone VARCHAR(20),
--     user_id UUID,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     created_by VARCHAR(255),
--     updated_at TIMESTAMP,
--     updated_by VARCHAR(255),
--     deleted_at TIMESTAMP,
--     deleted_by VARCHAR(255)
-- );

-- CREATE INDEX idx_employees_email ON employees(email);
-- CREATE INDEX idx_employees_tenant_id ON employees(tenant_id);
-- CREATE INDEX idx_employees_department_id ON employees(department_id);
-- CREATE INDEX idx_employees_status ON employees(status);


CREATE SCHEMA IF NOT EXISTS core_hr_schema;

-- ============================================
-- employees
-- ============================================
CREATE TABLE core_hr_schema.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_number VARCHAR(32) NOT NULL,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    date_of_birth DATE NOT NULL,
    ssn_encrypted TEXT NOT NULL,
    bank_account_encrypted TEXT,
    routing_number_hash VARCHAR(64),
    salary_encrypted TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    department_id VARCHAR(64) NOT NULL,
    manager_id VARCHAR(64),
    job_title VARCHAR(128) NOT NULL,
    employment_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    hire_date DATE NOT NULL,
    termination_date DATE,
    access_level VARCHAR(32) NOT NULL DEFAULT 'EMPLOYEE',
    profile_photo_path VARCHAR(256),
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    data_retention_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT chk_emp_status CHECK (employment_status IN ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED')),
    CONSTRAINT chk_access_level CHECK (access_level IN ('EMPLOYEE', 'MANAGER', 'DIRECTOR', 'VP', 'C_LEVEL', 'ADMIN')),
    CONSTRAINT uq_emp_number_tenant UNIQUE (tenant_id, employee_number),
    CONSTRAINT uq_emp_email_tenant UNIQUE (tenant_id, email)
);

CREATE INDEX idx_employees_tenant ON core_hr_schema.employees(tenant_id) WHERE deleted = FALSE;
CREATE INDEX idx_employees_dept ON core_hr_schema.employees(tenant_id, department_id) WHERE deleted = FALSE;
CREATE INDEX idx_employees_manager ON core_hr_schema.employees(manager_id) WHERE deleted = FALSE AND employment_status = 'ACTIVE';
CREATE INDEX idx_employees_retention ON core_hr_schema.employees(tenant_id, data_retention_until) WHERE deleted = TRUE;

-- ============================================
-- departments
-- ============================================
CREATE TABLE core_hr_schema.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(16) NOT NULL,
    parent_id VARCHAR(64),
    head_employee_id VARCHAR(64),
    cost_center VARCHAR(32),
    location VARCHAR(128),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT uq_dept_code_tenant UNIQUE (tenant_id, code)
);

-- ============================================
-- employee_audit_logs (APPEND-ONLY)
-- ============================================
CREATE TABLE core_hr_schema.employee_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    action VARCHAR(32) NOT NULL,
    field_changed VARCHAR(64),
    old_value_hash VARCHAR(64),
    new_value_hash VARCHAR(64),
    change_reason VARCHAR(512),
    actor VARCHAR(128) NOT NULL,
    actor_ip VARCHAR(45),
    actor_role VARCHAR(32),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    correlation_id VARCHAR(64),
    
    CONSTRAINT chk_audit_action CHECK (action IN (
        'CREATED', 'UPDATED', 'DELETED', 'VIEWED_SENSITIVE', 'EXPORTED', 'TERMINATED', 'REHIRED'
    ))
);

CREATE INDEX idx_audit_employee ON core_hr_schema.employee_audit_logs(tenant_id, employee_id, timestamp DESC);
CREATE INDEX idx_audit_time ON core_hr_schema.employee_audit_logs(tenant_id, timestamp DESC);
CREATE INDEX idx_audit_correlation ON core_hr_schema.employee_audit_logs(correlation_id);

-- Row Level Security
ALTER TABLE core_hr_schema.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_hr_schema.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_hr_schema.employee_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_employees ON core_hr_schema.employees
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_departments ON core_hr_schema.departments
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_audit ON core_hr_schema.employee_audit_logs
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);

-- Least privilege
GRANT USAGE ON SCHEMA core_hr_schema TO zynctra_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA core_hr_schema TO zynctra_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core_hr_schema TO zynctra_app;
REVOKE DELETE, TRUNCATE ON ALL TABLES IN SCHEMA core_hr_schema FROM zynctra_app;
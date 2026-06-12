-- CREATE TABLE payroll_runs (
--     id UUID PRIMARY KEY,
--     tenant_id UUID NOT NULL,
--     employee_id UUID NOT NULL,
--     period_start_date DATE NOT NULL,
--     period_end_date DATE NOT NULL,
--     gross_salary NUMERIC(15, 2),
--     total_deductions NUMERIC(15, 2),
--     net_salary NUMERIC(15, 2),
--     status VARCHAR(50),
--     payment_date DATE,
--     payment_method VARCHAR(50),
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     created_by VARCHAR(255),
--     updated_at TIMESTAMP,
--     updated_by VARCHAR(255),
--     deleted_at TIMESTAMP,
--     deleted_by VARCHAR(255)
-- );

-- CREATE INDEX idx_payroll_runs_employee_id ON payroll_runs(employee_id);
-- CREATE INDEX idx_payroll_runs_period ON payroll_runs(period_start_date, period_end_date);


CREATE SCHEMA IF NOT EXISTS payroll_schema;

-- payroll_runs
CREATE TABLE payroll_schema.payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    payroll_run_number VARCHAR(32) NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    total_gross DECIMAL(15,2),
    total_net DECIMAL(15,2),
    total_taxes DECIMAL(15,2),
    total_deductions DECIMAL(15,2),
    approval_hash VARCHAR(64),
    approved_by VARCHAR(128),
    approved_at TIMESTAMPTZ,
    disbursed_by VARCHAR(128),
    disbursed_at TIMESTAMPTZ,
    idempotency_key VARCHAR(64) NOT NULL UNIQUE,
    run_type VARCHAR(32) NOT NULL DEFAULT 'REGULAR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT chk_payroll_status CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'DISBURSED', 'CANCELLED', 'RECONCILED')),
    CONSTRAINT chk_run_type CHECK (run_type IN ('REGULAR', 'BONUS', 'CORRECTION', 'TERMINATION', 'BACKPAY')),
    CONSTRAINT uq_payroll_run_number_tenant UNIQUE (tenant_id, payroll_run_number)
);

CREATE INDEX idx_payroll_runs_tenant ON payroll_schema.payroll_runs(tenant_id, pay_period_start DESC) WHERE deleted = FALSE;

-- pay_records
CREATE TABLE payroll_schema.pay_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    payroll_run_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    hours_worked DECIMAL(5,2),
    hourly_rate DECIMAL(10,2),
    gross_pay DECIMAL(15,2) NOT NULL,
    federal_tax DECIMAL(15,2),
    state_tax DECIMAL(15,2),
    local_tax DECIMAL(15,2),
    social_security DECIMAL(15,2),
    medicare DECIMAL(15,2),
    total_deductions DECIMAL(15,2),
    net_pay DECIMAL(15,2) NOT NULL,
    bank_account_id VARCHAR(64) NOT NULL,
    record_hash VARCHAR(64) NOT NULL,
    calculation_formula TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_pay_records_run ON payroll_schema.pay_records(tenant_id, payroll_run_id);
CREATE INDEX idx_pay_records_employee ON payroll_schema.pay_records(tenant_id, employee_id, created_at DESC);

-- bank_accounts
CREATE TABLE payroll_schema.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    account_holder_name VARCHAR(128) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    routing_number_hash VARCHAR(64) NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    account_type VARCHAR(16) NOT NULL DEFAULT 'CHECKING',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_method VARCHAR(32),
    verified_at TIMESTAMPTZ,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT chk_account_type CHECK (account_type IN ('CHECKING', 'SAVINGS')),
    CONSTRAINT chk_verification_method CHECK (verification_method IN ('MICRO_DEPOSIT', 'INSTANT', 'MANUAL'))
);

CREATE INDEX idx_bank_accounts_employee ON payroll_schema.bank_accounts(tenant_id, employee_id, is_primary DESC) WHERE active = TRUE AND deleted = FALSE;

-- tax_records
CREATE TABLE payroll_schema.tax_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    payroll_run_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    federal_tax DECIMAL(15,2),
    state_tax DECIMAL(15,2),
    local_tax DECIMAL(15,2),
    social_security DECIMAL(15,2),
    medicare DECIMAL(15,2),
    filing_status VARCHAR(16),
    allowances INTEGER,
    additional_withholding DECIMAL(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT chk_filing_status CHECK (filing_status IN ('SINGLE', 'MARRIED', 'HEAD_OF_HOUSEHOLD'))
);

-- deductions
CREATE TABLE payroll_schema.deductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    payroll_run_id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    deduction_type VARCHAR(32) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    employer_match DECIMAL(15,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT chk_deduction_type CHECK (deduction_type IN ('HEALTH_INSURANCE', 'DENTAL', 'VISION', '_401K', 'HSA', 'FSA', 'LIFE_INSURANCE', 'DISABILITY', 'GARNISHMENT', 'OTHER'))
);

-- payroll_audit_logs
CREATE TABLE payroll_schema.payroll_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    payroll_run_id VARCHAR(64),
    employee_id VARCHAR(64),
    action VARCHAR(32) NOT NULL,
    field_changed VARCHAR(64),
    old_value_hash VARCHAR(64),
    new_value_hash VARCHAR(64),
    amount DECIMAL(15,2),
    actor VARCHAR(128) NOT NULL,
    actor_ip VARCHAR(45),
    actor_role VARCHAR(32),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    correlation_id VARCHAR(64),
    integrity_hash VARCHAR(64) NOT NULL,
    
    CONSTRAINT chk_payroll_audit_action CHECK (action IN (
        'PAYROLL_CREATED', 'PAYROLL_CALCULATED', 'PAYROLL_APPROVED', 'PAYROLL_DISBURSED',
        'PAYROLL_CANCELLED', 'PAYROLL_RECONCILED', 'PAYROLL_HASH_VERIFIED',
        'PAY_RECORD_CREATED', 'PAY_RECORD_MODIFIED_ATTEMPT', 'PAY_RECORD_HASH_MISMATCH',
        'BANK_ACCOUNT_ADDED', 'BANK_ACCOUNT_CHANGED', 'BANK_ACCOUNT_VERIFIED',
        'TAX_RECORD_CREATED', 'TAX_ADJUSTMENT', 'DEDUCTION_CHANGED',
        'AMOUNT_ANOMALY', 'AFTER_HOURS_ACCESS', 'BULK_EXPORT'
    ))
);

CREATE INDEX idx_payroll_audit_run ON payroll_schema.payroll_audit_logs(tenant_id, payroll_run_id, timestamp DESC);
CREATE INDEX idx_payroll_audit_time ON payroll_schema.payroll_audit_logs(tenant_id, timestamp DESC);

-- Row Level Security
ALTER TABLE payroll_schema.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_schema.pay_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_schema.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_schema.tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_schema.deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_schema.payroll_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_payroll_runs ON payroll_schema.payroll_runs
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_pay_records ON payroll_schema.pay_records
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_bank_accounts ON payroll_schema.bank_accounts
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_tax_records ON payroll_schema.tax_records
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_deductions ON payroll_schema.deductions
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);
CREATE POLICY tenant_isolation_audit ON payroll_schema.payroll_audit_logs
    USING (tenant_id = current_setting('app.current_tenant')::TEXT);

-- Least privilege
GRANT USAGE ON SCHEMA payroll_schema TO zynctra_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA payroll_schema TO zynctra_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA payroll_schema TO zynctra_app;
REVOKE DELETE, TRUNCATE ON ALL TABLES IN SCHEMA payroll_schema FROM zynctra_app;
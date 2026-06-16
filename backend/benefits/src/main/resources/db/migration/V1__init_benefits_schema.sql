-- Benefits Service Schema

CREATE SCHEMA IF NOT EXISTS benefits;

-- Benefit Plans
CREATE TABLE benefits.benefit_plans (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    plan_type VARCHAR(50) NOT NULL,
    effective_date DATE,
    termination_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_benefit_plans_tenant ON benefits.benefit_plans(tenant_id);
CREATE INDEX idx_benefit_plans_active ON benefits.benefit_plans(is_active);
CREATE INDEX idx_benefit_plans_type ON benefits.benefit_plans(plan_type);

-- Employee Enrollments
CREATE TABLE benefits.enrollments (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    enrollment_date DATE NOT NULL,
    termination_date DATE,
    status VARCHAR(50) NOT NULL,
    coverage_level VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (plan_id) REFERENCES benefits.benefit_plans(id)
);

CREATE INDEX idx_enrollments_tenant ON benefits.enrollments(tenant_id);
CREATE INDEX idx_enrollments_employee ON benefits.enrollments(employee_id);
CREATE INDEX idx_enrollments_plan ON benefits.enrollments(plan_id);
CREATE INDEX idx_enrollments_status ON benefits.enrollments(status);

-- Claims
CREATE TABLE benefits.claims (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    enrollment_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    claim_date DATE NOT NULL,
    amount DECIMAL(15, 2),
    description TEXT,
    status VARCHAR(50) NOT NULL,
    approved_amount DECIMAL(15, 2),
    approved_date DATE,
    approved_by VARCHAR(255),
    denial_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (enrollment_id) REFERENCES benefits.enrollments(id)
);

CREATE INDEX idx_claims_tenant ON benefits.claims(tenant_id);
CREATE INDEX idx_claims_employee ON benefits.claims(employee_id);
CREATE INDEX idx_claims_enrollment ON benefits.claims(enrollment_id);
CREATE INDEX idx_claims_status ON benefits.claims(status);

-- Audit
CREATE TABLE benefits.audit_logs (
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

CREATE INDEX idx_audit_tenant ON benefits.audit_logs(tenant_id);
CREATE INDEX idx_audit_entity ON benefits.audit_logs(entity_type, entity_id);

-- Performance Service Schema

CREATE SCHEMA IF NOT EXISTS performance;

-- Performance Reviews
CREATE TABLE performance.performance_reviews (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    overall_rating DECIMAL(3, 1),
    review_text TEXT,
    status VARCHAR(50) NOT NULL,
    submitted_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_reviews_tenant ON performance.performance_reviews(tenant_id);
CREATE INDEX idx_reviews_employee ON performance.performance_reviews(employee_id);
CREATE INDEX idx_reviews_reviewer ON performance.performance_reviews(reviewer_id);
CREATE INDEX idx_reviews_status ON performance.performance_reviews(status);

-- Goals
CREATE TABLE performance.goals (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) NOT NULL,
    progress_percentage INTEGER DEFAULT 0,
    achievement_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_goals_tenant ON performance.goals(tenant_id);
CREATE INDEX idx_goals_employee ON performance.goals(employee_id);
CREATE INDEX idx_goals_status ON performance.goals(status);

-- Competencies
CREATE TABLE performance.competencies (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_competencies_tenant ON performance.competencies(tenant_id);
CREATE INDEX idx_competencies_active ON performance.competencies(is_active);

-- Employee Competencies
CREATE TABLE performance.employee_competencies (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    competency_id UUID NOT NULL,
    proficiency_level VARCHAR(50),
    assessment_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (competency_id) REFERENCES performance.competencies(id)
);

CREATE INDEX idx_emp_comp_tenant ON performance.employee_competencies(tenant_id);
CREATE INDEX idx_emp_comp_employee ON performance.employee_competencies(employee_id);
CREATE INDEX idx_emp_comp_competency ON performance.employee_competencies(competency_id);

-- Feedback
CREATE TABLE performance.feedback (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    feedback_text TEXT,
    rating INTEGER,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_feedback_tenant ON performance.feedback(tenant_id);
CREATE INDEX idx_feedback_employee ON performance.feedback(employee_id);
CREATE INDEX idx_feedback_reviewer ON performance.feedback(reviewer_id);

-- Audit
CREATE TABLE performance.audit_logs (
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

CREATE INDEX idx_audit_tenant ON performance.audit_logs(tenant_id);
CREATE INDEX idx_audit_entity ON performance.audit_logs(entity_type, entity_id);

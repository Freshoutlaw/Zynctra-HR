-- Learning Service Schema

CREATE SCHEMA IF NOT EXISTS learning;

-- Courses
CREATE TABLE learning.courses (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID,
    difficulty_level VARCHAR(50),
    duration_hours INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_courses_tenant ON learning.courses(tenant_id);
CREATE INDEX idx_courses_instructor ON learning.courses(instructor_id);
CREATE INDEX idx_courses_active ON learning.courses(is_active);

-- Course Assignments
CREATE TABLE learning.course_assignments (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    course_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    assigned_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(50) NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    completed_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (course_id) REFERENCES learning.courses(id)
);

CREATE INDEX idx_assignments_tenant ON learning.course_assignments(tenant_id);
CREATE INDEX idx_assignments_course ON learning.course_assignments(course_id);
CREATE INDEX idx_assignments_employee ON learning.course_assignments(employee_id);
CREATE INDEX idx_assignments_status ON learning.course_assignments(status);

-- Certifications
CREATE TABLE learning.certifications (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    course_id UUID NOT NULL,
    certificate_number VARCHAR(255) UNIQUE,
    issued_date DATE NOT NULL,
    expiry_date DATE,
    pdf_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (course_id) REFERENCES learning.courses(id)
);

CREATE INDEX idx_certifications_tenant ON learning.certifications(tenant_id);
CREATE INDEX idx_certifications_employee ON learning.certifications(employee_id);
CREATE INDEX idx_certifications_course ON learning.certifications(course_id);

-- AI Tutoring Sessions
CREATE TABLE learning.tutoring_sessions (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    course_id UUID NOT NULL,
    question TEXT,
    answer TEXT,
    rating INTEGER,
    feedback TEXT,
    session_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255),
    FOREIGN KEY (course_id) REFERENCES learning.courses(id)
);

CREATE INDEX idx_tutoring_tenant ON learning.tutoring_sessions(tenant_id);
CREATE INDEX idx_tutoring_employee ON learning.tutoring_sessions(employee_id);
CREATE INDEX idx_tutoring_course ON learning.tutoring_sessions(course_id);

-- Audit
CREATE TABLE learning.audit_logs (
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

CREATE INDEX idx_audit_tenant ON learning.audit_logs(tenant_id);
CREATE INDEX idx_audit_entity ON learning.audit_logs(entity_type, entity_id);

CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    gross_salary NUMERIC(15, 2),
    total_deductions NUMERIC(15, 2),
    net_salary NUMERIC(15, 2),
    status VARCHAR(50),
    payment_date DATE,
    payment_method VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(255)
);

CREATE INDEX idx_payroll_runs_employee_id ON payroll_runs(employee_id);
CREATE INDEX idx_payroll_runs_period ON payroll_runs(period_start_date, period_end_date);

-- Analytics Service Schema
-- Initial migration for analytics tables

CREATE SCHEMA IF NOT EXISTS analytics;

-- Dashboard Widgets
CREATE TABLE analytics.dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    widget_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 1,
    height INTEGER NOT NULL DEFAULT 1,
    config JSONB,
    data_source VARCHAR(100) NOT NULL,
    refresh_interval_seconds INTEGER,
    min_role_required VARCHAR(20),
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_widgets_tenant ON analytics.dashboard_widgets(tenant_id);
CREATE INDEX idx_widgets_type ON analytics.dashboard_widgets(widget_type);

-- Reports
CREATE TABLE analytics.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    category VARCHAR(50) NOT NULL,
    query_definition JSONB NOT NULL,
    parameters JSONB,
    output_format VARCHAR(20) NOT NULL,
    created_by UUID NOT NULL,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    last_execution_status VARCHAR(20),
    execution_count INTEGER NOT NULL DEFAULT 0,
    is_scheduled BOOLEAN NOT NULL DEFAULT false,
    schedule_cron VARCHAR(100),
    is_shared BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_reports_tenant ON analytics.reports(tenant_id);
CREATE INDEX idx_reports_category ON analytics.reports(category);
CREATE INDEX idx_reports_created_by ON analytics.reports(created_by);

-- Scheduled Reports
CREATE TABLE analytics.scheduled_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    report_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    cron_expression VARCHAR(100) NOT NULL,
    recipients VARCHAR(1000) NOT NULL,
    next_run_at TIMESTAMP WITH TIME ZONE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    last_run_status VARCHAR(20),
    last_run_error VARCHAR(2000),
    run_count INTEGER NOT NULL DEFAULT 0,
    failure_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_scheduled_tenant ON analytics.scheduled_reports(tenant_id);
CREATE INDEX idx_scheduled_next_run ON analytics.scheduled_reports(next_run_at);

-- Export Jobs
CREATE TABLE analytics.export_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    report_id UUID,
    export_type VARCHAR(20) NOT NULL,
    format VARCHAR(20) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    storage_key VARCHAR(500),
    row_count INTEGER,
    status VARCHAR(20) NOT NULL,
    error_message VARCHAR(2000),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_exports_tenant ON analytics.export_jobs(tenant_id);
CREATE INDEX idx_exports_status ON analytics.export_jobs(status);
CREATE INDEX idx_exports_created_by ON analytics.export_jobs(created_by);
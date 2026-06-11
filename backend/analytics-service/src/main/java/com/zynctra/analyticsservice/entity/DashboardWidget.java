package com.zynctra.analytics.entity;

import com.zynctra.shared.entity.TenantBaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

/**
 * Dashboard Widget Entity
 * 
 * Represents a configurable widget on a user's analytics dashboard.
 * Widgets are tenant-scoped and can be customized per user role.
 */
@Entity
@Table(name = "dashboard_widgets", schema = "analytics", indexes = {
    @Index(name = "idx_widgets_tenant", columnList = "tenant_id"),
    @Index(name = "idx_widgets_type", columnList = "widget_type")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardWidget extends TenantBaseEntity {

    @Column(name = "widget_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private WidgetType widgetType;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "position_x", nullable = false)
    private Integer positionX;

    @Column(name = "position_y", nullable = false)
    private Integer positionY;

    @Column(name = "width", nullable = false)
    private Integer width;

    @Column(name = "height", nullable = false)
    private Integer height;

    @Column(name = "config", columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> config;

    @Column(name = "data_source", nullable = false, length = 100)
    private String dataSource;

    @Column(name = "refresh_interval_seconds")
    private Integer refreshIntervalSeconds;

    @Column(name = "min_role_required", length = 20)
    @Enumerated(EnumType.STRING)
    private com.zynctra.analytics.security.Role minRoleRequired;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum WidgetType {
        EMPLOYEE_COUNT,
        ATTRITION_RATE,
        HIRING_FUNNEL,
        PAYROLL_SUMMARY,
        ATTENDANCE_RATE,
        LEAVE_BALANCE,
        PERFORMANCE_DISTRIBUTION,
        GOAL_PROGRESS,
        AI_INSIGHTS,
        CUSTOM_CHART,
        RECENT_ACTIVITY,
        UPCOMING_EVENTS
    }
}
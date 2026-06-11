package com.zynctra.analytics.controller;

import com.zynctra.analytics.dto.DashboardSummaryResponse;
import com.zynctra.analytics.entity.DashboardWidget;
import com.zynctra.analytics.security.Role;
import com.zynctra.analytics.security.TenantAuthenticationToken;
import com.zynctra.analytics.service.DashboardService;
import com.zynctra.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        Role role = Role.valueOf(auth.getAuthorities().iterator().next().getAuthority());

        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(tenantId, role);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/widgets")
    public ResponseEntity<ApiResponse<List<DashboardWidget>>> getWidgets() {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UUID tenantId = auth.getTenantId();
        Role role = Role.valueOf(auth.getAuthorities().iterator().next().getAuthority());

        List<DashboardWidget> widgets = dashboardService.getWidgetsForUser(tenantId, role);
        return ResponseEntity.ok(ApiResponse.success(widgets));
    }

    @GetMapping("/widgets/{widgetId}/data")
    public ResponseEntity<ApiResponse<Object>> getWidgetData(@PathVariable UUID widgetId) {
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/widgets")
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<ApiResponse<DashboardWidget>> createWidget(@RequestBody DashboardWidget widget) {
        TenantAuthenticationToken auth = (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        widget.setTenantId(auth.getTenantId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/widgets/{widgetId}")
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<ApiResponse<DashboardWidget>> updateWidget(
            @PathVariable UUID widgetId,
            @RequestBody DashboardWidget widget) {
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/widgets/{widgetId}")
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteWidget(@PathVariable UUID widgetId) {
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
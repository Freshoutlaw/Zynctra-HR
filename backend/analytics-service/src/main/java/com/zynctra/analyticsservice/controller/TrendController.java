package com.zynctra.analytics.controller;

import com.zynctra.analytics.dto.TrendAnalysisRequest;
import com.zynctra.analytics.service.TrendService;
import com.zynctra.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics/trends")
@RequiredArgsConstructor
public class TrendController {

    private final TrendService trendService;

    @PostMapping("/analyze")
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analyzeTrend(
            @Valid @RequestBody TrendAnalysisRequest request) {
        Map<String, Object> result = trendService.analyzeTrend(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<List<String>>> availableMetrics() {
        List<String> metrics = List.of(
            "attrition",
            "hiring",
            "attendance",
            "payroll",
            "performance",
            "leave_utilization",
            "headcount",
            "time_to_hire",
            "cost_per_hire"
        );
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @PostMapping("/forecast")
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> forecast(
            @Valid @RequestBody TrendAnalysisRequest request) {
        Map<String, Object> result = trendService.forecast(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/compare")
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> comparePeriods(
            @Valid @RequestBody TrendAnalysisRequest request) {
        Map<String, Object> result = trendService.comparePeriods(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
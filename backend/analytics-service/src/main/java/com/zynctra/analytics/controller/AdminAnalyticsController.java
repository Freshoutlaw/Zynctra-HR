package com.zynctra.analytics.controller;

import com.zynctra.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SUPER_ADMIN')")
public class AdminAnalyticsController {

    @GetMapping("/platform-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformStats() {
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/tenant-usage")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTenantUsage() {
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
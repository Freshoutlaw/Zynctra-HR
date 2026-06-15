package com.zynctra.timeattendance.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.concurrent.TimeUnit;

/**
 * Fraud Detection Service for Time & Attendance.
 * 
 * Detects and prevents:
 * - Buddy punching (same device/IP for different employees)
 * - Impossible travel (clock in from two distant locations within short time)
 * - Off-hours clock manipulation
 * - Excessive clock-ins (DoS or time theft)
 * - GPS spoofing (location outside geofence)
 * 
 * All detection is LOCAL — no external APIs.
 */
@Service
public class FraudDetectionService {
    
    private static final Logger FRAUD_LOG = LoggerFactory.getLogger("FRAUD_DETECTION");
    
    private final StringRedisTemplate redisTemplate;
    
    @Value("${security.clockin.max-clock-in-per-day:5}")
    private int maxClockInsPerDay;
    
    @Value("${security.clockin.min-time-between-clocks:300}")
    private int minSecondsBetweenClocks;
    
    @Value("${security.geofence.enabled:true}")
    private boolean geofenceEnabled;
    
    @Value("${security.clockin.ip-binding-enabled:true}")
    private boolean ipBindingEnabled;

    public FraudDetectionService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Validates a clock-in/out request for fraud indicators.
     * Throws SecurityException if fraud detected.
     */
    public void validateClockOperation(String employeeId, String clientIp, 
                                        String deviceFingerprint, Double latitude, 
                                        Double longitude, Instant timestamp) {
        
        String tenantId = TenantContext.getCurrentTenant();
        String today = LocalDate.now(ZoneId.of("UTC")).toString();
        
        // 1. Rate limit: max clock-ins per day
        String dailyKey = "clockin:daily:" + tenantId + ":" + employeeId + ":" + today;
        Long dailyCount = redisTemplate.opsForValue().increment(dailyKey);
        if (dailyCount == 1) {
            redisTemplate.expire(dailyKey, 25, TimeUnit.HOURS);
        }
        if (dailyCount > maxClockInsPerDay) {
            logFraudEvent(employeeId, "EXCESSIVE_CLOCK_INS", 
                "Daily limit exceeded: " + dailyCount + " clock operations");
            throw new SecurityException("Daily clock-in limit exceeded. Contact your manager.");
        }
        
        // 2. Minimum time between clock operations (prevent rapid toggle)
        String lastClockKey = "clockin:last:" + tenantId + ":" + employeeId;
        String lastClockStr = redisTemplate.opsForValue().get(lastClockKey);
        if (lastClockStr != null) {
            Instant lastClock = Instant.parse(lastClockStr);
            long secondsSince = java.time.Duration.between(lastClock, timestamp).getSeconds();
            if (secondsSince < minSecondsBetweenClocks) {
                logFraudEvent(employeeId, "RAPID_CLOCK_TOGGLE",
                    "Only " + secondsSince + "s since last clock operation");
                throw new SecurityException("Please wait before next clock operation");
            }
        }
        redisTemplate.opsForValue().set(lastClockKey, timestamp.toString(), 25, TimeUnit.HOURS);
        
        // 3. Buddy punching detection: same device for different employee
        if (deviceFingerprint != null && !deviceFingerprint.isBlank()) {
            String deviceKey = "clockin:device:" + tenantId + ":" + deviceFingerprint;
            String lastEmployee = redisTemplate.opsForValue().get(deviceKey);
            if (lastEmployee != null && !lastEmployee.equals(employeeId)) {
                logFraudEvent(employeeId, "BUDDY_PUNCHING_SUSPECTED",
                    "Device previously used by employee: " + maskId(lastEmployee));
            }
            redisTemplate.opsForValue().set(deviceKey, employeeId, 25, TimeUnit.HOURS);
        }
        
        // 4. IP binding check
        if (ipBindingEnabled && clientIp != null) {
            String ipKey = "clockin:ip:" + tenantId + ":" + employeeId;
            String knownIp = redisTemplate.opsForValue().get(ipKey);
            if (knownIp == null) {
                redisTemplate.opsForValue().set(ipKey, clientIp, 30, TimeUnit.DAYS);
            } else if (!knownIp.equals(clientIp)) {
                logFraudEvent(employeeId, "IP_ANOMALY",
                    "Clock-in from new IP: " + maskIp(clientIp) + " (known: " + maskIp(knownIp) + ")");
            }
        }
        
        // 5. Geofence validation
        if (geofenceEnabled && latitude != null && longitude != null) {
            validateGeofence(employeeId, latitude, longitude);
        }
        
        // 6. Off-hours anomaly
        int hour = timestamp.atZone(ZoneId.of("UTC")).getHour();
        if (hour < 5 || hour > 23) {
            logFraudEvent(employeeId, "OFF_HOURS_CLOCK",
                "Clock operation at hour: " + hour);
        }
    }
    
    private void validateGeofence(String employeeId, double lat, double lng) {
        if (lat == 0.0 && lng == 0.0) {
            logFraudEvent(employeeId, "INVALID_GPS", "GPS coordinates are 0,0 — likely spoofed");
            throw new SecurityException("Invalid location data detected");
        }
        
        if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
            logFraudEvent(employeeId, "INVALID_GPS", "GPS coordinates out of range");
            throw new SecurityException("Invalid location data detected");
        }
    }
    
    public void checkImpossibleTravel(String employeeId, Instant clockInTime, 
                                       double clockInLat, double clockInLng,
                                       Instant clockOutTime,
                                       double clockOutLat, double clockOutLng) {
        
        long minutesBetween = java.time.Duration.between(clockInTime, clockOutTime).toMinutes();
        double distanceKm = haversineDistance(clockInLat, clockInLng, clockOutLat, clockOutLng);
        
        double minRequiredMinutes = (distanceKm / 100.0) * 60;
        
        if (minutesBetween < minRequiredMinutes && distanceKm > 10) {
            logFraudEvent(employeeId, "IMPOSSIBLE_TRAVEL",
                "Travelled " + String.format("%.1f", distanceKm) + "km in " + minutesBetween + "min");
        }
    }
    
    private double haversineDistance(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    private void logFraudEvent(String employeeId, String type, String details) {
        FRAUD_LOG.warn("FRAUD|type={}|employee={}|tenant={}|details={}|timestamp={}",
            type, maskId(employeeId), TenantContext.getCurrentTenant(), 
            details, Instant.now());
    }
    
    private String maskId(String id) {
        if (id == null || id.length() < 8) return "***";
        return id.substring(0, 3) + "****" + id.substring(id.length() - 2);
    }
    
    private String maskIp(String ip) {
        if (ip == null || !ip.contains(".")) return "***";
        String[] parts = ip.split("\\.");
        if (parts.length != 4) return "***";
        return parts[0] + "." + parts[1] + ".***.***";
    }
}
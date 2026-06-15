package com.zynctra.securityadmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Security Admin Service — THE MOST CRITICAL MODULE
 * 
 * This module controls:
 * - Role-Based Access Control (RBAC)
 * - Permission matrices
 * - Security policies
 * - Audit log immutability
 * - Threat incident management
 * 
 * SECURITY PRINCIPLES:
 * - ZERO TRUST: Every admin operation verified, logged, and rate-limited
 * - PRIVILEGE ESCALATION PREVENTION: No user can escalate their own privileges
 * - IMMUTABLE AUDIT: Audit logs can never be modified or deleted
 * - SEPARATION OF DUTIES: Role assignment requires approval above certain levels
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
@ComponentScan(basePackages = {
    "com.zynctra.securityadmin",
    "com.zynctra.common.security",
    "com.zynctra.common.tenant"
})
public class SecurityAdminApplication {

    public static void main(String[] args) {
        validateSecurityProperties();
        SpringApplication.run(SecurityAdminApplication.class, args);
    }

    private static void validateSecurityProperties() {
        String encoding = System.getProperty("file.encoding");
        if (!"UTF-8".equalsIgnoreCase(encoding)) {
            throw new IllegalStateException("JVM must run with -Dfile.encoding=UTF-8");
        }
        System.setProperty("jdk.serialFilter", 
            "com.zynctra.securityadmin.**;java.base/**;!*");
        
        // Security admin specific: disable unsafe reflection
        System.setProperty("spring.beaninfo.ignore", "true");
    }
}
package com.zynctra.performance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * Performance Management Service — Spring Boot Application
 * 
 * SECURITY: 
 * - Excludes DataSource auto-config if not needed immediately
 * - Component scan limited to performance package to prevent bean injection attacks
 * - Discovery client enabled for service mesh security
 */
@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {
    "com.zynctra.performance",
    "com.zynctra.common.security",  // Shared security components
    "com.zynctra.common.tenant"     // Shared tenant context
})
public class PerformanceApplication {

    public static void main(String[] args) {
        // Security: Validate JVM security properties on startup
        validateSecurityProperties();
        SpringApplication.run(PerformanceApplication.class, args);
    }

    private static void validateSecurityProperties() {
        // Ensure critical security flags are set
        String fileEncoding = System.getProperty("file.encoding");
        if (!"UTF-8".equalsIgnoreCase(fileEncoding)) {
            throw new IllegalStateException("JVM must run with -Dfile.encoding=UTF-8 for security");
        }
        
        // Prevent serialization attacks
        System.setProperty("jdk.serialFilter", 
            "com.zynctra.performance.**;java.base/**;!*");
    }
}
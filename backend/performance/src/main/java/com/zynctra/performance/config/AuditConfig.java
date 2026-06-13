package com.zynctra.performance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * Audit Configuration — Enables AOP-based security auditing
 */
@Configuration
@EnableAspectJAutoProxy
public class AuditConfig {

    @Bean
    public AuditAspect auditAspect() {
        return new AuditAspect();
    }
}
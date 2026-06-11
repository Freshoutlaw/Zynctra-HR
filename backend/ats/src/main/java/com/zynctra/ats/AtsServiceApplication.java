package com.zynctra.ats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ATS Service Application
 * 
 * Entry point for the Zynctra Applicant Tracking System.
 * Manages job requisitions, candidate pipelines, interviews,
 * and offer management for the recruiting lifecycle.
 */
@SpringBootApplication
public class AtsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AtsServiceApplication.class, args);
    }
}
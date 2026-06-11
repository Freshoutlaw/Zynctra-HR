package com.zynctra.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * API Gateway Application
 * 
 * Entry point for the Zynctra API Gateway service.
 * Handles routing, authentication, rate limiting, and tenant resolution
 * for all incoming requests to downstream microservices.
 */
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
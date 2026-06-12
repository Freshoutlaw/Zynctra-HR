package com.zynctra.learning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.zynctra.learning", "com.zynctra.common"})
@EnableScheduling
public class LearningServiceApplication {

    public static void main(String[] args) {
        validateEnvironment();
        SpringApplication.run(LearningServiceApplication.class, args);
    }

    private static void validateEnvironment() {
        String[] required = {
            "LEARNING_DB_URL", "LEARNING_DB_PASSWORD", 
            "LEARNING_MASTER_SECRET", "AI_SERVICE_API_KEY", "JWT_SECRET"
        };
        for (String env : required) {
            if (System.getenv(env) == null || System.getenv(env).isBlank()) {
                throw new IllegalStateException("Required environment variable not set: " + env);
            }
        }
        if (System.getenv("LEARNING_MASTER_SECRET").length() < 32) {
            throw new IllegalStateException("LEARNING_MASTER_SECRET must be >= 32 characters");
        }
    }
}
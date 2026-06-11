package com.zynctra.benefits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BenefitsApplication {
    public static void main(String[] args) {
        SpringApplication.run(BenefitsApplication.class, args);
    }
}
package com.zynctra.corehr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.zynctra.corehr", "com.zynctra.common"})
public class CoreHrApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoreHrApplication.class, args);
    }
}

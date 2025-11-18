package com.tradecraft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * TradeCraft E-commerce Platform - Main Application
 *
 * A cross-border e-commerce platform built with Spring Boot 3.2.0
 *
 * @author TradeCraft Team
 * @version 1.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
public class TradeCraftApplication {

    public static void main(String[] args) {
        SpringApplication.run(TradeCraftApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  TradeCraft Backend Server Started");
        System.out.println("  API Documentation: http://localhost:8080/swagger-ui.html");
        System.out.println("  Health Check: http://localhost:8080/actuator/health");
        System.out.println("========================================\n");
    }
}

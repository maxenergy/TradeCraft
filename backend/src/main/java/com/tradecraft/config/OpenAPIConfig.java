package com.tradecraft.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI (Swagger) 配置
 */
@Configuration
public class OpenAPIConfig {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Bean
    public OpenAPI tradeCraftOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TradeCraft API")
                        .description("跨境电商AI自动化平台 REST API")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("TradeCraft Team")
                                .email("support@tradecraft.com")
                                .url("https://tradecraft.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("开发环境"),
                        new Server()
                                .url("https://api.tradecraft.com")
                                .description("生产环境")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("输入JWT令牌")));
    }
}

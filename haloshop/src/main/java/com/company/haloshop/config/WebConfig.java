package com.company.haloshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 🔥 CORS 통합
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 API 허용
                .allowedOrigins("http://localhost:3000") // 프론트 포트
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true);
    }

    // 🔥 정적 리소스 핸들러 - 리뷰 이미지
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 리뷰 이미지 경로
        registry.addResourceHandler("/uploads/reviews/**")
                .addResourceLocations("file:src/main/resources/static/upload/review/");

        // 상품 이미지 경로
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/upload/");
    }
}

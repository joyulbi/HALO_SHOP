package com.company.haloshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로 CORS 허용 (API + 정적 리소스 등 포함)
                .allowedOrigins("http://localhost:3000")  // 프론트 주소만 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 리뷰 이미지 (외부 디렉토리로 수정)
        registry.addResourceHandler("/upload/review/**")
        		.addResourceLocations("file:///C:/upload/review/");
        
        // 상품 이미지 (외부 디렉토리)
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/upload/");
        
        // 캠페인 이미지 (외부 디렉토리)
        registry.addResourceHandler("/uploads/campaign/**")
        	.addResourceLocations("file:///C:/upload/campaign/");
    }
}
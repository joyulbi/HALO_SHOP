package com.company.haloshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // React에서 호출하는 API 경로
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
    
    // 정적 리소스 핸들링 설정 (리뷰 이미지 접근용)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/reviews/**")
                .addResourceLocations("file:src/main/resources/static/upload/review/");
        // 또는 실제 서버 루트 외부에 저장한 경우엔 아래처럼 사용
        // .addResourceLocations("file:./upload/review/");
    }
}

package com.company.haloshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
	    registry.addMapping("/api/**")
	            .allowedOrigins("http://localhost:3000") // 프론트 포트 잘 적었음
	            .allowedMethods("GET", "POST", "PUT", "DELETE")
	            .allowedHeaders("*") // 혹시 헤더 제한 생기지 않게 전체 허용 추가
	            .allowCredentials(true);
	}

    // 🔥 정적 리소스 핸들러 
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/upload/");
    }
}
package com.company.haloshop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    http
	        .cors() // CORS 허용
	        .and()
	        .csrf().disable()
	        .authorizeRequests()
	            .antMatchers("/api/**", "/images/**", "/upload/**").permitAll() // 이미지, API 전부 허용
	            .anyRequest().permitAll() // 🔥 전체 열어두기 (테스트용. 추후 로그인 붙이면 수정)
	        .and()
	        .formLogin().disable();

	    return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.addAllowedOrigin("http://localhost:3000"); // React 포트
	    configuration.addAllowedMethod("*");
	    configuration.addAllowedHeader("*");
	    configuration.setAllowCredentials(true); // 크로스 쿠키 허용 (필요 시)

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration); // 🔥 모든 경로 CORS 허용

	    return source;
	}
}

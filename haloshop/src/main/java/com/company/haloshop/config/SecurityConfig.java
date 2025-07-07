package com.company.haloshop.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.company.haloshop.security.JwtAuthenticationFilter;
import com.company.haloshop.security.JwtTokenProvider;
import com.company.haloshop.security.UserDetailsServiceImpl;
import com.company.haloshop.security.mapper.JwtBlacklistMapper;
import com.company.haloshop.security.middleware.AttackDetectionFilter;  // 추가된 필터 import

/**
 * 애플리케이션 전반의 보안 설정 클래스
 * - 인증(Authentication), 인가(Authorization), CSRF, CORS, 보안 헤더, 커스텀 필터 등
 */
@Configuration
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtBlacklistMapper jwtBlacklistMapper;
    private final AttackDetectionFilter attackDetectionFilter;  // 주입된 공격 탐지 필터
    private final BotDetectionFilter botDetectionFilter;        // 주입된 봇 탐지 필터

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          JwtTokenProvider jwtTokenProvider,
                          JwtBlacklistMapper jwtBlacklistMapper,
                          AttackDetectionFilter attackDetectionFilter,
                          BotDetectionFilter botDetectionFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtBlacklistMapper = jwtBlacklistMapper;
        this.attackDetectionFilter = attackDetectionFilter;
        this.botDetectionFilter = botDetectionFilter;
    }

    /**
     * 일반 사용자를 위한 BCryptPasswordEncoder 빈 등록
     * - salt 생성과 해싱 강도로 CPU 기반 연산 비용 약 2^12 회 수행
     * - bcrypt는 adaptive 해싱으로, 공격자가 하드웨어 성능을 업그레이드해도 안전성 유지
     */
    @Bean
    public PasswordEncoder userPasswordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * 관리자를 위한 Argon2PasswordEncoder 빈 등록
     * Argon2는 메모리 사용량, 병렬 처리 수, 반복 횟수 등을 조정하여
     * GPU/ASIC 기반 공격에도 매우 강력한 암호화 구현체
     */
    @Bean
    public PasswordEncoder adminPasswordEncoder() {
        return new Argon2PasswordEncoder(
            16,    // 솔트 생성 길이: 16바이트
            32,    // 해시 출력 길이: 32바이트
            1,     // 병렬 처리 스레드: 1
            65536, // 메모리 사용: 64MB
            4      // 반복 실행 횟수: 4회
        );
    }

    /**
     * AuthenticationManager 빈 등록
     * - 관리자 인증용 Provider: Argon2PasswordEncoder
     * - 일반 사용자 인증용 Provider: BCryptPasswordEncoder
     */
    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider adminProvider = new DaoAuthenticationProvider();
        adminProvider.setUserDetailsService(userDetailsService);
        adminProvider.setPasswordEncoder(adminPasswordEncoder());

        DaoAuthenticationProvider userProvider = new DaoAuthenticationProvider();
        userProvider.setUserDetailsService(userDetailsService);
        userProvider.setPasswordEncoder(userPasswordEncoder());

        return new ProviderManager(Arrays.asList(adminProvider, userProvider));
    }

    /**
     * JWT 인증 필터 빈 등록
     * - Authorization 헤더의 Bearer 토큰을 검증
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService, jwtBlacklistMapper);
    }

    /**
     * 전체 보안 필터 체인 설정
     */
    
    /**
     * 봇 탐지 및 차단 필터 빈 등록
     */
    @Bean
    public BotDetectionFilter botDetectionFilter() {
        return new BotDetectionFilter();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1) Custom AuthenticationManager 연결
            .authenticationManager(authenticationManager())

            // 2) 세션 정책: IF_REQUIRED
            .sessionManagement(sm -> sm
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )

            // 3) CSRF 설정
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringAntMatchers( "/api/admin/item-images/**", "/auth/**", "/user/me", "/admin/**","/security/**","/api/items/admin")
            )

            // 4) 권한 및 URL 접근 제어
            .authorizeRequests(authz -> authz
                //.antMatchers("/admin/**").hasRole("ADMIN")  // 관리자 경로는 ADMIN 권한만
                .antMatchers("/auth/**").permitAll()
                .antMatchers("/api/items", "/api/pay/kakao/**").permitAll()
                .antMatchers("/api/items/admin/**").access("@adminCheck.hasAuthority(authentication)")
                .antMatchers("/api/**").permitAll()
                .antMatchers("/admin/me").permitAll()
                .antMatchers("/user/me").permitAll()
                .antMatchers("/user/**").authenticated()
                .antMatchers("/admin/**").access("@adminCheck.hasAuthority(authentication)")
                .antMatchers("/admin/user/**")
                    .access("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).USER_ADMIN)")
                .antMatchers("/admin/security/**")
                    .access("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).SECURITY_ADMIN)")
                .antMatchers("/security/**")
                    .access("@adminCheck.hasRoleEnum(authentication, T(com.company.haloshop.security.Role).SECURITY_ADMIN)")
                .anyRequest().permitAll()
            )

            // 5) 인증/인가 예외 처리: 401 Unauthorized
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, ex2) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
            )

            // 6) 보안 헤더 강화
            .headers(headers -> {
                headers.contentSecurityPolicy("default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';");
                headers.httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000));
                headers.referrerPolicy(rp -> rp.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER));
                headers.xssProtection(xss -> xss.block(true));
                headers.frameOptions(frame -> frame.deny());
                headers.cacheControl();
                headers.contentTypeOptions();
            })

            // 7) CORS 설정 및 커스텀 필터 배치
            .cors().and()

            // AttackDetectionFilter: 세션 로그인 필터 앞
            .addFilterBefore(attackDetectionFilter, UsernamePasswordAuthenticationFilter.class)

            // JWT 인증 필터: 역시 세션 로그인 필터 앞
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)

            // 봇 탐지 및 차단 필터: JWT 필터 뒤
            .addFilterAfter(botDetectionFilter, JwtAuthenticationFilter.class)
        ;

        return http.build();
    }

    /**
     * 세션 쿠키 SameSite=None 설정 (Spring Boot 2.7.x에서 필수)
     */
    @Configuration
    public class CookieConfig {
        @Bean
        public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
            return CookieSameSiteSupplier.ofNone();
        }
    }

    /**
     * 봇 탐지 및 차단 필터
     * - 구글봇 제외, 주요 크롤러 User-Agent 차단
     */
    @Component
    @Order(3)
    public static class BotDetectionFilter extends OncePerRequestFilter {
        private static final List<String> BLOCKED_BOTS = Arrays.asList(
            "BingBot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot",
            "Sogou", "Exabot", "facebot", "ia_archiver", "AhrefsBot",
            "MJ12bot", "SemrushBot", "DotBot", "SeznamBot", "Screaming Frog"
        );
        private static final String ALLOWED_GOOGLEBOT = "Googlebot";

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {
            String ua = request.getHeader("User-Agent");
            if (ua != null) {
                if (ua.contains(ALLOWED_GOOGLEBOT)) {
                    chain.doFilter(request, response);
                    return;
                }
                String uaLower = ua.toLowerCase();
                for (String bot : BLOCKED_BOTS) {
                    if (uaLower.contains(bot.toLowerCase())) {
                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Bot blocked");
                        return;
                    }
                }
            }
            chain.doFilter(request, response);
        }
    }

    /**
     * CORS 설정 소스
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", config);
        return src;
    }
}

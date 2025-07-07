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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.OncePerRequestFilter;

import com.company.haloshop.security.JwtAuthenticationFilter;
import com.company.haloshop.security.JwtTokenProvider;
import com.company.haloshop.security.UserDetailsServiceImpl;
import com.company.haloshop.security.mapper.JwtBlacklistMapper;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.company.haloshop.dto.member.AccountDto;

@Configuration
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtBlacklistMapper jwtBlacklistMapper;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtTokenProvider jwtTokenProvider, JwtBlacklistMapper jwtBlacklistMapper) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtBlacklistMapper = jwtBlacklistMapper;
    }

    
    @Component("adminCheck")
    public class AdminCheck {

        public boolean hasAdminAuthority(Authentication authentication) {
            if (authentication == null || !authentication.isAuthenticated()) return false;

            Object principal = authentication.getPrincipal();
            if (principal instanceof AccountDto) {
                AccountDto account = (AccountDto) principal;
                return Boolean.TRUE.equals(account.getIsAdmin());
            }
            return false;
        }
    }
    
    @Bean
    public PasswordEncoder userPasswordEncoder() {
        // bcrypt 강도 12 (기본은 10, 12는 더 강력하지만 CPU 비용 증가)
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public PasswordEncoder adminPasswordEncoder() {
        /*
         * Argon2PasswordEncoder 상세 파라미터 설명:
         *
         * Argon2PasswordEncoder(int saltLength, int hashLength, int parallelism, int memory, int iterations)
         *
         * saltLength: 솔트 길이 (바이트 단위) - 기본 16 (랜덤한 솔트를 생성해 해시 보안 강화)
         * hashLength: 해시 결과 길이 (바이트) - 기본 32
         * parallelism: 병렬 처리 수 - 기본 1 (동시에 처리할 스레드 수, CPU 코어 수 고려)
         * memory: 메모리 사용량 (킬로바이트 단위) - 기본 65536 (64MB, 메모리 공격 방어용)
         * iterations: 반복 횟수 - 기본 1 (연산 반복으로 공격 비용 상승)
         *
         * 튜닝된 값:
         * - saltLength: 16 (16바이트 랜덤 솔트)
         * - hashLength: 32 (32바이트 해시 출력)
         * - parallelism: 1 (싱글 스레드)
         * - memory: 65536 (64MB 메모리 소비)
         * - iterations: 4 (연산 반복 4회)
         *
         * 이 조합은 강력한 해시를 생성해, GPU/ASIC 공격에 매우 강함.
         * 단, 서버 리소스에 부담될 수 있으니 테스트 후 조절 권장.
         */
        return new Argon2PasswordEncoder(
            16,    // saltLength
            32,    // hashLength
            1,     // parallelism
            65536, // memory (KB)
            4      // iterations
        );
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider userProvider = new DaoAuthenticationProvider();
        userProvider.setUserDetailsService(userDetailsService);
        userProvider.setPasswordEncoder(userPasswordEncoder());

        // 관리자용 DaoAuthenticationProvider 별도 구현 가능 (필요시 추가)

        return new ProviderManager(userProvider);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService, jwtBlacklistMapper);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 세션 정책
            // JWT 로그인(일반 유저)은 stateless 처리 (세션 생성하지 않음)
            // 세션 로그인(어드민)은 세션 생성 허용 (세션 사용 필요)
            .sessionManagement(session -> session
                // 세션 정책을 IF_REQUIRED로 설정하여
                // 필요 시 세션 생성 허용 (어드민 로그인용 세션)
                // JWT API 요청 시 stateless로 별도 필터에서 처리 권장
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            // CSRF 설정
            .csrf(csrf -> csrf
                // 회원가입, 로그인 등 인증 없이 쓰는 API는 CSRF 무시
                .ignoringAntMatchers("/api/**","/auth/**","/user/me")
                .csrfTokenRepository(org.springframework.security.web.csrf.CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            // 권한 및 접근 제어
            .authorizeRequests(authz -> authz
                //.antMatchers("/admin/**").hasRole("ADMIN")  // 관리자 경로는 ADMIN 권한만
                .antMatchers("/api/pay/kakao/**").permitAll()// ✅ 카카오페이 연동용 예외 허용
                .antMatchers("/api/items").permitAll() // 아이템도 예외
                .antMatchers("/api/**").authenticated()    // API는 인증된 사용자만
                .antMatchers("/user/**").authenticated()    // 마이페이지 등 인증 필요
                .antMatchers("/auth/**").permitAll()        // 회원가입, 로그인 등 인증 없이 허용
                .anyRequest().permitAll()                    // 나머지 요청 허용
            )
            // formLogin() 제거 (JWT 인증은 API 기반, 로그인폼 필요시 별도 설정)
            // .formLogin(...) 

            // 로그아웃 설정 제거 (JWT는 세션 로그아웃 아님, 별도 API에서 처리)

            // 예외 처리 - 인증 실패 시 401 Unauthorized 응답하도록 처리
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                })
            )
            // 보안 헤더 강화
            .headers(headers -> {
                headers.contentSecurityPolicy("default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';");
                headers.httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000));
                headers.referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER));
                headers.xssProtection(xss -> xss.block(true));
                headers.frameOptions(frame -> frame.deny());
                headers.cacheControl();
                headers.contentTypeOptions();
            })
            .cors(Customizer.withDefaults())
            
            // JWT 인증 필터는 UsernamePasswordAuthenticationFilter 앞에 배치
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)

            // =======================
            // 10대 공격 차단 및 봇 차단 필터 추가
            // =======================
            // - 봇 차단 필터 추가 (구글봇 제외)
            //   : User-Agent 검사하여 주요 봇 및 크롤러 차단, 구글봇은 whitelist 처리
            .addFilterBefore(new BotDetectionFilter(), JwtAuthenticationFilter.class)

            // - 기타 HTTP 헤더 기반 공격 차단 및 요청 패턴 필터 추가 가능
            //   : 예) RateLimitingFilter, SQLInjectionFilter 등 추가 가능
        ;

        return http.build();
    }

    /**
     * SameSite=None 명시적 쿠키 설정 (Spring Boot 2.7.x는 명시 필요)
     */
    @Configuration
    public class CookieConfig {

        @Bean
        public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
            // 모든 쿠키에 SameSite=None 설정 (Spring Boot 2.7 호환)
            return CookieSameSiteSupplier.ofNone();
        }
    }

    /**
     * 봇 및 크롤러 차단 필터 (구글봇 예외)
     * User-Agent 헤더를 검사하여 주요 봇을 차단하고,
     * 구글봇은 whitelist로 예외 처리함.
     */
    public static class BotDetectionFilter extends OncePerRequestFilter {

        // 차단할 봇/크롤러 User-Agent 키워드 목록 (대소문자 구분 없음)
        private static final List<String> BLOCKED_BOTS = Arrays.asList(
            "BingBot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot",
            "Sogou", "Exabot", "facebot", "ia_archiver", "AhrefsBot",
            "MJ12bot", "SemrushBot", "DotBot", "SeznamBot", "Screaming Frog"
        );

        // 허용할 봇 (구글봇)
        private static final String ALLOWED_GOOGLEBOT = "Googlebot";

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {

            String userAgent = request.getHeader("User-Agent");
            if (userAgent != null) {
                String uaLower = userAgent.toLowerCase();

                // 구글봇 예외 처리 (허용)
                if (userAgent.contains(ALLOWED_GOOGLEBOT)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                // 주요 차단 봇이 포함되면 403 Forbidden 처리
                for (String bot : BLOCKED_BOTS) {
                    if (uaLower.contains(bot.toLowerCase())) {
                        response.sendError(HttpServletResponse.SC_FORBIDDEN,
                                "Access Denied: Bot/Crawler blocked");
                        return;
                    }   
                }
            }

            // 봇이 아니거나 User-Agent 헤더가 없으면 정상 진행
            filterChain.doFilter(request, response);
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowCredentials(true);  // 반드시 true! (쿠키 인증 필수)
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // 아래 두 줄 있으면 더 안전함 (OPTION preflight 캐시)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}




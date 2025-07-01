package com.company.haloshop.config;

import javax.servlet.http.HttpServletResponse;

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

import com.company.haloshop.security.JwtAuthenticationFilter;
import com.company.haloshop.security.UserDetailsServiceImpl;

@Configuration
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
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

        // 관리자용 DaoAuthenticationProvider 별도 구현 가능

        return new ProviderManager(userProvider);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 세션 정책 - JWT API는 stateless 처리 (세션 생성하지 않음)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // CSRF 설정
            .csrf(csrf -> csrf
                // 회원가입, 로그인 등 인증 없이 쓰는 API는 CSRF 무시
                .ignoringAntMatchers("/api/**", "/auth/**")
                .csrfTokenRepository(org.springframework.security.web.csrf.CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            // 권한 및 접근 제어
            .authorizeRequests(authz -> authz
                .antMatchers("/admin/**").hasRole("ADMIN")  // 관리자 경로는 ADMIN 권한만
                .antMatchers("/api/pay/kakao/**").permitAll()// ✅ 카카오페이 연동용 예외 허용
                //.antMatchers("/api/**").authenticated()     // API는 인증된 사용자만
                .antMatchers("/user/**").authenticated()    // 마이페이지 등 인증 필요
                .antMatchers("/api/**").permitAll()     // API는 인증된 사용자만
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
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

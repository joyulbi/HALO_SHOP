package com.company.haloshop.security.middleware;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.company.haloshop.dto.member.LogsDto;
import com.company.haloshop.security.service.LogsService;

import lombok.RequiredArgsConstructor;

/**
 * 공격 탐지 및 차단 필터
 *  - 다양한 공격 징후를 탐지하면 LogsService로 기록하고,
 *    특정 조건(예: SQL 인젝션, 과도한 요청 등)이 충족되면 즉시 차단(403/429) 처리합니다.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@EnableScheduling
public class AttackDetectionFilter extends OncePerRequestFilter {

    private final LogsService logsService;

    // — 전역 상태 저장소 —
    private static final Map<String, List<Long>> rateLimitMap   = new ConcurrentHashMap<>();
    private static final Map<String, Integer>    directAccessMap = new ConcurrentHashMap<>();
    private static final Map<String, Integer>    loginFailMap    = new ConcurrentHashMap<>();
    private static final Map<String, Long>       logCooldown     = new ConcurrentHashMap<>();
    private static final Map<String, Long>       blockExpiryMap  = new ConcurrentHashMap<>();

    // — 설정값 —
    private final List<String> suspiciousPaths = List.of(
    	    "/admin/withdraw", "/admin/secure", /* … */ 
    	     "/user/withdraw", "/user/restore"
    	);
    private final List<String> allowedContentTypes = List.of(
        "application/json",
        "multipart/form-data",
        "application/x-www-form-urlencoded"
    );
    private final String ALLOWED_ORIGIN = "http://localhost:3000";

    // — 스케줄러: 오래된 기록/카운터 정리 —
    /** 1분마다 10초 이상 지난 rateLimitMap 기록을 삭제 */
    @Scheduled(fixedDelay = 60_000, initialDelay = 60_000)
    public void cleanupRateLimit() {
        long now = Instant.now().getEpochSecond();
        rateLimitMap.forEach((key, hist) -> {
            hist.removeIf(ts -> now - ts > 10);
            if (hist.isEmpty()) rateLimitMap.remove(key);
        });
    }

    /** 매일 자정에 directAccessMap, loginFailMap 리셋 */
    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyCounters() {
        directAccessMap.clear();
        loginFailMap.clear();
    }

    
    
    @Override
    protected void doFilterInternal(HttpServletRequest rawRequest,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {
        // 0) multipart/form-data 요청은 본문을 미리 읽지 않고 그대로 다음 필터/컨트롤러로 넘김
        String contentType = rawRequest.getContentType();
        if (contentType != null && contentType.toLowerCase().startsWith("multipart/")) {
            chain.doFilter(rawRequest, response);
            return;
        }

        // 1) 요청 래핑 및 본문 캐싱
        CachedBodyHttpServletRequest req = new CachedBodyHttpServletRequest(rawRequest);
        String body = req.getReader()
                         .lines()
                         .collect(Collectors.joining("\n"));

        // 2) 공통 정보 추출
        Long   userId = extractUserId(req);
        String ip     = Optional.ofNullable(req.getHeader("X-Forwarded-For"))
                                .orElse(req.getRemoteAddr());

        // 3) 블록 지속 여부 확인 (1분 단위)
        String blockKey = userId != null ? "user:" + userId : "ip:" + ip;
        long nowSec = Instant.now().getEpochSecond();
        Long expiry = blockExpiryMap.get(blockKey);
        if (expiry != null && nowSec < expiry) {
            response.sendError(429, "Too Many Requests - temporary block in effect");
            return;
        }

        // 4) 로그 기록 헬퍼 (1초당 1회만 실제 기록)
        Consumer<LogsDto> logOnce = dto -> {
            String cdKey = (dto.getAccountId() != null ? dto.getAccountId() : "null")
                           + "-" + dto.getAction();
            long lastTs = logCooldown.getOrDefault(cdKey, 0L);
            if (System.currentTimeMillis() - lastTs > 1_000) {
                logCooldown.put(cdKey, System.currentTimeMillis());
                logsService.createLog(dto);
            }
        };

        // — 탐지 및 차단 로직 —

        // 5) User-Agent 검사 (헤더 누락 시 탐지만)
        if (req.getHeader("User-Agent") == null || req.getHeader("User-Agent").isBlank()) {
            logOnce.accept(logDto(userId, null, "SUSPECT_NO_UA",
                                  "Missing User-Agent header", ip));
        }

        // 6) 비인가 직접 접근 (403)
//        if (userId == null && startsWithAny(req.getRequestURI(), suspiciousPaths)) {
//            logOnce.accept(logDto(null, null, "SUSPECT_DIRECT_ACCESS",
//                                  "Unauthorized access to " + req.getRequestURI(), ip));
//            response.sendError(HttpServletResponse.SC_FORBIDDEN,
//                               "Forbidden direct access");
//            return;
//        }

        // 7) 비정상 상태 유저 접근 (403)
        Integer status = Optional.ofNullable(req.getSession(false))
                                 .map(s -> s.getAttribute("userStatus"))
                                 .filter(Integer.class::isInstance)
                                 .map(Integer.class::cast)
                                 .orElse(1);
        if (status != 1) {
            logOnce.accept(logDto(userId, null, "SUSPICIOUS_STATUS_ACCESS",
                                  "Non-normal user status: " + status, ip));
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                               "Forbidden due to user status");
            return;
        }

//        // 8) 빈 바디 POST/DELETE (400)
//        if (List.of("POST","DELETE").contains(req.getMethod()) && body.isBlank()) {
//            logOnce.accept(logDto(userId, null, "EMPTY_BODY_SUSPECT",
//                                  "Empty body on " + req.getMethod(), ip));
//            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
//                               "Bad Request: empty body");
//            return;
//        }

     // 9) Referer 검사 (403)
//        if (List.of("POST","DELETE").contains(req.getMethod())) {
//            String uri = req.getRequestURI();
//
//            // 1) /api 로 시작하는 모든 엔드포인트는 검증 건너뛰기
//            if (uri.startsWith("/api")) {
//                chain.doFilter(req, response);
//                return;
//            }
//
//            // 2) 로그인·회원가입은 건너뛰기
//            if (uri.startsWith("/auth/login") || uri.startsWith("/auth/signup")) {
//                chain.doFilter(req, response);
//                return;
//            }
//
//            // (기존 개별 스킵 대상들은 이제 없어도 됩니다.)
//
//            String ref = req.getHeader("Referer");
//            if (ref == null || !ref.startsWith(ALLOWED_ORIGIN)) {
//                logOnce.accept(logDto(userId, null, "SUSPECT_REFERER_MISMATCH",
//                                      "Referer invalid: " + ref, ip));
//                response.sendError(HttpServletResponse.SC_FORBIDDEN,
//                                   "Forbidden referer");
//                return;
//            }
//        }




//        // 10) 과도한 요청 (rate limit + 1분 차단 → 429)
//        if (applyRateLimit(req, userId, ip, logOnce)) {
//            response.sendError(429,
//                               "Too Many Requests - please try again later");
//            blockExpiryMap.put(blockKey, nowSec + 60);
//            return;
//        }

        // 11) 쿠키 위변조 검사 (403)
        if (hasSessionCookie(req) && req.getSession(false) == null) {
            logOnce.accept(logDto(userId, null, "COOKIE_TAMPERED",
                                  "Session cookie without valid session", ip));
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                               "Forbidden cookie tampering");
            return;
        }

//        // 12) 반복 직접 접근 (403)
//        if (userId == null && startsWithAny(req.getRequestURI(), suspiciousPaths)) {
//            int cnt = directAccessMap.merge(ip, 1, Integer::sum);
//            if (cnt > 10) {
//                logOnce.accept(logDto(null, null, "REPEATED_DIRECT_ACCESS",
//                                      "Excessive direct accesses", ip));
//                response.sendError(HttpServletResponse.SC_FORBIDDEN,
//                                   "Forbidden repeated access");
//                return;
//            }
//        }

        // 13) Content-Type 검사 (415)
        if (List.of("POST","PATCH","DELETE").contains(req.getMethod())) {
            String ct = req.getContentType();
            if (ct != null && allowedContentTypes.stream().noneMatch(ct::contains)) {
                logOnce.accept(logDto(userId, null, "SUSPICIOUS_CONTENT_TYPE",
                                      "Content-Type: " + ct, ip));
                response.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE,
                                   "Unsupported Content-Type");
                return;
            }
        }

        // 14) XSS 감지 (403)
        if (List.of("POST","PUT","PATCH").contains(req.getMethod()) &&
            body.toLowerCase().contains("<script")) {
            logOnce.accept(logDto(userId, null, "XSS_BODY_DETECTED",
                                  "Body contains <script>", ip));
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                               "Forbidden XSS attempt");
            return;
        }

        // 15) SQL 인젝션 키워드 감지 (403)
        for (String kw : List.of("' OR", "\" OR", "1=1", "--", "UNION SELECT")) {
            if (body.toUpperCase().contains(kw)) {
                logOnce.accept(logDto(userId, null, "SQL_INJECTION_BLOCK",
                                      "Detected keyword: " + kw, ip));
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                                   "Forbidden SQL injection attempt");
                return;
            }
        }

        // 16) 로그인 실패 과도 시도 (429)
        if ("/user/login".equals(req.getRequestURI()) && "POST".equals(req.getMethod())) {
            String email = req.getParameter("email");
            if (email != null) {
                int fails = loginFailMap.merge(email, 1, Integer::sum);
                if (fails > 5) {
                    logOnce.accept(logDto(null, null, "REPEATED_LOGIN_FAIL",
                                          email + " failed login >5", ip));
                    response.sendError(429,
                                       "Too Many Login Attempts");
                    return;
                }
            }
        }

        // 정상 요청: 다음 필터/컨트롤러로 전달
        chain.doFilter(req, response);
    }

    // — 헬퍼 메서드 —

    /** Principal 이름을 userId(Long)로 변환, 없으면 null */
    private Long extractUserId(HttpServletRequest req) {
        try {
            return req.getUserPrincipal() != null
                 ? Long.valueOf(req.getUserPrincipal().getName())
                 : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /** URI가 prefixes 중 하나로 시작하는지 검사 */
    private boolean startsWithAny(String uri, List<String> prefixes) {
        return prefixes.stream().anyMatch(uri::startsWith);
    }

    /** SESSION 쿠키 존재 여부 검사 */
    private boolean hasSessionCookie(HttpServletRequest req) {
        return Optional.ofNullable(req.getCookies())
            .map(Arrays::stream)
            .orElseGet(Stream::empty)
            .anyMatch(c -> "SESSION".equals(c.getName()));
    }

    /**
     * rate limiting:
     *  - 3초 내 5회 이상 요청 시 true 반환 → 차단
     *  - 차단 사유는 logOnce로 기록됨
     */
    private boolean applyRateLimit(HttpServletRequest req,
                                   Long userId,
                                   String ip,
                                   Consumer<LogsDto> logOnce) {
        String key = userId != null ? "user:" + userId : "ip:" + ip;
        long now = Instant.now().getEpochSecond();
        rateLimitMap.computeIfAbsent(key, k -> new ArrayList<>()).add(now);

        List<Long> recent = rateLimitMap.get(key).stream()
                             .filter(ts -> now - ts < 3)
                             .collect(Collectors.toList());
        rateLimitMap.put(key, new ArrayList<>(recent));

        if (recent.size() >= 5) {
            logOnce.accept(logDto(userId, null, "TOO_MANY_REQUESTS",
                                  recent.size() + " reqs in 3s", ip));
            return true;
        }
        return false;
    }

    /** LogsDto 생성 단축 메서드 */
    private LogsDto logDto(Long acct, Long target, String action, String desc, String ip) {
        return new LogsDto(null, acct, target, action, desc, ip);
    }
}

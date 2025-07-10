package com.company.haloshop.security;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * 만료된 세션을 감지하고, - AJAX 요청일 경우 401 에러 반환 - 일반 브라우저 요청일 경우 세션 쿠키 삭제 후 로그인 페이지로
 * 리다이렉트
 */
@Component
public class ExpiredSessionFilter extends OncePerRequestFilter {

	private final SessionRegistry sessionRegistry;

	public ExpiredSessionFilter(SessionRegistry sessionRegistry) {
		this.sessionRegistry = sessionRegistry;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// 기존 세션이 있는 경우
		if (request.getSession(false) != null) {
			String sessionId = request.getSession(false).getId();
			SessionInformation info = sessionRegistry.getSessionInformation(sessionId);
			if (info != null && info.isExpired()) {

				// AJAX 요청 판단 (JSON 응답 기대)
				String accept = request.getHeader("Accept");
				if (accept != null && accept.contains("application/json")) {
					// 401 Unauthorized 반환
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
					return;
				}

				// 1) 세션 쿠키 제거
				Cookie cookie = new Cookie("JSESSIONID", "");
				cookie.setPath(request.getContextPath() + "/");
				cookie.setMaxAge(0);
				response.addCookie(cookie);

				// 2) 서버 세션 무효화
				request.getSession().invalidate();

				// 3) 로그인 페이지로 리다이렉트
				response.sendRedirect(request.getContextPath() + "/login");
				return;
			}
		}

		filterChain.doFilter(request, response);
	}
}

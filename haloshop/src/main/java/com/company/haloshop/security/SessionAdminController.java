package com.company.haloshop.security;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class SessionAdminController {

    private final SessionRegistry sessionRegistry;

    public SessionAdminController(SessionRegistry sessionRegistry) {
        this.sessionRegistry = sessionRegistry;
    }

    /**
     * 활성 세션 목록 조회 (REST)
     */
    @GetMapping("/active-sessions")
    public Set<Long> getActiveSessions() {
        return sessionRegistry.getAllPrincipals().stream()
            .filter(p -> p instanceof CustomUserDetails)
            .map(p -> ((CustomUserDetails) p).getId())
            .collect(Collectors.toSet());
    }

    /**
     * 특정 계정의 모든 세션 강제 만료
     */
    @PostMapping("/session/force-logout")
    public void forceLogout(@RequestParam("accountId") Long accountId) {
        sessionRegistry.getAllPrincipals().stream()
            .filter(p -> p instanceof CustomUserDetails
                       && ((CustomUserDetails)p).getId().equals(accountId))
            .forEach(principal ->
                sessionRegistry.getAllSessions(principal, false).forEach(SessionInformation::expireNow)
            );
    }
}

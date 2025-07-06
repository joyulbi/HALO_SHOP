package com.company.haloshop.security;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.member.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * 관리자 권한 검증 컴포넌트
 * - account.isAdmin 플래그 체크
 * - admin 테이블의 roleId(단일값) 체크 지원
 */
@Component("adminCheck")
public class AdminCheck {

    private final AdminMapper adminMapper;

    @Autowired
    public AdminCheck(AdminMapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    /**
     * Authentication 에서 AccountDto를 꺼내오는 헬퍼
     */
    private AccountDto getAccount(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        Object p = auth.getPrincipal();
        if (p instanceof CustomUserDetails) {
            return ((CustomUserDetails) p).getAccountDto();
        }
        return null;
    }

    /**
     * isAdmin 플래그만 보고 모든 관리자 여부 체크
     */
    public boolean hasAuthority(Authentication authentication) {
        AccountDto acct = getAccount(authentication);
        return acct != null && Boolean.TRUE.equals(acct.getIsAdmin());
    }

    /**
     * 정확히 지정된 roleId(단일값)만 허용
     */
    public boolean hasAuthorityExact(Authentication authentication, int allowedRole) {
        AccountDto acct = getAccount(authentication);
        if (acct == null || !acct.getIsAdmin()) return false;
        AdminDto admin = adminMapper.selectByAccountId(acct.getId());
        return admin != null && admin.getRole() == allowedRole;
    }

    /**
     * Role enum의 matches() 메서드로 체크
     */
    public boolean hasRoleEnum(Authentication authentication, Role targetRole) {
        AccountDto acct = getAccount(authentication);
        if (acct == null || !acct.getIsAdmin()) return false;
        AdminDto admin = adminMapper.selectByAccountId(acct.getId());
        return admin != null && targetRole.matches(admin.getRole());
    }

    /**
     * 마스터관리자는 Role.MASTER_ADMIN와 일치하는지 확인
     */
    public boolean isMasterAdmin(Authentication authentication) {
        return hasRoleEnum(authentication, Role.MASTER_ADMIN);
    }
}

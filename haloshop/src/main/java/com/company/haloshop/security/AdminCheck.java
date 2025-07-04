package com.company.haloshop.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.AdminDto;
import com.company.haloshop.member.mapper.AdminMapper;
import com.company.haloshop.security.Role;

/**
 * 관리자 권한 검증 컴포넌트
 * - is_admin(=true) 여부
 * - admin 테이블 role 값(범위) 체크까지 지원
 * 
 * SecurityConfig에서 SpEL로 사용 가능: @adminCheck.메서드명(authentication, ...)
 */
@Component("adminCheck")
public class AdminCheck {

    /**
     * is_admin이 true인지 체크 (role 무관, 모든 관리자)
     */
    public boolean hasAuthority(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return false;
        Object principal = authentication.getPrincipal();
        if (principal instanceof AccountDto) {
            AccountDto account = (AccountDto) principal;
            // isAdmin이 true인 경우만 관리자 권한이 있음
            System.out.println("Is Admin: " + account.getIsAdmin());
            return Boolean.TRUE.equals(account.getIsAdmin());
        }
        return false;
    }

    /**
     * 특정 role(단일값)만 허용 (예: 0 == 마스터관리자만)
     */
    public boolean hasAuthorityExact(Authentication authentication, int allowedRole) {
        // 이 메서드는 현재 필요 없다면 삭제
        return false; // 여기는 삭제해도 될 것 같습니다
    }

    /**
     * role 구간(범위) 허용 (예: 501~599 == 유저관리자, 200~299 == 상품관리자)
     * 이 메서드도 현재 필요 없다면 삭제
     */
    public boolean hasAuthorityRange(Authentication authentication, int startRole, int endRole) {
        return false; // 필요 없다면 삭제 가능
    }

    /**
     * Role Enum 활용: 지정 Enum 권한에 포함되는지 (권장)
     * 이 메서드도 현재 필요 없다면 삭제
     */
    public boolean hasRoleEnum(Authentication authentication, Role targetRole) {
        return false; // 필요 없다면 삭제 가능
    }

    /**
     * 마스터관리자인지 (role=0~99 범위)
     * 이 메서드는 필요하지 않다면 삭제
     */
    public boolean isMasterAdmin(Authentication authentication) {
        return false; // 필요 없다면 삭제 가능
    }
}

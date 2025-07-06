package com.company.haloshop.security;

/**
 * 관리자 역할(Role) 정의 enum
 * - 각 역할을 고유한 단일 ID(roleId)로 관리
 * - 필요한 경우 matches(), fromId()로 조회 가능
 */
public enum Role {

    // 최상위 관리자 (모든 권한 포함)
    MASTER_ADMIN            (   0, "마스터 관리자"),

    // 상품 관리
    PRODUCT_MANAGER         ( 200, "상품 관리자"),
    STOCK_MANAGER           ( 201, "상품 재고 관리자"),

    // 회원 및 주문 관리
    MEMBERSHIP_MANAGER      ( 300, "멤버십 관리자"),
    ORDER_MANAGER           ( 301, "주문 관리자"),
    POINT_MANAGER           ( 302, "포인트 관리자"),

    // 리뷰 및 배송 관리
    REVIEW_MANAGER          ( 400, "리뷰 관리자"),
    DELIVERY_MANAGER        ( 401, "배송 관리자"),

    // 기타 관리자
    SECURITY_ADMIN          ( 500, "보안 관리자"),
    USER_ADMIN              ( 501, "유저 관리자"),
    INQUIRY_MANAGER         ( 502, "문의 관리자"),
    TEAM_SETTING_MANAGER    ( 503, "야구팀 설정 관리자"),
    SEASON_SETTING_MANAGER  ( 504, "시즌 설정 관리자"),
    DONATION_CAMPAIGN_MANAGER(505, "기부 캠페인 관리자"),

    // 일반 유저
    GENERAL_USER            (1000, "일반 사용자");

    /** 역할 고유 ID */
    private final int roleId;
    /** 역할 설명 */
    private final String description;

    Role(int roleId, String description) {
        this.roleId     = roleId;
        this.description = description;
    }

    /**
     * 이 역할의 고유 ID 반환
     */
    public int getRoleId() {
        return roleId;
    }

    /**
     * 이 역할의 설명 반환
     */
    public String getDescription() {
        return description;
    }

    /**
     * 주어진 roleId와 일치하는지 확인
     */
    public boolean matches(int roleId) {
        return this.roleId == roleId;
    }

    /**
     * roleId에 해당하는 Role enum 반환
     */
    public static Role fromId(int roleId) {
        for (Role r : Role.values()) {
            if (r.matches(roleId)) {
                return r;
            }
        }
        return null;
    }
}

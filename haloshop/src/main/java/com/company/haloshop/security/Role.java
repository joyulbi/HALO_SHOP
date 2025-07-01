package com.company.haloshop.security;

public enum Role {
    // 최상위 관리자 (시스템 관리자를 포함한 모든 권한)
    MASTER_ADMIN(0, 99, "마스터 관리자"), // 마스터관리자 == 시스템관리자 

    // 상품 관리 카테고리 (200번대)
    PRODUCT_MANAGER(200, 299, "상품 관리자"),
    STOCK_MANAGER(201, 299, "상품 재고 관리자"),

    // 회원 및 주문 관리 카테고리 (300번대)
    MEMBERSHIP_MANAGER(300, 399, "멤버십 관리자"),
    ORDER_MANAGER(301, 399, "주문 관리자"),
    POINT_MANAGER(302, 399, "포인트 관리자"),

    // 리뷰 및 배송 관리 카테고리 (400번대)
    REVIEW_MANAGER(400, 499, "리뷰 관리자"),
    DELIVERY_MANAGER(401, 499, "배달 관리자"),

    // 기타 관리자 카테고리 (500번대)
    SECURITY_ADMIN(500, 599, "보안 관리자"),
    USER_ADMIN(501, 599, "유저 관리자"),
    INQUIRY_MANAGER(502, 599, "문의 관리자"),
    TEAM_SETTING_MANAGER(503, 599, "야구팀 설정 관리자"),
    SEASON_SETTING_MANAGER(504, 599, "시즌 설정 관리자"),
    DONATION_CAMPAIGN_MANAGER(505, 599, "캠페인 관리자"),

    // 일반 사용자 (모든 관리자 번호대와 겹치지 않는 별도 범위)
    GENERAL_USER(1000, 19999, "일반 사용자");

    private final int startId;
    private final int endId;
    private final String description;

    Role(int startId, int endId, String description) {
        this.startId = startId;
        this.endId = endId;
        this.description = description;
    }

    public int getStartId() {
        return startId;
    }

    public int getEndId() {
        return endId;
    }

    public String getDescription() {
        return description;
    }

    public boolean contains(int roleId) {
        return roleId >= this.startId && roleId <= this.endId;
    }

    public static Role fromId(int roleId) {
        for (Role role : Role.values()) {
            if (role.contains(roleId)) {
                return role;
            }
        }
        return null;
    }
}

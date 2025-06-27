package com.company.haloshop.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DonationCampaign {
    private Long id;
    private String image;
    private Long total;

    // FK 컬럼 id 직접 저장 (필수)
    private Long seasonId;
    private Long teamId;

    // 연관 객체가 필요하면 포함 (조회 시 매퍼에서 직접 조인하여 매핑)
    private Season season;
    private Team team;
}


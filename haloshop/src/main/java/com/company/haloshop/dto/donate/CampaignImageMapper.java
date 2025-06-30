package com.company.haloshop.dto.donate;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.donate.CampaignImage;

@Mapper
public interface CampaignImageMapper {

    // 생성
    int insertCampaignImage(CampaignImage campaignImage);

    // 조회 (PK = seasonId)
    CampaignImage selectCampaignImageBySeasonId(Long seasonId);

    // 수정
    int updateCampaignImage(CampaignImage campaignImage);

    // 삭제 (PK = seasonId)
    int deleteCampaignImageBySeasonId(Long seasonId);

}

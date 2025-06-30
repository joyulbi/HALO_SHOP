package com.company.haloshop.campaignimage;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CampaignImageMapper {

    // 캠페인 이미지 등록
    int insertCampaignImage(CampaignImage campaignImage);

    // 시즌 ID로 캠페인 이미지 조회
    CampaignImage selectCampaignImageBySeasonId(@Param("seasonId") Long seasonId);

    // 캠페인 이미지 수정 (입력값만)
    int updateCampaignImage(CampaignImage campaignImage);

    // 캠페인 이미지 삭제
    int deleteCampaignImageBySeasonId(@Param("seasonId") Long seasonId);
}

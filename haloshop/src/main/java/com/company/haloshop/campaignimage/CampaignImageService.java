package com.company.haloshop.campaignimage;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampaignImageService {

    private final CampaignImageMapper campaignImageMapper;

    // ✅ 캠페인 이미지 등록
    @Transactional
    public void createCampaignImage(CampaignImageRequestDto dto) {
        CampaignImage campaignImage = CampaignImage.builder()
                .seasonId(dto.getSeasonId())
                .level_1(dto.getLevel_1())
                .level_2(dto.getLevel_2())
                .level_3(dto.getLevel_3())
                .build();

        campaignImageMapper.insertCampaignImage(campaignImage);
    }

    // ✅ 캠페인 이미지 단건 조회
    @Transactional(readOnly = true)
    public CampaignImageDto getCampaignImage(Long seasonId) {
        CampaignImage campaignImage = campaignImageMapper.selectCampaignImageBySeasonId(seasonId);
        if (campaignImage == null) return null;

        return CampaignImageDto.builder()
                .seasonId(campaignImage.getSeasonId())
                .level_1(campaignImage.getLevel_1())
                .level_2(campaignImage.getLevel_2())
                .level_3(campaignImage.getLevel_3())
                .build();
    }
    
    // 전체 캠페인 이미지 조회
    public List<CampaignImage> getAllCampaignImages() {
        return campaignImageMapper.selectAllCampaignImages();
    }

    // ✅ 캠페인 이미지 수정 (입력된 필드만)
    @Transactional
    public void updateCampaignImage(CampaignImageRequestDto dto) {
    	
    	if (dto.getLevel_1() == null && dto.getLevel_2() == null && dto.getLevel_3() == null) {
    	    throw new IllegalArgumentException("수정할 필드가 없습니다.");
    	}
    	
        CampaignImage campaignImage = CampaignImage.builder()
                .seasonId(dto.getSeasonId())
                .level_1(dto.getLevel_1())
                .level_2(dto.getLevel_2())
                .level_3(dto.getLevel_3())
                .build();

        campaignImageMapper.updateCampaignImage(campaignImage);
    }

    // ✅ 캠페인 이미지 삭제
    @Transactional
    public void deleteCampaignImage(Long seasonId) {
        campaignImageMapper.deleteCampaignImageBySeasonId(seasonId);
    }
}

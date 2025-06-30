package com.company.haloshop.dto.donate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.donate.CampaignImage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampaignImageService {

    private final CampaignImageMapper campaignImageMapper;

    @Transactional
    public int createCampaignImage(CampaignImage campaignImage) {
        return campaignImageMapper.insertCampaignImage(campaignImage);
    }

    @Transactional(readOnly = true)
    public CampaignImage getCampaignImage(Long seasonId) {
        return campaignImageMapper.selectCampaignImageBySeasonId(seasonId);
    }

    @Transactional
    public int updateCampaignImage(CampaignImage campaignImage) {
        return campaignImageMapper.updateCampaignImage(campaignImage);
    }

    @Transactional
    public int deleteCampaignImage(Long seasonId) {
        return campaignImageMapper.deleteCampaignImageBySeasonId(seasonId);
    }
}

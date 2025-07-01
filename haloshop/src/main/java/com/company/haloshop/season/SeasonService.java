package com.company.haloshop.season;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.campaignimage.CampaignImageMapper;
import com.company.haloshop.donationcampaign.DonationCampaignMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonMapper seasonMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final DonationCampaignMapper donationCampaignMapper; // ✅ 이게 있어야 함
    private final CampaignImageMapper campaignImageMapper; 

    @Transactional
    public int insertSeason(Season season) {
        int result = seasonMapper.insertSeason(season);
        if (result == 1) {
            eventPublisher.publishEvent(new SeasonCreateEvent(season));
        }
        return result;
    }

    public List<Season> findAllSeason() {
        return seasonMapper.findAllSeason();
    }

    public Season findById(Long id) {
        return seasonMapper.findById(id);
    }

    @Transactional
    public int updateSeason(Season season) {
        return seasonMapper.updateSeason(season);
    }

    @Transactional
    public int deleteSeason(Long id) {
        donationCampaignMapper.deleteDonationCampaign(id);
        campaignImageMapper.deleteCampaignImageBySeasonId(id);
        return seasonMapper.deleteSeason(id);
    }
    
}

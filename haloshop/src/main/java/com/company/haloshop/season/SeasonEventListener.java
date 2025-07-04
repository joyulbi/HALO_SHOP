package com.company.haloshop.season;

import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.campaignimage.CampaignImage;
import com.company.haloshop.campaignimage.CampaignImageMapper;
import com.company.haloshop.donationcampaign.DonationCampaign;
import com.company.haloshop.donationcampaign.DonationCampaignMapper;
import com.company.haloshop.team.Team;
import com.company.haloshop.team.TeamMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SeasonEventListener {

    private final TeamMapper teamMapper;
    private final DonationCampaignMapper donationCampaignMapper;
    private final CampaignImageMapper campaignImageMapper;

    @EventListener
    @Transactional
    public void handleSeasonCreated(SeasonCreateEvent event) {
        Season season = event.getSeason();
        List<Team> teams = teamMapper.findAllTeam();

        // DonationCampaign 자동 생성
        for (Team team : teams) {
        	// 활성화 상태인 경우에만 생성
            if (Boolean.TRUE.equals(team.getActive())) {
                DonationCampaign campaign = DonationCampaign.builder()
                    .season(season)
                    .team(team)
                    .total(0L)
                    .build();

                donationCampaignMapper.insertDonationCampaign(campaign);
            }
        }

        // CampaignImage 자동 생성
        CampaignImage image = CampaignImage.builder()
            .seasonId(season.getId())
            .build();

        campaignImageMapper.insertCampaignImage(image);
    }

    @EventListener
    @Transactional
    public void handleSeasonDeleted(SeasonDeleteEvent event) {
        Long seasonId = event.getSeasonId();

        donationCampaignMapper.deleteDonationCampaign(seasonId);
        campaignImageMapper.deleteCampaignImageBySeasonId(seasonId);
    }
}

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
            DonationCampaign campaign = DonationCampaign.builder()
                .season(season)
                .team(team)
                .total(0L)
                .build();

            donationCampaignMapper.insertDonationCampaign(campaign);
        }

        // CampaignImage 자동 생성
        CampaignImage image = CampaignImage.builder()
            .seasonId(season.getId())
            .level_1("http://via.placeholder.com/100x100")
            .level_2("http://via.placeholder.com/200x200")
            .level_3("http://via.placeholder.com/300x300")
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

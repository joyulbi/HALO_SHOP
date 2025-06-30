package com.company.haloshop.donationcampaign;

import com.company.haloshop.season.SeasonDto;
import com.company.haloshop.team.TeamDto;

import lombok.Data;

@Data
public class DonationCampaignDto {

    private Long id;

    private String image;

    private Long total;

    private SeasonDto season;

    private TeamDto team;
}

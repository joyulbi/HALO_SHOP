package com.company.haloshop.donationcampaign;

import com.company.haloshop.season.Season;
import com.company.haloshop.season.SeasonMapper;
import com.company.haloshop.team.Team;
import com.company.haloshop.team.TeamMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DonationCampaignService {

    private final DonationCampaignMapper donationCampaignMapper;
    private final SeasonMapper seasonMapper;
    private final TeamMapper teamMapper;

    @Transactional
    public Long createDonationCampaign(DonationCampaignRequestDto requestDto) {
        Season season = Optional.ofNullable(seasonMapper.findById(requestDto.getSeasonId()))
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시즌 ID입니다."));
        Team team = Optional.ofNullable(teamMapper.findById(requestDto.getTeamId()))
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 팀 ID입니다."));

        DonationCampaign campaign = DonationCampaign.builder()
                .image(requestDto.getImage())
                .total(requestDto.getTotal())
                .season(season)
                .team(team)
                .build();

        donationCampaignMapper.insertDonationCampaign(campaign);
        return campaign.getId();
    }

    @Transactional(readOnly = true)
    public DonationCampaign getDonationCampaign(Long id) {
        return Optional.ofNullable(donationCampaignMapper.findById(id))
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 캠페인 ID입니다."));
    }

    @Transactional
    public void updateDonationCampaign(DonationCampaignRequestDto requestDto) {
        DonationCampaign existingCampaign = Optional.ofNullable(donationCampaignMapper.findById(requestDto.getId()))
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 캠페인 ID입니다."));

        // image 업데이트
        if (requestDto.getImage() != null) {
            existingCampaign.setImage(requestDto.getImage());
        }

        // total 업데이트 (0도 유효한 값이라면 null 체크만 하면 됨)
        if (requestDto.getTotal() != null) {
            existingCampaign.setTotal(requestDto.getTotal());
        }

        // season 업데이트
        if (requestDto.getSeasonId() != null) {
            Season season = Optional.ofNullable(seasonMapper.findById(requestDto.getSeasonId()))
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시즌 ID입니다."));
            existingCampaign.setSeason(season);
        }

        // team 업데이트
        if (requestDto.getTeamId() != null) {
            Team team = Optional.ofNullable(teamMapper.findById(requestDto.getTeamId()))
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 팀 ID입니다."));
            existingCampaign.setTeam(team);
        }

        donationCampaignMapper.updateDonationCampaign(existingCampaign);
    }

    @Transactional
    public void deleteDonationCampaign(Long id) {
        donationCampaignMapper.deleteDonationCampaign(id);
    }
}

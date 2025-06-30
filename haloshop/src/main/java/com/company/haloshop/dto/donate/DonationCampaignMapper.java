package com.company.haloshop.dto.donate;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.donate.DonationCampaign;

@Mapper
public interface DonationCampaignMapper {

    int insertDonationCampaign(DonationCampaign campaign);

    DonationCampaign findById(Long id);

    int updateDonationCampaign(DonationCampaign campaign);

    int deleteDonationCampaign(Long id);
}
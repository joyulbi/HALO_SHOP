package com.company.haloshop.donationcampaign;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DonationCampaignMapper {

    int insertDonationCampaign(DonationCampaign campaign);

    DonationCampaign findById(Long id);

    int updateDonationCampaign(DonationCampaign campaign);

    int deleteDonationCampaign(Long id);
}
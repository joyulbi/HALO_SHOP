package com.company.haloshop.donationcampaign;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DonationCampaignMapper {

    int insertDonationCampaign(DonationCampaign campaign);

    DonationCampaign findById(Long id);
    
    List<DonationCampaign> findAll();
    
    List<DonationCampaign> findBySeason(Long id);
    
    int updateDonationCampaign(DonationCampaign campaign);

    int deleteDonationCampaign(Long id);
    
    int deleteDonationCampaignBySeasonId(Long id);
}
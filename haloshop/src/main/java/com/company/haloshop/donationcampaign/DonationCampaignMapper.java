package com.company.haloshop.donationcampaign;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DonationCampaignMapper {

    int insertDonationCampaign(DonationCampaign campaign);

    DonationCampaign findById(Long id);
    
    List<DonationCampaign> findAll();
    
    List<DonationCampaign> findBySeason(Long id);
    
    int updateDonationCampaign(DonationCampaign campaign);

    int deleteDonationCampaign(Long id);
    
    int deleteDonationCampaignBySeasonId(Long id);
    
    List<Map<String, Object>> sumDonationAmountLastHour();
    int updateDonationCampaignTotal(@Param("campaignId") Long campaignId, @Param("total") Integer total);
    
    // total 최신화
    void incrementDonationTotal(@Param("campaignId") Long campaignId, @Param("amount") int amount);
}
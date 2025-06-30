package com.company.haloshop.dto.donate;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.company.haloshop.donate.DonationCampaign;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationCampaignService {

    private final DonationCampaignMapper donationCampaignMapper;

    public DonationCampaign findById(Long id) {
        return donationCampaignMapper.findById(id);
    }

    @Transactional
    public void create(DonationCampaign campaign) {
        donationCampaignMapper.insertDonationCampaign(campaign);
    }

    @Transactional
    public void update(DonationCampaign campaign) {
        int updated = donationCampaignMapper.updateDonationCampaign(campaign);
        if (updated == 0) {
            throw new IllegalArgumentException("Update failed, DonationCampaign not found id=" + campaign.getId());
        }
    }

    @Transactional
    public void delete(Long id) {
        int deleted = donationCampaignMapper.deleteDonationCampaign(id);
        if (deleted == 0) {
            throw new IllegalArgumentException("Delete failed, DonationCampaign not found id=" + id);
        }
    }
}
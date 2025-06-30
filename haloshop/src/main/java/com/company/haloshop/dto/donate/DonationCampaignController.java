package com.company.haloshop.dto.donate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.donate.DonationCampaign;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/donation-campaigns")
@RequiredArgsConstructor
public class DonationCampaignController {

    private final DonationCampaignService donationCampaignService;

    // 단일 캠페인 조회
    @GetMapping("/{id}")
    public ResponseEntity<DonationCampaign> getDonationCampaign(@PathVariable Long id) {
        DonationCampaign campaign = donationCampaignService.findById(id);
        if (campaign == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(campaign);
    }

    // 캠페인 생성
    @PostMapping
    public ResponseEntity<Void> createDonationCampaign(@RequestBody DonationCampaign campaign) {
        donationCampaignService.create(campaign);
        return ResponseEntity.ok().build();
    }

    // 캠페인 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateDonationCampaign(@PathVariable Long id, @RequestBody DonationCampaign campaign) {
        if (!id.equals(campaign.getId())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            donationCampaignService.update(campaign);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 캠페인 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonationCampaign(@PathVariable Long id) {
        try {
            donationCampaignService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
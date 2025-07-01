package com.company.haloshop.donationcampaign;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/donation-campaigns")
@RequiredArgsConstructor
public class DonationCampaignController {

    private final DonationCampaignService donationCampaignService;

    // 생성
    @PostMapping
    public ResponseEntity<Long> createDonationCampaign(@RequestBody DonationCampaignRequestDto requestDto) {
        Long id = donationCampaignService.createDonationCampaign(requestDto);
        return ResponseEntity.ok(id);
    }
    
    // 전체조회
    @GetMapping
    public ResponseEntity<List<DonationCampaign>> getAllDonationCampaigns() {
        List<DonationCampaign> campaigns = donationCampaignService.getAllDonationCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    // 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<DonationCampaign> getDonationCampaign(@PathVariable Long id) {
        DonationCampaign campaign = donationCampaignService.getDonationCampaign(id);
        return ResponseEntity.ok(campaign);
    }
    
    // 시즌으로 조회
    @GetMapping("/season/{id}")
    public ResponseEntity<List<DonationCampaign>> getAllDonationCampaignsBySeason(@PathVariable Long id) {
        List<DonationCampaign> campaigns = donationCampaignService.getAllDonationCampaignsBySeason(id);
        return ResponseEntity.ok(campaigns);
    }


    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateDonationCampaign(@PathVariable Long id,
                                                       @RequestBody DonationCampaignRequestDto requestDto) {
        requestDto.setId(id);
        donationCampaignService.updateDonationCampaign(requestDto);
        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonationCampaign(@PathVariable Long id) {
        donationCampaignService.deleteDonationCampaign(id);
        return ResponseEntity.noContent().build();
    }
}

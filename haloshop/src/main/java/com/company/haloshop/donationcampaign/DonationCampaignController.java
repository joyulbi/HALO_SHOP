package com.company.haloshop.donationcampaign;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // 단일 조회
    @GetMapping("/{id}")
    public ResponseEntity<DonationCampaign> getDonationCampaign(@PathVariable Long id) {
        DonationCampaign campaign = donationCampaignService.getDonationCampaign(id);
        return ResponseEntity.ok(campaign);
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

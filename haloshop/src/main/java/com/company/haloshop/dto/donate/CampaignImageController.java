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

import com.company.haloshop.donate.CampaignImage;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/campaign-images")
@RequiredArgsConstructor
public class CampaignImageController {

    private final CampaignImageService campaignImageService;

    // 생성
    @PostMapping
    public ResponseEntity<String> createCampaignImage(@RequestBody CampaignImage campaignImage) {
        int result = campaignImageService.createCampaignImage(campaignImage);
        if (result > 0) {
            return ResponseEntity.ok("CampaignImage created successfully.");
        }
        return ResponseEntity.badRequest().body("Failed to create CampaignImage.");
    }

    // 조회
    @GetMapping("/{seasonId}")
    public ResponseEntity<CampaignImage> getCampaignImage(@PathVariable Long seasonId) {
        CampaignImage campaignImage = campaignImageService.getCampaignImage(seasonId);
        if (campaignImage != null) {
            return ResponseEntity.ok(campaignImage);
        }
        return ResponseEntity.notFound().build();
    }

    // 수정
    @PutMapping("/{seasonId}")
    public ResponseEntity<String> updateCampaignImage(@PathVariable Long seasonId,
                                                      @RequestBody CampaignImage campaignImage) {
        campaignImage.setSeasonId(seasonId);
        int result = campaignImageService.updateCampaignImage(campaignImage);
        if (result > 0) {
            return ResponseEntity.ok("CampaignImage updated successfully.");
        }
        return ResponseEntity.badRequest().body("Failed to update CampaignImage.");
    }

    // 삭제
    @DeleteMapping("/{seasonId}")
    public ResponseEntity<String> deleteCampaignImage(@PathVariable Long seasonId) {
        int result = campaignImageService.deleteCampaignImage(seasonId);
        if (result > 0) {
            return ResponseEntity.ok("CampaignImage deleted successfully.");
        }
        return ResponseEntity.badRequest().body("Failed to delete CampaignImage.");
    }
}

package com.company.haloshop.campaignimage;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/campaign-images")
@RequiredArgsConstructor
public class CampaignImageController {

    private final CampaignImageService campaignImageService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CampaignImageRequestDto dto) {
        campaignImageService.createCampaignImage(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{seasonId}")
    public ResponseEntity<CampaignImageDto> get(@PathVariable Long seasonId) {
        return ResponseEntity.ok(campaignImageService.getCampaignImage(seasonId));
    }

    @PatchMapping("/{seasonId}")
    public ResponseEntity<Void> update(
            @PathVariable Long seasonId,
            @RequestBody CampaignImageRequestDto dto) {

        dto.setSeasonId(seasonId); // URI에서 받은 ID를 dto에 설정
        campaignImageService.updateCampaignImage(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{seasonId}")
    public ResponseEntity<Void> delete(@PathVariable Long seasonId) {
        campaignImageService.deleteCampaignImage(seasonId);
        return ResponseEntity.noContent().build();
    }
}

package com.company.haloshop.campaignimage;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/campaign-images")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CampaignImageController {

    private final CampaignImageService campaignImageService;
    private final CampaignImageUploadService uploadService;
    
    @GetMapping
    public ResponseEntity<List<CampaignImage>> getAllCampaignImages() {
        List<CampaignImage> images = campaignImageService.getAllCampaignImages();
        return ResponseEntity.ok(images);
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CampaignImageRequestDto dto) {
        campaignImageService.createCampaignImage(dto);
        return ResponseEntity.ok().build();
    }
    
    // 이미지 업로드용
    @PostMapping("/{seasonId}/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable Long seasonId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("level") int level) {
        try {
            String fileName = uploadService.uploadAndSaveImage(seasonId, file, level);
            return ResponseEntity.ok(Map.of("filename", fileName));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "파일 저장 실패"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "서버 내부 오류"));
        }
    }

    @GetMapping("/{seasonId}")
    public ResponseEntity<CampaignImageDto> get(@PathVariable Long seasonId) {
        return ResponseEntity.ok(campaignImageService.getCampaignImage(seasonId));
    }

    @PatchMapping("/{seasonId}")
    public ResponseEntity<Void> update(@PathVariable Long seasonId,
                                       @RequestBody CampaignImageRequestDto dto) {
        dto.setSeasonId(seasonId);
        campaignImageService.updateCampaignImage(dto);
        return ResponseEntity.ok().build(); // ✅ 204 대신 200 OK
    }

    @DeleteMapping("/{seasonId}")
    public ResponseEntity<Void> delete(@PathVariable Long seasonId) {
        campaignImageService.deleteCampaignImage(seasonId);
        return ResponseEntity.noContent().build();
    }
}

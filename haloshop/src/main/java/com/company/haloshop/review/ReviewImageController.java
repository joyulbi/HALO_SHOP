package com.company.haloshop.review;

import java.io.File;
import java.io.IOException;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") 
public class ReviewImageController {
    private final ReviewImageMapper reviewImageMapper;

    // 저장 경로: 프로젝트 내부 정적 리소스
    private final String uploadDir = new File("src/main/resources/static/upload/review/").getAbsolutePath() + "/";

    @PostMapping("/{reviewId}/upload")
    public ResponseEntity<?> uploadReviewImage(@PathVariable Long reviewId,
                                               @RequestParam("file") MultipartFile file) {
        try {
            // 🔧 파일명 정리: 한글/특수문자 제거
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body("파일명이 비어 있습니다.");
            }

            String sanitized = Normalizer.normalize(originalFilename, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")          // 한글 제거
                .replaceAll("[^a-zA-Z0-9._-]", "");       // 특수 문자 제거

            String fileName = UUID.randomUUID() + "_" + sanitized;
            File dest = new File(uploadDir + fileName);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);

            String url = "/upload/review/" + fileName;

            reviewImageMapper.insertReviewImage(reviewId, url, LocalDateTime.now());

            return ResponseEntity.ok().body(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("파일 업로드 실패: " + e.getMessage());
        }
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<List<String>> getUrlsByReviewId(@PathVariable Long reviewId) {
        List<String> urls = reviewImageMapper.findUrlsByReviewId(reviewId);
        return ResponseEntity.ok(urls);
    }
}
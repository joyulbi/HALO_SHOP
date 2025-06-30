package com.company.haloshop.review;

import java.io.File;
import java.io.IOException;
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
public class ReviewImageController {

    private final ReviewImageMapper reviewImageMapper;

    private final String uploadDir = new File("src/main/resources/static/upload/review/").getAbsolutePath() + "/";

    @PostMapping("/{reviewId}/upload")
    public ResponseEntity<?> uploadReviewImage(@PathVariable Long reviewId,
                                               @RequestParam("file") MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            File dest = new File(uploadDir + fileName);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);

            String url = "/upload/review/" + fileName; // static 기준 URL

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

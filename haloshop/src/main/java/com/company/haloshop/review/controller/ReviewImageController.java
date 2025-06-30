package com.company.haloshop.review.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.company.haloshop.review.mapper.ReviewImageMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews/images")
@RequiredArgsConstructor
public class ReviewImageController {

    private final ReviewImageMapper reviewImageMapper;

    private final String uploadDir = "/uploads/reviews/";

    @PostMapping("/{reviewId}/upload")
    public ResponseEntity<?> uploadReviewImage(@PathVariable Long reviewId,
                                               @RequestParam("file") MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            File dest = new File(uploadDir + fileName);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);

            String url = "/uploads/reviews/" + fileName;

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


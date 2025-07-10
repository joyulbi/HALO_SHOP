package com.company.haloshop.review;

import java.io.IOException;
import java.nio.file.*;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewImageController {
    private final ReviewImageMapper reviewImageMapper;

    // ✅ 저장 경로: 외부 디렉토리
    private final String uploadDir = "C:/upload/review/";

    @PostMapping("/{reviewId}/upload")
    public ResponseEntity<?> uploadReviewImage(@PathVariable Long reviewId,
                                               @RequestParam("file") MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            System.out.println("📥 업로드 요청 파일명: " + originalFilename);

            if (originalFilename == null || originalFilename.isEmpty()) {
                System.out.println("⚠️ 파일명이 비어 있음");
                return ResponseEntity.badRequest().body("파일명이 비어 있습니다.");
            }

            // 🔧 파일명 정리: 한글/특수문자 제거 및 공백 대체
            String sanitized = Normalizer.normalize(originalFilename, Normalizer.Form.NFD)
                    .replaceAll("[^\\p{ASCII}]", "")
                    .replaceAll("[^a-zA-Z0-9._-]", "_")
                    .replaceAll("\\s+", "_");

            String fileName = UUID.randomUUID() + "_" + sanitized;

            // ✅ 디렉토리 생성 (없으면)
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("📂 폴더 생성 완료: " + uploadPath.toAbsolutePath());
            } else {
                System.out.println("📂 폴더 존재: " + uploadPath.toAbsolutePath());
            }

            // ✅ 파일 저장
            Path targetPath = uploadPath.resolve(fileName).normalize();
            System.out.println("📦 최종 저장 경로: " + targetPath);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("✅ 파일 저장 완료: " + targetPath);

            String url = "/api/reviews/images/file/" + fileName;

            reviewImageMapper.insertReviewImage(reviewId, url, LocalDateTime.now());
            System.out.println("📝 DB URL 저장 완료: " + url);

            return ResponseEntity.ok().body(Map.of("url", url));
        } catch (IOException e) {
            System.out.println("❌ 파일 저장 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("파일 업로드 실패: " + e.getMessage());
        }
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<List<String>> getUrlsByReviewId(@PathVariable Long reviewId) {
        List<String> urls = reviewImageMapper.findUrlsByReviewId(reviewId);
        return ResponseEntity.ok(urls);
    }

    // ✅ 이미지 반환 API
    @GetMapping("/file/{filename:.+}")
    public ResponseEntity<Resource> serveReviewImage(@PathVariable String filename) {
        try {
            Path imagePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(imagePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                System.out.println("❌ 이미지 파일을 찾을 수 없음: " + imagePath);
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(imagePath);
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            System.out.println("❌ 이미지 반환 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

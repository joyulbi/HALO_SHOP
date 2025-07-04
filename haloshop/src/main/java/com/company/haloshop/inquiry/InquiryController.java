package com.company.haloshop.inquiry;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

	private final FileStorageService fileStorageService;
    private final InquiryService inquiryService;

    // 전체 문의 조회
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getInquiriesByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        // page: 1부터 시작, size: 페이지당 아이템 수

        int offset = (page - 1) * size;

        List<Inquiry> inquiries = inquiryService.findByStatusWithPaging(status, offset, size);
        int totalCount = inquiryService.countByStatus(status);

        Map<String, Object> result = new HashMap<>();
        result.put("data", inquiries);
        result.put("totalCount", totalCount);

        return ResponseEntity.ok(result);
    }

    // 단일 문의 조회
    @GetMapping("/{id}")
    public ResponseEntity<Inquiry> getInquiryById(@PathVariable Long id) {
        Inquiry inquiry = inquiryService.getInquiryById(id);
        return ResponseEntity.ok(inquiry);
    }

    // 문의 등록
    @PostMapping
    public Inquiry createInquiry(
            @RequestPart("inquiry") InquiryRequestDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        String storedFileName = null;

        if (file != null && !file.isEmpty()) {
            storedFileName = fileStorageService.storeFile(file);
        }

        dto.setFile(storedFileName);

        return inquiryService.createInquiry(dto);
    }


    // 문의 상태 수정
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestParam InquiryStatus status
    ) {
        inquiryService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    // 문의 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
        return ResponseEntity.noContent().build(); // 204
    }
}

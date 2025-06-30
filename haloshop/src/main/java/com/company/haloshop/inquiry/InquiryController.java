package com.company.haloshop.inquiry;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    // 전체 문의 조회
    @GetMapping
    public ResponseEntity<List<Inquiry>> getFilteredInquiries(
            @RequestParam(required = false) Long accountId,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) InquiryStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<Inquiry> inquiries = inquiryService.getInquiriesWithFilter(accountId, entityId, status, startDate, endDate);
        return ResponseEntity.ok(inquiries);
    }

    // 단일 문의 조회
    @GetMapping("/{id}")
    public ResponseEntity<Inquiry> getInquiryById(@PathVariable Long id) {
        Inquiry inquiry = inquiryService.getInquiryById(id);
        return ResponseEntity.ok(inquiry);
    }

    // 문의 등록
    @PostMapping
    public ResponseEntity<Void> createInquiry(@RequestBody Inquiry inquiry) {
        inquiryService.createInquiry(inquiry);
        return ResponseEntity.ok().build();
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

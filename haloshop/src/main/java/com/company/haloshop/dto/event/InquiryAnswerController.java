package com.company.haloshop.dto.event;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.event.InquiryAnswer;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inquiry-answers")
@RequiredArgsConstructor
public class InquiryAnswerController {

    private final InquiryAnswerService inquiryAnswerService;

    // 답변 등록
    @PostMapping
    public ResponseEntity<Void> createAnswer(@RequestBody InquiryAnswer answer) {
        inquiryAnswerService.createAnswer(answer);
        return ResponseEntity.ok().build();
    }

    // 답변 조회
    @GetMapping("/{inquiryId}")
    public ResponseEntity<InquiryAnswer> getAnswer(@PathVariable Long inquiryId) {
        InquiryAnswer answer = inquiryAnswerService.getAnswerByInquiryId(inquiryId);
        return ResponseEntity.ok(answer);
    }

    // 답변 수정
    @PutMapping("/{inquiryId}")
    public ResponseEntity<Void> updateAnswer(@PathVariable Long inquiryId, @RequestBody InquiryAnswer answer) {
        // PathVariable과 RequestBody inquiryId 일치 확인 권장
        if (!inquiryId.equals(answer.getInquiryId())) {
            return ResponseEntity.badRequest().build();
        }
        inquiryAnswerService.updateAnswer(answer);
        return ResponseEntity.ok().build();
    }

    // 답변 삭제
    @DeleteMapping("/{inquiryId}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long inquiryId) {
        inquiryAnswerService.deleteAnswer(inquiryId);
        return ResponseEntity.noContent().build();
    }
}

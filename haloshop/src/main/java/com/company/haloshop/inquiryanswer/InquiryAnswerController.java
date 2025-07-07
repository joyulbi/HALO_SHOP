package com.company.haloshop.inquiryanswer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inquiry-answers")
public class InquiryAnswerController {

    @Autowired
    private InquiryAnswerService inquiryAnswerService;

    // 1. 답변 등록
    @PostMapping
    public ResponseEntity<Void> createAnswer(@RequestBody InquiryAnswer answer, @AuthenticationPrincipal(expression = "id") Long principalId, Authentication authentication) {
        // principal.getName()이 userId 혹은 email이라면, DB 조회해서 accountId 추출 필요
        // 예를 들어, principal.getName()이 이메일이라 가정
    	System.out.println("프린시발 : "+ principalId);

        answer.setAccountId(principalId);

        inquiryAnswerService.createAnswer(answer);
        return ResponseEntity.ok().build();
    }

    // 2. 특정 문의에 대한 답변 조회
    @GetMapping("/{inquiryId}")
    public ResponseEntity<InquiryAnswer> getAnswer(@PathVariable Long inquiryId) {
        InquiryAnswer answer = inquiryAnswerService.getAnswerByInquiryId(inquiryId);
        return ResponseEntity.ok(answer);
    }

    // 3. 답변 수정
    @PutMapping("/{inquiryId}")
    public ResponseEntity<Void> updateAnswer(@PathVariable Long inquiryId, @RequestBody InquiryAnswer answer) {
        answer.setInquiryId(inquiryId);
        inquiryAnswerService.updateAnswer(answer);
        return ResponseEntity.ok().build();
    }

    // 4. 답변 삭제
    @DeleteMapping("/{inquiryId}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long inquiryId) {
        inquiryAnswerService.deleteAnswer(inquiryId);
        return ResponseEntity.ok().build();
    }
   
}

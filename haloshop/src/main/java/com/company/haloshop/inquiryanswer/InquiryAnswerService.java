package com.company.haloshop.inquiryanswer;

import java.util.HashMap;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.company.haloshop.inquiry.Inquiry;
import com.company.haloshop.inquiry.InquiryMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryAnswerService {

    private final InquiryAnswerMapper inquiryAnswerMapper;
    private final InquiryMapper inquiryMapper;

    // 답변 등록
    @Transactional
    public void createAnswer(InquiryAnswer answer) {
        inquiryAnswerMapper.insertInquiryAnswer(answer);
    }
    
    @Transactional
    public void createAnswer(InquiryAnswerRequestDto dto) {
        InquiryAnswer answer = new InquiryAnswer();

        // Inquiry 객체만 ID만 세팅해서 연관관계 설정
        Inquiry inquiry = new Inquiry();
        inquiry.setId(dto.getInquiryId());
        answer.setInquiry(inquiry);
        answer.setInquiryId(dto.getInquiryId());

        answer.setAnswer(dto.getAnswer());
        answer.setAccountId(dto.getAccountId());

        createAnswer(answer);
        // 답변된 문의 "답변완료" 처리
        Map<String, Object> param = new HashMap<>();
        param.put("id", dto.getInquiryId());
        param.put("status", "ANSWERED");

        // 상태 업데이트
        inquiryMapper.updateInquiryStatus(param);
    }

    // 답변 조회
    public InquiryAnswer getAnswerByInquiryId(Long inquiryId) {
        InquiryAnswer answer = inquiryAnswerMapper.findInquiryAnswerById(inquiryId);
        if (answer == null) {
            throw new IllegalArgumentException("Answer not found for inquiryId: " + inquiryId);
        }
        return answer;
    }

    // 답변 수정
    @Transactional
    public void updateAnswer(InquiryAnswer answer) {
        int updated = inquiryAnswerMapper.updateInquiryAnswer(answer);
        if (updated == 0) {
            throw new IllegalArgumentException("Failed to update answer for inquiryId: " + answer.getInquiryId());
        }
    }

    // 답변 삭제
    @Transactional
    public void deleteAnswer(Long inquiryId) {
        int deleted = inquiryAnswerMapper.deleteInquiryAnswer(inquiryId);
        if (deleted == 0) {
            throw new IllegalArgumentException("Answer not found for inquiryId: " + inquiryId);
        }
    }
}

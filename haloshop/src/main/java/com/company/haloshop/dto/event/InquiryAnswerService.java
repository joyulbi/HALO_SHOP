package com.company.haloshop.dto.event;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.company.haloshop.event.InquiryAnswer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryAnswerService {

    private final InquiryAnswerMapper inquiryAnswerMapper;

    // 답변 등록
    @Transactional
    public void createAnswer(InquiryAnswer answer) {
        inquiryAnswerMapper.insertInquiryAnswer(answer);
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

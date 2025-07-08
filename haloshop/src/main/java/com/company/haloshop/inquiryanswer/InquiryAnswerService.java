package com.company.haloshop.inquiryanswer;

import java.time.LocalDateTime;

import javax.transaction.Transactional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.company.haloshop.entity.member.Account;
import com.company.haloshop.event.EventEntity;
import com.company.haloshop.inquiry.Inquiry;
import com.company.haloshop.inquiry.InquiryService;
import com.company.haloshop.notification.Notification;
import com.company.haloshop.notification.NotificationEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryAnswerService {

    private final InquiryAnswerMapper inquiryAnswerMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final InquiryService inquiryService;

    // 답변 등록
    @Transactional
    public void createAnswer(InquiryAnswer answer) {
        if (answer.getInquiryId() == null) {
            throw new IllegalArgumentException("Inquiry ID must be provided");
        }
        if (answer.getAccountId() == null) {
            throw new IllegalArgumentException("Answer must have accountId of the responder");
        }

        // 단순히 답변 insert만 수행
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

package com.company.haloshop.inquiryanswer;

import javax.transaction.Transactional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.company.haloshop.inquiry.InquiryService;
import com.company.haloshop.inquiry.InquiryStatus;
import com.company.haloshop.notification.Notification;
import com.company.haloshop.notification.NotificationEvent;
import com.company.haloshop.notification.NotificationRequestDto;
import com.company.haloshop.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryAnswerService {

    private final InquiryAnswerMapper inquiryAnswerMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final NotificationService notificationService;
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
        Long inquiryId = answer.getInquiryId();
        
        // 답변된 문의 상태 변경
        inquiryService.updateStatus(inquiryId, InquiryStatus.ANSWERED);
        
        // 문의 작성자 조회
        Long inquiryOwnerId = inquiryService.getInquiryById(inquiryId).getAccount().getId();

        // 알림 생성 및 이벤트 발행 (답변 작성자와 문의 작성자가 다를 경우)
        if (!inquiryOwnerId.equals(answer.getAccountId())) {
            NotificationRequestDto notificationDto = new NotificationRequestDto();
            notificationDto.setReceiverId(inquiryOwnerId);
            notificationDto.setEntityId(1L); // EventEntity id, 예시로 1L (실제 타입에 맞게 변경)
            notificationDto.setReferenceId(inquiryId);

            Long notificationId = notificationService.createNotification(notificationDto);
        }
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

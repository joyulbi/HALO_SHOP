package com.company.haloshop.inquiryanswer;

import javax.transaction.Transactional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.company.haloshop.event.EventEntity;
import com.company.haloshop.inquiry.Inquiry;
import com.company.haloshop.inquiry.InquiryService;
import com.company.haloshop.inquiry.InquiryStatus;
import com.company.haloshop.notification.NotificationRequestDto;
import com.company.haloshop.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryAnswerService {

    private final InquiryAnswerMapper inquiryAnswerMapper;
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

        // 답변 등록
        inquiryAnswerMapper.insertInquiryAnswer(answer);
        Long inquiryId = answer.getInquiryId();

        // 문의 상태 변경
        inquiryService.updateStatus(inquiryId, InquiryStatus.ANSWERED);

        // 문의 정보 조회
        Inquiry inquiry = inquiryService.getInquiryById(inquiryId);
        Long inquiryOwnerId = inquiry.getAccount().getId();

        EventEntity entity = inquiry.getEntity();
        if (entity == null || entity.getId() == null) {
            throw new IllegalStateException("문의에 연결된 이벤트 Entity가 없습니다.");
        }
        Long eventEntity = (entity.getId() / 100 )*100;
        
        //System.out.println("엔티티 오리진 :"+entity);
        //System.out.println("이벤트 엔티티 :"+eventEntity);

        // 알림 생성
        if (!inquiryOwnerId.equals(answer.getAccountId())) {
            NotificationRequestDto notificationDto = new NotificationRequestDto();
            notificationDto.setReceiverId(inquiryOwnerId);
            notificationDto.setEntityId(eventEntity);
            notificationDto.setReferenceId(inquiryId);

            notificationService.createNotification(notificationDto);
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

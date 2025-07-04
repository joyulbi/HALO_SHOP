package com.company.haloshop.inquiryanswer;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.company.haloshop.entity.member.Account;
import com.company.haloshop.event.EventEntity;
import com.company.haloshop.inquiry.Inquiry;
import com.company.haloshop.inquiry.InquiryMapper;
import com.company.haloshop.notification.Notification;
import com.company.haloshop.notification.NotificationDto;
import com.company.haloshop.notification.NotificationEvent;
import com.company.haloshop.notification.NotificationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryAnswerService {

    private final InquiryAnswerMapper inquiryAnswerMapper;
    private final InquiryMapper inquiryMapper;
    private final NotificationMapper notificationMapper;
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    // 답변 등록
    @Transactional
    public void createAnswer(InquiryAnswer answer) {
        inquiryAnswerMapper.insertInquiryAnswer(answer);
    }
    
    @Transactional
    public void createAnswer(InquiryAnswerRequestDto dto) {
        InquiryAnswer answer = new InquiryAnswer();

        Inquiry inquiry = new Inquiry();
        inquiry.setId(dto.getInquiryId());
        answer.setInquiry(inquiry);
        answer.setInquiryId(dto.getInquiryId());

        answer.setAnswer(dto.getAnswer());
        answer.setAccountId(dto.getAccountId());

        createAnswer(answer);

        Map<String, Object> param = new HashMap<>();
        param.put("id", dto.getInquiryId());
        param.put("status", "ANSWERED");
        inquiryMapper.updateInquiryStatus(param);

        // 문의 작성자 accountId 조회
        Inquiry inquiryData = inquiryMapper.findInquiryById(dto.getInquiryId());
        Long receiverId = inquiryData.getAccount().getId();

        // 알림 DTO 생성
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setReceiverId(receiverId);
        notificationDto.setEntityId(1L);
        notificationDto.setReferenceId(answer.getInquiryId());  // 답변 또는 문의 id
        notificationDto.setIsRead(false);
        notificationDto.setCreatedAt(LocalDateTime.now());

        // 알림 DB 저장
        notificationMapper.createNotification(notificationDto);

        // 이벤트 발행 (실시간 웹소켓 푸시용)
        Notification notification = convertDtoToEntity(notificationDto);
        eventPublisher.publishEvent(new NotificationEvent(this, notification));
    }
    
    private Notification convertDtoToEntity(NotificationDto dto) {
        Notification notification = new Notification();
        // dto의 필드값을 Notification 엔티티에 세팅
        // 예시:
        notification.setReceiver(new Account(dto.getReceiverId())); // Account 생성자 또는 조회 필요
        notification.setReferenceId(dto.getReferenceId());
        notification.setIsRead(dto.getIsRead());
        notification.setCreatedAt(dto.getCreatedAt());

        // entity 필드는 필요에 따라 설정
        // notification.setEntity(...);

        return notification;
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

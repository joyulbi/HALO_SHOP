package com.company.haloshop.dto.event;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.company.haloshop.event.Inquiry;
import com.company.haloshop.event.InquiryStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryMapper inquiryMapper;

    // 문의 등록
    @Transactional
    public void createInquiry(Inquiry inquiry) {
        inquiryMapper.insertInquiry(inquiry);
    }

    // 전체 조회
    public List<Inquiry> getInquiriesWithFilter(Long accountId, Long entityId, InquiryStatus status,
            LocalDateTime startDate, LocalDateTime endDate) {
	Map<String, Object> filters = new HashMap<>();
	if (accountId != null) filters.put("accountId", accountId);
	if (entityId != null) filters.put("entityId", entityId);
	if (status != null) filters.put("status", status.name());
	if (startDate != null) filters.put("startDate", startDate);
	if (endDate != null) filters.put("endDate", endDate);
	
	return inquiryMapper.findAllInquiry(filters);
	}


    // 단일 조회
    public Inquiry getInquiryById(Long id) {
        Inquiry inquiry = inquiryMapper.findInquiryById(id);
        if (inquiry == null) {
            throw new IllegalArgumentException("Inquiry not found with id: " + id);
        }
        return inquiry;
    }

    // 상태 변경
    @Transactional
    public void updateStatus(Long id, InquiryStatus status) {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("status", status);
        int updated = inquiryMapper.updateInquiryStatus(params);
        if (updated == 0) {
            throw new IllegalArgumentException("Failed to update inquiry status. ID: " + id);
        }
    }

    // 삭제
    @Transactional
    public void deleteInquiry(Long id) {
        int deleted = inquiryMapper.deleteInquiry(id);
        if (deleted == 0) {
            throw new IllegalArgumentException("Inquiry not found with id: " + id);
        }
    }
}
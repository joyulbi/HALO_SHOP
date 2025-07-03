package com.company.haloshop.inquiry;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryMapper inquiryMapper;

    // 문의 등록
    @Transactional
    public Inquiry createInquiry(InquiryRequestDto dto) {
        inquiryMapper.insertInquiry(dto); // 이 dto는 accountId, entityId 있음
		return null;
    }

    // 전체 조회
    public List<Inquiry> getInquiriesWithFilter(
            Long accountId,
            Long entityId,
            InquiryStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        Map<String, Object> filters = new HashMap<>();

        if (accountId != null) {
            filters.put("accountId", accountId);
        }

        if (entityId != null) {
            filters.put("entityId", entityId);
        }

        if (status != null) {
            // MyBatis <choose> 조건에 맞춰 문자열로 넘김
            filters.put("status", status.name());
        }

        if (startDate != null) {
            filters.put("startDate", startDate);
        }

        if (endDate != null) {
            filters.put("endDate", endDate);
        }

        return inquiryMapper.findAllInquiry(filters);
    }

    public List<Inquiry> findByStatusWithPaging(String status, int offset, int size) {
        return inquiryMapper.selectByStatusWithPaging(status, offset, size);
    }

    public int countByStatus(String status) {
        return inquiryMapper.countByStatus(status);
    }

    // 단일 조회
    public Inquiry getInquiryById(Long id) {
        Inquiry inquiry = inquiryMapper.findInquiryById(id);
        if (inquiry == null) {
            throw new IllegalArgumentException("Inquiry not found with id: " + id);
        }
        return inquiry;
    }
    
    @Transactional(readOnly = true)
    public List<Inquiry> getInquiriesByAccountId(Long accountId) {
        return inquiryMapper.selectByAccountIdOrderByIdASC(accountId);
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
package com.company.haloshop.inquiry;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InquiryMapper {

    // 등록
    void insertInquiry(Inquiry inquiry);

    // 전체 조회
    List<Inquiry> findAllInquiry(Map<String, Object> filters);

    // 단일 조회
    Inquiry findInquiryById(Long id);

    // 상태 업데이트
    int updateInquiryStatus(Map<String, Object> param);

    // 삭제
    int deleteInquiry(Long id);
}

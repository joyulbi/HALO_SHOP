package com.company.haloshop.dto.event;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.event.InquiryAnswer;

@Mapper
public interface InquiryAnswerMapper {

    // 답변 등록
    void insertInquiryAnswer(InquiryAnswer inquiryAnswer);

    // 답변 조회 (inquiryId 기준)
    InquiryAnswer findInquiryAnswerById(Long inquiryId);

    // 답변 수정
    int updateInquiryAnswer(InquiryAnswer inquiryAnswer);

    // 답변 삭제
    int deleteInquiryAnswer(Long inquiryId);
}

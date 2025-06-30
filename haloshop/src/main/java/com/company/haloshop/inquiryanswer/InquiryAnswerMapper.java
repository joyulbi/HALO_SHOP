package com.company.haloshop.inquiryanswer;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface InquiryAnswerMapper {

    // 답변 등록
    void insertInquiryAnswer(InquiryAnswer inquiryAnswer);

    // 답변 조회 (inquiryId 기준)
    InquiryAnswer findInquiryAnswerById(@Param("inquiryId") Long inquiryId);

    // 답변 수정
    int updateInquiryAnswer(InquiryAnswer inquiryAnswer);

    // 답변 삭제
    int deleteInquiryAnswer(@Param("inquiryId") Long inquiryId);
}

package com.company.haloshop.inquiry;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface InquiryMapper {

    // 등록
    void insertInquiry(InquiryRequestDto dto);

    // 전체 조회
    List<Inquiry> findAllInquiry(Map<String, Object> filters);

    // 단일 조회
    Inquiry findInquiryById(Long id);

    // 상태 업데이트
    int updateInquiryStatus(Map<String, Object> param);

    // 삭제
    int deleteInquiry(Long id);
    
    // "제출됨"인 내 문의 삭제
    int deleteMySubmittedInquiry(@Param("id") Long id, @Param("accountId") Long accountId);


	List<Inquiry> selectByStatusWithPaging(String status, int offset, int size);

	int countByStatus(String status);
	
	// 본인 문의 조회
	 List<Inquiry> selectByAccountIdOrderByIdASC(@Param("accountId") Long accountId);
}

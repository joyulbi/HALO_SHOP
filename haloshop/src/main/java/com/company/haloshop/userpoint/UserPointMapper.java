package com.company.haloshop.userpoint;

import com.company.haloshop.dto.shop.UserPointDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserPointMapper {
	// 전체 조회 (관리자용)
    List<UserPointDto> findAll();

    // 회원 기준 단일 조회
    UserPointDto findByAccountId(Long accountId);

    // 생성
    void insert(UserPointDto userPoint);

    // 수정
    void update(UserPointDto userPoint);

    // 필요 시 삭제 (회원 탈퇴 시)
    void deleteByAccountId(Long accountId);
}

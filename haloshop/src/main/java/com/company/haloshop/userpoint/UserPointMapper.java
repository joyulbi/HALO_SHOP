package com.company.haloshop.userpoint;

import com.company.haloshop.dto.shop.UserPointDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserPointMapper {
    // 전체 조회
    List<UserPointDto> findAll();

    // 단일 조회
    UserPointDto findById(Long id);

    // 생성
    void insert(UserPointDto userPoint);

    // 수정
    void update(UserPointDto userPoint);

    // 삭제
    void delete(Long id);
}

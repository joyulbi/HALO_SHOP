package com.company.haloshop.userpoint;

import com.company.haloshop.dto.shop.UserPointDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param; 

import java.util.List;

@Mapper
public interface UserPointMapper {
    List<UserPointDto> findAll();
    UserPointDto findByAccountId(Long accountId);
    void insert(UserPointDto userPoint);
    void update(UserPointDto userPoint);
    void deleteByAccountId(Long accountId);

    void addPoint(@Param("accountId") Long accountId, @Param("pointToAdd") int pointToAdd); // ✅ @Param 추가 필요
}

package com.company.haloshop.membership;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.shop.MembershipDto;


@Mapper
public interface MembershipMapper {

    List<MembershipDto> findAllOrderByPriceDesc();

    MembershipDto findBestMatchByTotalPayment(long totalPayment);




    void insert(MembershipDto dto);

    void update(MembershipDto dto);

    void delete(Integer id);
}


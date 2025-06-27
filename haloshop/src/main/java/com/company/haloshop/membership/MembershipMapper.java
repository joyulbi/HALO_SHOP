package com.company.haloshop.membership;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.Membership;

@Mapper
public interface MembershipMapper {
    void insert(Membership membership);
    List<Membership> findAll();
    Membership findById(int id);
    void update(Membership membership);
    void delete(int id);
}

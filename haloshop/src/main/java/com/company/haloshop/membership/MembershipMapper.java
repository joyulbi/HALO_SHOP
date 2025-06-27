package com.company.haloshop.membership;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MembershipMapper {
    List<Membership> findAll();
    Membership findById(Integer id);
    void insert(Membership dto);
    void update(Membership dto);
    void delete(Integer id);
}

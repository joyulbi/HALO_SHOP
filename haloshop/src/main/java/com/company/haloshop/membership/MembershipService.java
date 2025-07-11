package com.company.haloshop.membership;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.MembershipDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipMapper membershipMapper;

    // 관리자용 전체 조회 (가격 기준 내림차순: 등급 기준 확인 시 편리)
    public List<MembershipDto> findAll() {
        return membershipMapper.findAllOrderByPriceDesc();
    }

    // 필요 시 단일 조회 (현재 로직에서 사용하지 않으면 제거 가능)
    // public MembershipDto findById(Integer id) {
    //     return membershipMapper.findById(id);
    // }

    // 생성
    public void insert(MembershipDto dto) {
        membershipMapper.insert(dto);
        
    }

    // 수정
    public void update(MembershipDto dto) {
        membershipMapper.update(dto);
    }

    // 삭제
    public void delete(Integer id) {
        membershipMapper.delete(id);
    }
}



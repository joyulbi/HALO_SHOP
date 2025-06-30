package com.company.haloshop.membership;

import com.company.haloshop.dto.shop.MembershipDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    // 전체 조회 (관리자 페이지 리스트)
    @GetMapping
    public List<MembershipDto> getAllMemberships() {
        return membershipService.findAll();
    }

    // 생성
    @PostMapping
    public void createMembership(@RequestBody MembershipDto dto) {
        membershipService.insert(dto);
    }

    //  수정
    @PutMapping("/{id}")
    public void updateMembership(@PathVariable Integer id, @RequestBody MembershipDto dto) {
        dto.setId(id);
        membershipService.update(dto);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public void deleteMembership(@PathVariable Integer id) {
        membershipService.delete(id);
    }
}

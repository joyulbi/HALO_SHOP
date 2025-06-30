package com.company.haloshop.userpoint;

import com.company.haloshop.dto.shop.UserPointDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/userpoint")
@RequiredArgsConstructor
public class UserPointController {

    private final UserPointService userPointService;

    // 관리자용 전체 조회
    @GetMapping
    public ResponseEntity<List<UserPointDto>> findAll() {
        return ResponseEntity.ok(userPointService.findAll());
    }

    // 회원별 단일 조회
    @GetMapping("/{accountId}")
    public ResponseEntity<UserPointDto> findByAccountId(@PathVariable Long accountId) {
        UserPointDto userPoint = userPointService.findByAccountId(accountId);
        if (userPoint == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userPoint);
    }

    // 수동 생성 (필요 시)
    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody UserPointDto userPoint) {
        userPointService.insert(userPoint);
        return ResponseEntity.ok().build();
    }

    // 수동 수정 (관리자 조정 용도)
    @PutMapping("/{accountId}")
    public ResponseEntity<Void> update(@PathVariable Long accountId, @RequestBody UserPointDto userPoint) {
        userPoint.setAccountId(accountId);
        userPointService.update(userPoint);
        return ResponseEntity.ok().build();
    }

    // 회원 탈퇴 시 연동 삭제
    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> delete(@PathVariable Long accountId) {
        userPointService.deleteByAccountId(accountId);
        return ResponseEntity.ok().build();
    }

    // 주문 후 포인트 적립 및 등급 갱신 엔드포인트 (테스트용)
    @PostMapping("/{accountId}/update-grade")
    public ResponseEntity<Void> updateUserPointAndGrade(
            @PathVariable Long accountId,
            @RequestParam Long totalPrice) {
        userPointService.updateUserPointAndGrade(accountId, totalPrice);
        return ResponseEntity.ok().build();
    }
}
